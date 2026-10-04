import { Order, OrderStatus } from '../types';
import { storageService } from './storageService';
import { authService } from './authService';
import { generateId } from '../utils/formatters';
import { db } from './firebase';
import {
  collection,
  setDoc,
  doc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
} from 'firebase/firestore';

const ORDER_SYNC_CHANNEL = 'josji_orders_sync_v2';
const ORDER_EVENT_KEY = 'josji_order_event_v2';
const CLOUD_SYNC_TOPIC = 'josji_orders_live_v2';
const ACK_STORAGE_KEY = 'josji_acknowledged_orders_v2';

export const orderService = {
  getAllOrders(): Order[] {
    // Only Admin can see full store orders
    authService.verifyAdminPermission();
    return storageService.getOrders();
  },

  getOrderById(id: string): Order | undefined {
    return storageService.getOrders().find((o) => o.id === id);
  },

  getOrdersByCustomerPhone(phone: string): Order[] {
    const cleanPhone = phone.replace(/[^\d]/g, '');
    return storageService.getOrders().filter((o) => o.customerPhone.replace(/[^\d]/g, '') === cleanPhone);
  },

  getOrdersByEmail(email: string): Order[] {
    return storageService.getOrders().filter((o) => o.customerEmail?.toLowerCase() === email.toLowerCase());
  },

  // Customer or Viewer can place an order
  createOrder(orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Order {
    const orders = storageService.getOrders();
    const id = generateId('ORD');
    const now = new Date().toISOString();

    const newOrder: Order = {
      ...orderData,
      id,
      status: 'Menunggu',
      createdAt: now,
      updatedAt: now,
    };

    // 1. Save to local storage for instant offline/fallback cache
    orders.unshift(newOrder);
    storageService.saveOrders(orders);

    // 2. Broadcast via Storage Event (Cross-Tab sync across all tabs of same browser)
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(
          ORDER_EVENT_KEY,
          JSON.stringify({ type: 'NEW_ORDER', order: newOrder, timestamp: Date.now() })
        );
      }
    } catch (e) {
      console.warn('Storage event write skipped:', e);
    }

    // 3. Broadcast via BroadcastChannel API (Instant multi-tab communication)
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        const channel = new BroadcastChannel(ORDER_SYNC_CHANNEL);
        channel.postMessage({ type: 'NEW_ORDER', order: newOrder, timestamp: Date.now() });
        channel.close();
      }
    } catch (e) {
      console.warn('BroadcastChannel postMessage error:', e);
    }

    // 4. Dispatch same-window local custom event
    if (typeof window !== 'undefined') {
      try {
        window.dispatchEvent(new CustomEvent('josji_new_order', { detail: newOrder }));
      } catch (e) {
        console.error('Failed to dispatch new order event', e);
      }
    }

    // 5. Cloud Relay Synchronization (Instant Cross-Device, Cross-Browser & Incognito sync)
    try {
      fetch(`https://ntfy.sh/${CLOUD_SYNC_TOPIC}`, {
        method: 'POST',
        headers: {
          Title: 'Pesanan Baru Masuk!',
          Tags: 'bell,shopping_cart',
        },
        body: JSON.stringify({ type: 'NEW_ORDER', order: newOrder, timestamp: Date.now() }),
      }).catch((err) => {
        console.warn('Cloud relay publish notice:', err);
      });
    } catch (e) {
      console.warn('Cloud relay write skipped:', e);
    }

    // 6. Sync to Firebase Firestore cloud (if enabled / active)
    try {
      setDoc(doc(db, 'orders', newOrder.id), newOrder).catch((err) => {
        console.warn('Firestore cloud sync notice:', err?.message || err);
      });
    } catch (e) {
      console.warn('Firestore write skipped:', e);
    }

    return newOrder;
  },

  // Real-time Multi-Channel Subscription for Admin (Instant Cross-Device, Cross-Tab & Cloud)
  subscribeToOrders(
    callback: (orders: Order[], incomingNewOrder?: Order) => void
  ): () => void {
    const seenOrderIds = new Set<string>();
    
    // Retrieve already acknowledged alert orders
    let acknowledgedIds: Set<string>;
    try {
      const stored = sessionStorage.getItem(ACK_STORAGE_KEY);
      acknowledgedIds = new Set(stored ? JSON.parse(stored) : []);
    } catch {
      acknowledgedIds = new Set();
    }

    const saveAcknowledged = () => {
      try {
        sessionStorage.setItem(ACK_STORAGE_KEY, JSON.stringify([...acknowledgedIds]));
      } catch {}
    };

    const initialOrders = storageService.getOrders();
    initialOrders.forEach((o) => seenOrderIds.add(o.id));

    // Check if there is an unacknowledged pending order from a recent purchase
    const unacknowledgedPending = initialOrders.find(
      (o) => o.status === 'Menunggu' && !acknowledgedIds.has(o.id)
    );

    if (unacknowledgedPending) {
      acknowledgedIds.add(unacknowledgedPending.id);
      saveAcknowledged();
      callback(initialOrders, unacknowledgedPending);
    } else {
      callback(initialOrders);
    }

    // Sanitize any incoming raw order object to guarantee safe fields
    const sanitizeOrder = (raw: any): Order => {
      return {
        id: String(raw.id || generateId('ORD')),
        customerName: String(raw.customerName || 'Pelanggan'),
        customerPhone: String(raw.customerPhone || '-'),
        customerEmail: raw.customerEmail ? String(raw.customerEmail) : undefined,
        shippingAddress: String(raw.shippingAddress || '-'),
        shippingCity: String(raw.shippingCity || '-'),
        shippingPostalCode: String(raw.shippingPostalCode || '00000'),
        shippingCourier: String(raw.shippingCourier || 'Reguler'),
        shippingCost: Number(raw.shippingCost) || 0,
        paymentMethod: String(raw.paymentMethod || 'Transfer'),
        items: Array.isArray(raw.items) ? raw.items : [],
        subtotal: Number(raw.subtotal) || 0,
        discount: Number(raw.discount) || 0,
        total: Number(raw.total) || 0,
        status: (raw.status as OrderStatus) || 'Menunggu',
        notes: raw.notes ? String(raw.notes) : undefined,
        createdAt: String(raw.createdAt || new Date().toISOString()),
        updatedAt: String(raw.updatedAt || new Date().toISOString()),
      };
    };

    // Unified dispatch helper for incoming orders from any channel
    const dispatchIncomingOrder = (rawOrd: any) => {
      if (!rawOrd || !rawOrd.id) return;
      const ord = sanitizeOrder(rawOrd);

      const currentOrders = storageService.getOrders();
      const existingIdx = currentOrders.findIndex((o) => o.id === ord.id);
      let updatedList: Order[];

      if (existingIdx === -1) {
        updatedList = [ord, ...currentOrders];
        storageService.saveOrders(updatedList);
      } else {
        // If order updated in cloud
        updatedList = [...currentOrders];
        updatedList[existingIdx] = { ...updatedList[existingIdx], ...ord };
        storageService.saveOrders(updatedList);
      }

      if (!acknowledgedIds.has(ord.id)) {
        seenOrderIds.add(ord.id);
        acknowledgedIds.add(ord.id);
        saveAcknowledged();
        callback(updatedList, ord.status === 'Menunggu' ? ord : undefined);
      } else {
        callback(updatedList);
      }
    };

    // 1. BroadcastChannel Listener (Instant same-browser multi-tab)
    let bc: BroadcastChannel | null = null;
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        bc = new BroadcastChannel(ORDER_SYNC_CHANNEL);
        bc.onmessage = (event) => {
          const data = event.data;
          if (data && data.type === 'NEW_ORDER' && data.order) {
            dispatchIncomingOrder(data.order);
          } else if (data && (data.type === 'ORDER_UPDATED' || data.type === 'ORDER_DELETED')) {
            callback(storageService.getOrders());
          }
        };
      } catch (err) {
        console.warn('BroadcastChannel subscription error:', err);
      }
    }

    // 2. Storage Event Listener (Cross-tab fallback)
    const handleStorageEvent = (e: StorageEvent) => {
      if (e.key === ORDER_EVENT_KEY && e.newValue) {
        try {
          const payload = JSON.parse(e.newValue);
          if (payload && payload.type === 'NEW_ORDER' && payload.order) {
            dispatchIncomingOrder(payload.order);
          } else if (payload && payload.type === 'ORDER_UPDATED') {
            callback(storageService.getOrders());
          }
        } catch {}
      } else if (e.key === 'josji_orders_v3') {
        callback(storageService.getOrders());
      }
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageEvent);
    }

    // 3. Local CustomEvent Listener (Same-window events)
    const handleLocalEvent = (e: any) => {
      if (e?.detail) {
        dispatchIncomingOrder(e.detail);
      }
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('josji_new_order', handleLocalEvent);
    }

    // 4. Cloud Relay Real-Time SSE Stream (Cross-Device & Cross-Browser instant sync)
    let eventSource: EventSource | null = null;
    if (typeof window !== 'undefined' && 'EventSource' in window) {
      try {
        eventSource = new EventSource(`https://ntfy.sh/${CLOUD_SYNC_TOPIC}/sse`);
        eventSource.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data && data.message) {
              const parsed = typeof data.message === 'string' ? JSON.parse(data.message) : data.message;
              const ord: Order | undefined = parsed?.order || (parsed?.id ? parsed : undefined);
              if (ord) {
                dispatchIncomingOrder(ord);
              }
            }
          } catch {}
        };
        eventSource.onerror = () => {
          // SSE automatically attempts reconnection
        };
      } catch (err) {
        console.warn('Cloud relay SSE subscription error:', err);
      }
    }

    // 5. Cloud Relay Polling Fallback (Polls recent cloud messages immediately & every 8s)
    let pollInterval: any = null;
    const pollCloudOrders = async () => {
      try {
        const res = await fetch(`https://ntfy.sh/${CLOUD_SYNC_TOPIC}/json?poll=1`);
        if (!res.ok) return;
        const text = await res.text();
        const lines = text.trim().split('\n').filter(Boolean);
        for (const line of lines) {
          try {
            const msgObj = JSON.parse(line);
            if (msgObj.event === 'message' && msgObj.message) {
              const parsed = typeof msgObj.message === 'string' ? JSON.parse(msgObj.message) : msgObj.message;
              const ord: Order | undefined = parsed?.order || (parsed?.id ? parsed : undefined);
              if (ord && ord.id) {
                dispatchIncomingOrder(ord);
              }
            }
          } catch {}
        }
      } catch {}
    };
    
    // Initial immediate poll to catch any orders made while admin was offline
    if (typeof window !== 'undefined') {
      pollCloudOrders();
      pollInterval = setInterval(pollCloudOrders, 8000);
    }

    // 6. Firestore Real-Time Listener (if enabled in Firebase project)
    let unsubscribeFirestore: (() => void) | null = null;
    try {
      const ordersRef = collection(db, 'orders');
      const q = query(ordersRef, orderBy('createdAt', 'desc'));

      unsubscribeFirestore = onSnapshot(
        q,
        (snapshot) => {
          const cloudOrders: Order[] = [];
          snapshot.forEach((docSnap) => {
            cloudOrders.push(docSnap.data() as Order);
          });

          if (cloudOrders.length > 0) {
            storageService.saveOrders(cloudOrders);
          }

          let newOrderFound: Order | undefined;
          snapshot.docChanges().forEach((change) => {
            if (change.type === 'added') {
              newOrderFound = change.doc.data() as Order;
            }
          });

          if (newOrderFound) {
            dispatchIncomingOrder(newOrderFound);
          } else {
            callback(cloudOrders.length > 0 ? cloudOrders : storageService.getOrders());
          }
        },
        (error) => {
          console.warn('Firestore subscription fallback active (using multi-layer cloud relay):', error?.message || error);
        }
      );
    } catch (err) {
      console.warn('Firestore subscription skipped:', err);
    }

    // Return cleanup function
    return () => {
      if (bc) {
        try { bc.close(); } catch {}
      }
      if (typeof window !== 'undefined') {
        window.removeEventListener('storage', handleStorageEvent);
        window.removeEventListener('josji_new_order', handleLocalEvent);
      }
      if (eventSource) {
        try { eventSource.close(); } catch {}
      }
      if (pollInterval) {
        clearInterval(pollInterval);
      }
      if (unsubscribeFirestore) {
        try { unsubscribeFirestore(); } catch {}
      }
    };
  },

  // ADMIN ONLY
  updateOrderStatus(orderId: string, status: OrderStatus, notes?: string): Order {
    authService.verifyAdminPermission();

    const orders = storageService.getOrders();
    const index = orders.findIndex((o) => o.id === orderId);
    if (index === -1) {
      throw new Error(`Pesanan ${orderId} tidak ditemukan.`);
    }

    const current = orders[index];
    const updated: Order = {
      ...current,
      status,
      notes: notes !== undefined ? notes : current.notes,
      updatedAt: new Date().toISOString(),
    };

    orders[index] = updated;
    storageService.saveOrders(orders);

    // Broadcast update across tabs
    try {
      if (typeof window !== 'undefined') {
        if ('BroadcastChannel' in window) {
          const channel = new BroadcastChannel(ORDER_SYNC_CHANNEL);
          channel.postMessage({ type: 'ORDER_UPDATED', orderId, status });
          channel.close();
        }
        localStorage.setItem(
          ORDER_EVENT_KEY,
          JSON.stringify({ type: 'ORDER_UPDATED', orderId, status, timestamp: Date.now() })
        );
      }
    } catch {}

    // Sync status update to Firestore
    try {
      updateDoc(doc(db, 'orders', orderId), {
        status,
        notes: updated.notes,
        updatedAt: updated.updatedAt,
      }).catch((e) => console.warn('Firestore updateDoc notice:', e?.message || e));
    } catch (e) {
      console.warn('Firestore updateDoc skipped:', e);
    }

    return updated;
  },

  // ADMIN ONLY
  deleteOrder(orderId: string): void {
    authService.verifyAdminPermission();

    const orders = storageService.getOrders();
    const filtered = orders.filter((o) => o.id !== orderId);
    storageService.saveOrders(filtered);

    // Broadcast delete across tabs
    try {
      if (typeof window !== 'undefined') {
        if ('BroadcastChannel' in window) {
          const channel = new BroadcastChannel(ORDER_SYNC_CHANNEL);
          channel.postMessage({ type: 'ORDER_DELETED', orderId });
          channel.close();
        }
        localStorage.setItem(
          ORDER_EVENT_KEY,
          JSON.stringify({ type: 'ORDER_DELETED', orderId, timestamp: Date.now() })
        );
      }
    } catch {}

    // Delete from Firestore
    try {
      deleteDoc(doc(db, 'orders', orderId)).catch((e) =>
        console.warn('Firestore deleteDoc notice:', e?.message || e)
      );
    } catch (e) {
      console.warn('Firestore deleteDoc skipped:', e);
    }
  },

  // Helper for admin to trigger an instant test notification
  triggerTestOrderNotification(): Order {
    const testOrder: Order = {
      id: generateId('TEST-ORD'),
      customerName: 'Budi Santoso (Akun Pelanggan Demo)',
      customerPhone: '081234567890',
      customerEmail: 'budi.santoso@gmail.com',
      shippingAddress: 'Jl. Pantai Indah Kapuk No. 88, Pesisir Tropis',
      shippingCity: 'Pesisir Tropis',
      shippingPostalCode: '14470',
      shippingCourier: 'JNE Reguler',
      shippingCost: 15000,
      paymentMethod: 'qris',
      items: [
        {
          productId: 'prod-1',
          productName: 'Kemeja Linen Pesisir Tropis Premium',
          price: 249000,
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80',
        },
      ],
      subtotal: 249000,
      discount: 0,
      total: 264000,
      status: 'Menunggu',
      notes: 'Mohon dicek ya min, ini pesanan akun baru!',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Save and dispatch through the multi-layer pipeline
    const orders = storageService.getOrders();
    orders.unshift(testOrder);
    storageService.saveOrders(orders);

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(
          ORDER_EVENT_KEY,
          JSON.stringify({ type: 'NEW_ORDER', order: testOrder, timestamp: Date.now() })
        );
        window.dispatchEvent(new CustomEvent('josji_new_order', { detail: testOrder }));
        if ('BroadcastChannel' in window) {
          const channel = new BroadcastChannel(ORDER_SYNC_CHANNEL);
          channel.postMessage({ type: 'NEW_ORDER', order: testOrder, timestamp: Date.now() });
          channel.close();
        }
      } catch {}
    }

    return testOrder;
  },
};
