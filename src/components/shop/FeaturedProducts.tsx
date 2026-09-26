import React from 'react';
import { Product } from '../../types';
import { ProductCard } from './ProductCard';
import { Sparkles, ArrowRight } from 'lucide-react';

interface FeaturedProductsProps {
  title: string;
  subtitle?: string;
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onViewAll?: () => void;
}

export const FeaturedProducts: React.FC<FeaturedProductsProps> = ({
  title,
  subtitle,
  products,
  onSelectProduct,
  onViewAll,
}) => {
  if (products.length === 0) return null;

  return (
    <section className="py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* HEADER */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-ocean-600 dark:text-ocean-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Pilihan Terbaik</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {subtitle}
              </p>
            )}
          </div>
          {onViewAll && (
            <button
              onClick={onViewAll}
              className="text-xs sm:text-sm font-semibold text-ocean-600 dark:text-ocean-400 hover:text-ocean-700 flex items-center gap-1 transition-colors"
            >
              Lihat Semua
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={onSelectProduct}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
