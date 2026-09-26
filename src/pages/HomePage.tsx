import React from 'react';
import { Hero } from '../components/shop/Hero';
import { CategoryList } from '../components/shop/CategoryList';
import { FeaturedProducts } from '../components/shop/FeaturedProducts';
import { PromoBanner } from '../components/shop/PromoBanner';
import { AboutSection } from '../components/shop/AboutSection';
import { Product, Category, StoreSettings } from '../types';

interface HomePageProps {
  settings: StoreSettings;
  categories: Category[];
  recentProducts: Product[];
  featuredProducts: Product[];
  onSelectProduct: (product: Product) => void;
  onSelectCategory: (categoryId: string) => void;
  onNavigateToProducts: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  settings,
  categories,
  recentProducts,
  featuredProducts,
  onSelectProduct,
  onSelectCategory,
  onNavigateToProducts,
}) => {
  return (
    <div className="space-y-4">
      {/* 1. HERO */}
      <Hero settings={settings} onShopClick={onNavigateToProducts} />

      {/* 2. KATEGORI */}
      <CategoryList
        categories={categories}
        onSelectCategory={onSelectCategory}
        onViewAll={onNavigateToProducts}
      />

      {/* 3. PRODUK TERBARU */}
      <FeaturedProducts
        title="Produk Terbaru"
        subtitle="Koleksi terkini yang baru saja tiba di rak toko JOSJISMART"
        products={recentProducts}
        onSelectProduct={onSelectProduct}
        onViewAll={onNavigateToProducts}
      />

      {/* 4. PRODUK UNGGULAN */}
      <FeaturedProducts
        title="Produk Unggulan & Terlaris"
        subtitle="Pilihan terfavorit dengan rating tinggi dari para pembeli setia"
        products={featuredProducts}
        onSelectProduct={onSelectProduct}
        onViewAll={onNavigateToProducts}
      />

      {/* 5. PROMO JIKA AKTIF */}
      <PromoBanner settings={settings} onShopPromo={onNavigateToProducts} />

      {/* 6. TENTANG JOSJISMART */}
      <AboutSection settings={settings} />
    </div>
  );
};
