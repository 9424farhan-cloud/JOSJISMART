import { Product, Category, Order, StoreSettings } from '../types';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_ORDERS, INITIAL_SETTINGS } from '../data/initialData';

const STORAGE_KEYS = {
  PRODUCTS: 'josji_products_v1',
  CATEGORIES: 'josji_categories_v1',
  ORDERS: 'josji_orders_v1',
  SETTINGS: 'josji_settings_v1',
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
      return JSON.parse(data);
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
      return JSON.parse(data);
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
      return JSON.parse(data);
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
      return JSON.parse(data);
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
