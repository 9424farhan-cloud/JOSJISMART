import { Product, Category, Order, StoreSettings } from '../types';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_ORDERS, INITIAL_SETTINGS } from '../data/initialData';

const STORAGE_KEYS = {
  PRODUCTS: 'josji_products_v3',
  CATEGORIES: 'josji_categories_v3',
  ORDERS: 'josji_orders_v3',
  SETTINGS: 'josji_settings_v3',
  SESSION: 'josji_session_v1',
  CART: 'josji_cart_v1',
  WISHLIST: 'josji_wishlist_v1',
  THEME: 'josji_theme_v1',
};

export const storageService = {
  // Products
  getProducts(): Product[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (!data) {
        this.saveProducts(INITIAL_PRODUCTS);
        return INITIAL_PRODUCTS;
      }
      const parsed: Product[] = JSON.parse(data);
      const missingInitial = INITIAL_PRODUCTS.filter(ip => !parsed.some(p => p.id === ip.id));
      if (missingInitial.length > 0) {
        const merged = [...parsed, ...missingInitial];
        this.saveProducts(merged);
        return merged;
      }
      return parsed;
    } catch {
      return INITIAL_PRODUCTS;
    }
  },

  saveProducts(products: Product[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    } catch (e) {
      console.error('Failed to save products to storage', e);
    }
  },

  // Categories
  getCategories(): Category[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      if (!data) {
        this.saveCategories(INITIAL_CATEGORIES);
        return INITIAL_CATEGORIES;
      }
      const parsed: Category[] = JSON.parse(data);
      const missingInitial = INITIAL_CATEGORIES.filter(ic => !parsed.some(c => c.id === ic.id));
      if (missingInitial.length > 0) {
        const merged = [...parsed, ...missingInitial];
        this.saveCategories(merged);
        return merged;
      }
      return parsed;
    } catch {
      return INITIAL_CATEGORIES;
    }
  },

  saveCategories(categories: Category[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    } catch (e) {
      console.error('Failed to save categories to storage', e);
    }
  },

  // Orders
  getOrders(): Order[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (!data) {
        this.saveOrders(INITIAL_ORDERS);
        return INITIAL_ORDERS;
      }
      const parsed: any[] = JSON.parse(data);
      if (!Array.isArray(parsed)) return INITIAL_ORDERS;
      return parsed
        .filter((o) => o && typeof o === 'object' && o.id && Array.isArray(o.items) && o.items.length > 0)
        .map((o) => ({
          ...o,
          id: String(o.id),
          customerName: String(o.customerName ?? 'Pelanggan'),
          customerPhone: String(o.customerPhone ?? '-'),
          shippingAddress: String(o.shippingAddress ?? '-'),
          shippingCity: String(o.shippingCity ?? '-'),
          shippingPostalCode: String(o.shippingPostalCode ?? '00000'),
          shippingCourier: String(o.shippingCourier ?? '-'),
          shippingCost: Number(o.shippingCost) || 0,
          paymentMethod: String(o.paymentMethod ?? '-'),
          items: Array.isArray(o.items) ? o.items : [],
          subtotal: Number(o.subtotal) || 0,
          discount: Number(o.discount) || 0,
          total: Number(o.total) || 0,
          status: o.status || 'Menunggu',
          createdAt: String(o.createdAt ?? new Date().toISOString()),
          updatedAt: String(o.updatedAt ?? o.createdAt ?? new Date().toISOString()),
        }));
    } catch {
      return INITIAL_ORDERS;
    }
  },

  saveOrders(orders: Order[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch (e) {
      console.error('Failed to save orders to storage', e);
    }
  },

  // Settings
  getSettings(): StoreSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (!data) {
        this.saveSettings(INITIAL_SETTINGS);
        return INITIAL_SETTINGS;
      }
      const parsed: StoreSettings = JSON.parse(data);
      if (!parsed.phone || parsed.phone.includes('0812-3456-7890') || parsed.phone.includes('081234567890')) {
        parsed.phone = INITIAL_SETTINGS.phone;
        this.saveSettings(parsed);
      }
      return parsed;
    } catch {
      return INITIAL_SETTINGS;
    }
  },

  saveSettings(settings: StoreSettings): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings to storage', e);
    }
  },

  // Reset to initial demo data
  resetDemoData(): void {
    this.saveProducts(INITIAL_PRODUCTS);
    this.saveCategories(INITIAL_CATEGORIES);
    this.saveOrders(INITIAL_ORDERS);
    this.saveSettings(INITIAL_SETTINGS);
  },

  // Full clear (empty store)
  clearAllProducts(): void {
    this.saveProducts([]);
  },
};
