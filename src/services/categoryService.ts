import { Category } from '../types';
import { storageService } from './storageService';
import { authService } from './authService';
import { slugify, generateId } from '../utils/formatters';

export const categoryService = {
  getAllCategories(): Category[] {
    return storageService.getCategories();
  },

  getCategoryById(id: string): Category | undefined {
    return storageService.getCategories().find((c) => c.id === id);
  },

  getCategoryBySlug(slug: string): Category | undefined {
    return storageService.getCategories().find((c) => c.slug === slug);
  },

  // ADMIN OPERATIONS
  createCategory(data: { name: string; description: string; icon?: string }): Category {
    authService.verifyAdminPermission();

    const categories = storageService.getCategories();
    const id = generateId('cat');
    const slug = slugify(data.name);

    const newCategory: Category = {
      id,
      name: data.name.trim(),
      slug,
      icon: data.icon || 'Tag',
      description: data.description.trim(),
    };

    categories.push(newCategory);
    storageService.saveCategories(categories);
    return newCategory;
  },

  updateCategory(id: string, updates: Partial<Omit<Category, 'id'>>): Category {
    authService.verifyAdminPermission();

    const categories = storageService.getCategories();
    const index = categories.findIndex((c) => c.id === id);
    if (index === -1) {
      throw new Error(`Kategori ${id} tidak ditemukan.`);
    }

    const current = categories[index];
    const updatedSlug = updates.name ? slugify(updates.name) : current.slug;

    const updatedCategory: Category = {
      ...current,
      ...updates,
      slug: updatedSlug,
    };

    categories[index] = updatedCategory;
    storageService.saveCategories(categories);
    return updatedCategory;
  },

  deleteCategory(id: string): void {
    authService.verifyAdminPermission();

    const categories = storageService.getCategories();
    const filtered = categories.filter((c) => c.id !== id);
    if (filtered.length === categories.length) {
      throw new Error(`Kategori ${id} tidak ditemukan.`);
    }
    storageService.saveCategories(filtered);
  },
};
