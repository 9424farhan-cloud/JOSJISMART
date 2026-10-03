import { Order, OrderStatus } from '../types';
import { storageService } from './storageService';
import { authService } from './authService';
import { generateId } from '../utils/formatters';

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

    orders.unshift(newOrder);
    storageService.saveOrders(orders);

    if (typeof window !== 'undefined') {
      try {
        window.dispatchEvent(new CustomEvent('josji_new_order', { detail: newOrder }));
      } catch (e) {
        console.error('Failed to dispatch new order event', e);
      }
    }

    return newOrder;
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
    return updated;
  },

  // ADMIN ONLY
  deleteOrder(orderId: string): void {
    authService.verifyAdminPermission();

    const orders = storageService.getOrders();
    const filtered = orders.filter((o) => o.id !== orderId);
    storageService.saveOrders(filtered);
  },
};
