import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product } from '../types';
import { useToast } from './ToastContext';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number, selectedVariants?: Record<string, string>) => void;
  removeFromCart: (productId: string, selectedVariants?: Record<string, string>) => void;
  updateQuantity: (productId: string, quantity: number, selectedVariants?: Record<string, string>) => void;
  clearCart: () => void;
  subtotal: number;
  totalItems: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  checkoutOpen: boolean;
  setCheckoutOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);
const CART_STORAGE_KEY = 'josji_cart_v1';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const data = localStorage.getItem(CART_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save cart to storage', e);
    }
  }, [items]);

  const areVariantsEqual = (v1: Record<string, string> = {}, v2: Record<string, string> = {}): boolean => {
    const k1 = Object.keys(v1);
    const k2 = Object.keys(v2);
    if (k1.length !== k2.length) return false;
    return k1.every((key) => v1[key] === v2[key]);
  };

  const addToCart = (
    product: Product,
    quantity: number = 1,
    selectedVariants: Record<string, string> = {}
  ) => {
    if (product.stock <= 0) {
      showToast({
        type: 'warning',
        title: 'Stok Habis',
        message: 'Maaf, produk ini sedang tidak tersedia.',
      });
      return;
    }

    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && areVariantsEqual(item.selectedVariants, selectedVariants)
      );

      if (existingIndex > -1) {
        const currentQty = prev[existingIndex].quantity;
        const newQty = Math.min(currentQty + quantity, product.stock);

        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
        };
        return updated;
      } else {
        const validQty = Math.min(quantity, product.stock);
        return [...prev, { product, quantity: validQty, selectedVariants }];
      }
    });

    showToast({
      type: 'success',
      title: 'Ditambahkan ke Keranjang',
      message: `${quantity}x ${product.name} berhasil dimasukkan.`,
    });
  };

  const removeFromCart = (productId: string, selectedVariants: Record<string, string> = {}) => {
    setItems((prev) =>
      prev.filter(
        (item) => !(item.product.id === productId && areVariantsEqual(item.selectedVariants, selectedVariants))
      )
    );
  };

  const updateQuantity = (
    productId: string,
    quantity: number,
    selectedVariants: Record<string, string> = {}
  ) => {
    if (quantity <= 0) {
      removeFromCart(productId, selectedVariants);
      return;
    }

    setItems((prev) =>
      prev.map((item) => {
        if (item.product.id === productId && areVariantsEqual(item.selectedVariants, selectedVariants)) {
          const maxStock = item.product.stock;
          return {
            ...item,
            quantity: Math.min(quantity, maxStock),
          };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const subtotal = items.reduce((sum, item) => {
    const unitPrice = item.product.discountPrice ?? item.product.price;
    return sum + unitPrice * item.quantity;
  }, 0);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        subtotal,
        totalItems,
        isCartOpen,
        setIsCartOpen,
        checkoutOpen,
        setCheckoutOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
