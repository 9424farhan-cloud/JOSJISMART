import { Product, ProductStatus } from '../types';
import { storageService } from './storageService';
import { authService } from './authService';
import { slugify, generateId } from '../utils/formatters';

export interface ProductFilterOptions {
  query?: string;
  categoryId?: string;
  sortBy?: 'newest' | 'price_asc' | 'price_desc' | 'popular';
  status?: ProductStatus | 'all';
  featuredOnly?: boolean;
}

export const productService = {
  getAllProducts(): Product[] {
    return storageService.getProducts();
  },

  getProductById(id: string): Product | undefined {
    return storageService.getProducts().find((p) => p.id === id);
  },

  getProductBySlug(slug: string): Product | undefined {
    return storageService.getProducts().find((p) => p.slug === slug);
  },

  getFeaturedProducts(limit: number = 4): Product[] {
    return storageService.getProducts()
      .filter((p) => p.isFeatured && p.status !== 'out_of_stock')
      .slice(0, limit);
  },

  getRecentProducts(limit: number = 8): Product[] {
    return storageService.getProducts()
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  },

  getRelatedProducts(productId: string, categoryId: string, limit: number = 4): Product[] {
    return storageService.getProducts()
      .filter((p) => p.id !== productId && p.categoryId === categoryId)
      .slice(0, limit);
  },

  filterProducts(options: ProductFilterOptions): Product[] {
    let items = storageService.getProducts();

    // Text search in name, description, category
    if (options.query && options.query.trim() !== '') {
      const q = options.query.toLowerCase().trim();
      items = items.filter((p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.categoryName.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (options.categoryId && options.categoryId !== 'all') {
      items = items.filter((p) => p.categoryId === options.categoryId);
    }

    // Status filter
    if (options.status && options.status !== 'all') {
      items = items.filter((p) => p.status === options.status);
    }

    // Featured only
    if (options.featuredOnly) {
      items = items.filter((p) => p.isFeatured);
    }

    // Sorting
    switch (options.sortBy) {
      case 'price_asc':
        items.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
        break;
      case 'price_desc':
        items.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
        break;
      case 'popular':
        items.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      case 'newest':
      default:
        items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }

    return items;
  },

  // ADMIN-ONLY CRUD OPERATIONS
  createProduct(data: Omit<Product, 'id' | 'slug' | 'createdAt' | 'updatedAt' | 'rating' | 'reviewCount'>): Product {
    authService.verifyAdminPermission();

    const products = storageService.getProducts();
    const id = generateId('prod');
    const slug = slugify(data.name) + '-' + Date.now().toString(36).slice(-4);
    const now = new Date().toISOString();

    const newProduct: Product = {
      ...data,
      id,
      slug,
      rating: 5.0,
      reviewCount: 0,
      createdAt: now,
      updatedAt: now,
    };

    products.unshift(newProduct);
    storageService.saveProducts(products);
    return newProduct;
  },

  updateProduct(id: string, updates: Partial<Omit<Product, 'id' | 'createdAt'>>): Product {
    authService.verifyAdminPermission();

    const products = storageService.getProducts();
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error(`Produk dengan ID ${id} tidak ditemukan.`);
    }

    const current = products[index];
    const updatedSlug = updates.name && updates.name !== current.name
      ? slugify(updates.name) + '-' + current.id.slice(-4)
      : current.slug;

    const updatedProduct: Product = {
      ...current,
      ...updates,
      slug: updatedSlug,
      updatedAt: new Date().toISOString(),
    };

    products[index] = updatedProduct;
    storageService.saveProducts(products);
    return updatedProduct;
  },

  deleteProduct(id: string): void {
    authService.verifyAdminPermission();

    const products = storageService.getProducts();
    const filtered = products.filter((p) => p.id !== id);
    if (filtered.length === products.length) {
      throw new Error(`Produk dengan ID ${id} tidak ditemukan.`);
    }
    storageService.saveProducts(filtered);
  },

  quickUpdateStock(id: string, newStock: number): Product {
    authService.verifyAdminPermission();

    const status: ProductStatus = newStock > 0 ? 'available' : 'out_of_stock';
    return this.updateProduct(id, { stock: newStock, status });
  },
};
