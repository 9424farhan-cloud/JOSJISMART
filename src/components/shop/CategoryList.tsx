import React from 'react';
import { Category } from '../../types';
import { Shirt, Smartphone, Glasses, Sparkles, Coffee, Tag, ArrowRight, Lock, EyeOff } from 'lucide-react';

interface CategoryListProps {
  categories: Category[];
  selectedCategoryId?: string;
  onSelectCategory: (categoryId: string) => void;
  onViewAll?: () => void;
}

export const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  selectedCategoryId,
  onSelectCategory,
  onViewAll,
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case 'shirt':
        return <Shirt className="w-6 h-6" />;
      case 'smartphone':
        return <Smartphone className="w-6 h-6" />;
      case 'glasses':
        return <Glasses className="w-6 h-6" />;
      case 'sparkles':
        return <Sparkles className="w-6 h-6" />;
      case 'coffee':
        return <Coffee className="w-6 h-6" />;
      case 'lock':
        return <Lock className="w-6 h-6" />;
      case 'eyeoff':
      case 'eye-off':
        return <EyeOff className="w-6 h-6" />;
      default:
        return <Tag className="w-6 h-6" />;
    }
  };

  return (
    <section id="kategori" className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* HEADER */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Kategori Pilihan
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Temukan produk berdasarkan kebutuhan aktivitas dan gayamu
            </p>
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

        {/* CATEGORY GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {categories.map((cat) => {
            const isSelected = selectedCategoryId === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`group flex flex-col items-center p-5 rounded-2xl border text-center transition-all duration-200 focus:outline-none ${
                  isSelected
                    ? 'bg-ocean-50 dark:bg-ocean-950/60 border-ocean-500 ring-2 ring-ocean-500/20 shadow-md'
                    : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700/80 hover:border-ocean-300 dark:hover:border-ocean-700 hover:shadow-md'
                }`}
              >
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-3 transition-colors ${
                    isSelected
                      ? 'bg-ocean-600 text-white shadow-sm'
                      : 'bg-ocean-50 dark:bg-ocean-900/50 text-ocean-600 dark:text-ocean-400 group-hover:bg-ocean-600 group-hover:text-white'
                  }`}
                >
                  {getIcon(cat.icon)}
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-ocean-600 dark:group-hover:text-ocean-400 transition-colors">
                  {cat.name}
                </h3>
                <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
