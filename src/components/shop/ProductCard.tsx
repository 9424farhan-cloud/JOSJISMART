import React from 'react';
import { Product } from '../../types';
import { formatRupiah, calculateDiscountPercent } from '../../utils/formatters';
import { ShoppingBag, Heart, Star } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const isFavorited = isInWishlist(product.id);
  const discountPercent = calculateDiscountPercent(product.price, product.discountPrice);
  const isOutOfStock = product.stock <= 0 || product.status === 'out_of_stock';

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isOutOfStock) {
      // If product has variants, open detail modal so user can pick
      if (product.variants && product.variants.length > 0) {
        onSelect(product);
      } else {
        addToCart(product, 1);
      }
    }
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <div
      onClick={() => onSelect(product)}
      className="group flex flex-col bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200/90 dark:border-slate-700/80 shadow-sm hover:shadow-md hover:border-ocean-300 dark:hover:border-ocean-600/60 transition-all duration-200 cursor-pointer overflow-hidden"
    >
      {/* PRODUCT IMAGE CONTAINER */}
      <div className="relative aspect-square w-full bg-slate-100 dark:bg-slate-900 overflow-hidden">
        <img
          src={product.images[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80'}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300 ease-out"
        />

        {/* DISCOUNT BADGE */}
        {discountPercent > 0 && (
          <div className="absolute top-2.5 left-2.5 bg-sunset-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-md shadow-sm">
            Hemat {discountPercent}%
          </div>
        )}

        {/* STOCK BADGE */}
        {isOutOfStock ? (
          <div className="absolute top-2.5 right-2.5 bg-slate-900/80 text-white text-[10px] font-semibold px-2 py-0.5 rounded backdrop-blur-xs">
            Habis
          </div>
        ) : product.stock <= 5 ? (
          <div className="absolute top-2.5 right-2.5 bg-amber-500/90 text-white text-[10px] font-semibold px-2 py-0.5 rounded backdrop-blur-xs">
            Sisa {product.stock}
          </div>
        ) : null}

        {/* WISHLIST BUTTON */}
        <button
          onClick={handleWishlist}
          className={`absolute bottom-2.5 right-2.5 p-2 rounded-xl backdrop-blur-md shadow-sm transition-all duration-150 ${
            isFavorited
              ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/80 dark:text-rose-400'
              : 'bg-white/90 dark:bg-slate-900/90 text-slate-500 hover:text-rose-600 dark:text-slate-300 dark:hover:text-rose-400'
          }`}
          title={isFavorited ? 'Hapus dari Wishlist' : 'Tambah ke Wishlist'}
          aria-label="Wishlist"
        >
          <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* PRODUCT INFO */}
      <div className="flex-1 flex flex-col p-4">
        {/* CATEGORY & RATING */}
        <div className="flex items-center justify-between gap-1 text-[11px] text-slate-500 dark:text-slate-400 mb-1">
          <span className="font-medium text-ocean-600 dark:text-ocean-400 truncate">
            {product.categoryName}
          </span>
          <div className="flex items-center gap-1 shrink-0">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span className="font-semibold text-slate-700 dark:text-slate-300">{product.rating}</span>
            <span className="text-[10px] text-slate-400">({product.reviewCount})</span>
          </div>
        </div>

        {/* TITLE */}
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-ocean-600 dark:group-hover:text-ocean-400 transition-colors">
          {product.name}
        </h3>

        {/* PRICING */}
        <div className="mt-2 pt-1 flex items-baseline gap-2">
          <span className="text-base font-extrabold text-ocean-700 dark:text-ocean-300">
            {formatRupiah(product.discountPrice ?? product.price)}
          </span>
          {product.discountPrice && (
            <span className="text-xs text-slate-400 line-through">
              {formatRupiah(product.price)}
            </span>
          )}
        </div>

        {/* ACTION BUTTON */}
        <div className="mt-4 pt-2">
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all duration-200 ${
              isOutOfStock
                ? 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500 cursor-not-allowed'
                : 'bg-ocean-600 hover:bg-ocean-700 active:bg-ocean-800 text-white shadow-sm hover:shadow'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{isOutOfStock ? 'Stok Habis' : 'Tambah ke Keranjang'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
