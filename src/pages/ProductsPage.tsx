import React, { useState, useMemo } from 'react';
import { Product, Category, ProductStatus } from '../types';
import { ProductCard } from '../components/shop/ProductCard';
import { Search, Filter, SlidersHorizontal, Package, X } from 'lucide-react';

interface ProductsPageProps {
  products: Product[];
  categories: Category[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  onSelectProduct: (product: Product) => void;
}

export const ProductsPage: React.FC<ProductsPageProps> = ({
  products,
  categories,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  onSelectProduct,
}) => {
  const [sortBy, setSortBy] = useState<'newest' | 'price_asc' | 'price_desc' | 'popular'>('newest');
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [onlyFeatured, setOnlyFeatured] = useState(false);

  // Realtime search and filters
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search query in Name, Description, CategoryName
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.categoryName.toLowerCase().includes(q)
      );
    }

    // Category
    if (selectedCategory && selectedCategory !== 'all') {
      result = result.filter((p) => p.categoryId === selectedCategory);
    }

    // In Stock Only
    if (onlyInStock) {
      result = result.filter((p) => p.stock > 0 && p.status === 'available');
    }

    // Featured Only
    if (onlyFeatured) {
      result = result.filter((p) => p.isFeatured);
    }

    // Sort
    switch (sortBy) {
      case 'price_asc':
        result.sort((a, b) => (a.discountPrice ?? a.price) - (b.discountPrice ?? b.price));
        break;
      case 'price_desc':
        result.sort((a, b) => (b.discountPrice ?? b.price) - (a.discountPrice ?? a.price));
        break;
      case 'popular':
        result.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      case 'newest':
      default:
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }

    return result;
  }, [products, searchQuery, selectedCategory, onlyInStock, onlyFeatured, sortBy]);

  const activeCategoryObj = categories.find((c) => c.id === selectedCategory);

  return (
    <div className="py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* PAGE HEADER */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {activeCategoryObj ? activeCategoryObj.name : 'Katalog Seluruh Produk'}
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {activeCategoryObj
              ? activeCategoryObj.description
              : 'Jelajahi produk pilihan berkualitas dengan tema pesisir tropis.'}
          </p>
        </div>

        {/* SEARCH & FILTER CONTROLS */}
        <div className="bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700/80 p-4 sm:p-5 shadow-xs mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            
            {/* SEARCH INPUT */}
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Cari nama, bahan, atau deskripsi barang..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-ocean-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* CATEGORY SELECTOR */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-ocean-500"
            >
              <option value="all">Semua Kategori ({products.length})</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            {/* SORTING SELECTOR */}
            <div className="flex items-center gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-ocean-500"
              >
                <option value="newest">Terbaru</option>
                <option value="popular">Terpopuler</option>
                <option value="price_asc">Harga Terendah</option>
                <option value="price_desc">Harga Tertinggi</option>
              </select>
            </div>
          </div>

          {/* TOGGLE FILTERS */}
          <div className="flex flex-wrap items-center gap-3 pt-1 border-t border-slate-100 dark:border-slate-700/60 text-xs">
            <span className="text-slate-400 font-medium">Filter Tambahan:</span>

            <button
              onClick={() => setOnlyInStock(!onlyInStock)}
              className={`px-3 py-1.5 rounded-lg border transition-colors ${
                onlyInStock
                  ? 'bg-ocean-50 text-ocean-700 border-ocean-300 dark:bg-ocean-950 dark:text-ocean-300 dark:border-ocean-800 font-bold'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
              }`}
            >
              Hanya Stok Tersedia
            </button>

            <button
              onClick={() => setOnlyFeatured(!onlyFeatured)}
              className={`px-3 py-1.5 rounded-lg border transition-colors ${
                onlyFeatured
                  ? 'bg-ocean-50 text-ocean-700 border-ocean-300 dark:bg-ocean-950 dark:text-ocean-300 dark:border-ocean-800 font-bold'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
              }`}
            >
              ⭐ Produk Unggulan
            </button>

            {(searchQuery || selectedCategory !== 'all' || onlyInStock || onlyFeatured) && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setOnlyInStock(false);
                  setOnlyFeatured(false);
                }}
                className="text-xs text-rose-500 hover:text-rose-600 font-semibold ml-auto"
              >
                Reset Semua Filter
              </button>
            )}
          </div>
        </div>

        {/* PRODUCT GRID OR EMPTY STATE */}
        {filteredProducts.length === 0 ? (
          <div className="py-20 text-center bg-white dark:bg-slate-800/50 rounded-3xl border border-slate-200 dark:border-slate-800 p-8">
            <div className="w-16 h-16 rounded-full bg-ocean-50 dark:bg-ocean-950/60 text-ocean-500 flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-200">
              Tidak ada produk yang ditemukan.
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Cobalah mengganti kata kunci pencarian atau memilih kategori yang berbeda.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setOnlyInStock(false);
                setOnlyFeatured(false);
              }}
              className="mt-5 px-5 py-2.5 rounded-xl text-xs font-bold bg-ocean-600 hover:bg-ocean-700 text-white shadow-sm transition-colors"
            >
              Tampilkan Semua Produk
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
              <span>Menampilkan {filteredProducts.length} produk</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {filteredProducts.map((prod) => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  onSelect={onSelectProduct}
                />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
