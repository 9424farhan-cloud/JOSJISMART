export type UserRole = 'ADMIN' | 'VIEWER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  authProvider: 'credentials' | 'google';
  createdAt: string;
}

export interface Specification {
  label: string;
  value: string;
}

export interface ProductVariant {
  name: string;
  options: string[];
}

export type ProductStatus = 'available' | 'preorder' | 'out_of_stock';

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  discountPrice?: number;
  stock: number;
  categoryId: string;
  categoryName: string;
  description: string;
  specifications: Specification[];
  variants: ProductVariant[];
  weight: number; // in grams
  status: ProductStatus;
  isFeatured: boolean;
  images: string[];
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariants: Record<string, string>;
}

export type OrderStatus = 'Menunggu' | 'Diproses' | 'Dikirim' | 'Selesai' | 'Dibatalkan';

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  image: string;
  selectedVariants?: Record<string, string>;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  shippingAddress: string;
  shippingCity: string;
  shippingPostalCode: string;
  shippingCourier: string;
  shippingCost: number;
  paymentMethod: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  total: number;
  status: OrderStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  baseShippingCost: number;
  freeShippingMinAmount: number;
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  heroButtonText: string;
  promoActive: boolean;
  promoTitle: string;
  promoSubtitle: string;
  promoCode: string;
  promoDiscountPercent: number;
  promoImage: string;
}
