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

    // 2. Sync to Firebase Firestore cloud so Admin immediately receives it cross-device
    try {
      setDoc(doc(db, 'orders', newOrder.id), newOrder).catch((err) => {
        console.warn('Firestore cloud sync warning:', err);
      });
    } catch (e) {
      console.warn('Firestore write skipped:', e);
    }

    // 3. Dispatch local event for same-window / multi-tab listeners
    if (typeof window !== 'undefined') {
      try {
        window.dispatchEvent(new CustomEvent('josji_new_order', { detail: newOrder }));
      } catch (e) {
        console.error('Failed to dispatch new order event', e);
      }
    }

    return newOrder;
  },

  // Real-time Cloud Subscription for Admin cross-device instant alerts
  subscribeToOrders(
    callback: (orders: Order[], incomingNewOrder?: Order) => void
  ): () => void {
    let isInitialized = false;
    try {
      const ordersRef = collection(db, 'orders');
      const q = query(ordersRef, orderBy('createdAt', 'desc'));

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const cloudOrders: Order[] = [];
          snapshot.forEach((docSnap) => {
            cloudOrders.push(docSnap.data() as Order);
          });

          // Sync cloud list to local cache
          if (cloudOrders.length > 0) {
            storageService.saveOrders(cloudOrders);
          }

          if (!isInitialized) {
            isInitialized = true;
            callback(cloudOrders.length > 0 ? cloudOrders : storageService.getOrders());
          } else {
            // Find newly added order
            let newOrderFound: Order | undefined;
            snapshot.docChanges().forEach((change) => {
              if (change.type === 'added') {
                newOrderFound = change.doc.data() as Order;
              }
            });
            callback(cloudOrders, newOrderFound);
          }
        },
        (error) => {
          console.warn('Firestore subscription fallback to local cache:', error);
          callback(storageService.getOrders());
        }
      );

      return unsubscribe;
    } catch (err) {
      console.warn('Firestore subscription unavailable:', err);
      callback(storageService.getOrders());
      return () => {};
    }
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

    // Sync status update to Firestore
    try {
      updateDoc(doc(db, 'orders', orderId), {
        status,
        notes: updated.notes,
        updatedAt: updated.updatedAt,
      }).catch((e) => console.warn('Firestore updateDoc warning:', e));
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

    // Delete from Firestore
    try {
      deleteDoc(doc(db, 'orders', orderId)).catch((e) =>
        console.warn('Firestore deleteDoc warning:', e)
      );
    } catch (e) {
      console.warn('Firestore deleteDoc skipped:', e);
    }
  },
};
