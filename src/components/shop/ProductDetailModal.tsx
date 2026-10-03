import React, { useState, useEffect } from 'react';
import { Product } from '../../types';
import { formatRupiah, formatWeight, calculateDiscountPercent, formatWaNumber } from '../../utils/formatters';
import {
  X,
  ShoppingBag,
  Heart,
  Star,
  Truck,
  ShieldCheck,
  Check,
  Package,
  Plus,
  Minus,
  Share2,
  MessageCircle,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useToast } from '../../context/ToastContext';
import { productService } from '../../services/productService';
import { bannerService } from '../../services/bannerService';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onSelectProduct,
}) => {
  const { addToCart, setIsCartOpen } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { showToast } = useToast();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<'desc' | 'specs'>('desc');

  useEffect(() => {
    if (product) {
      setActiveImageIndex(0);
      setQuantity(1);

      // Initialize default variants
      const initialVariants: Record<string, string> = {};
      product.variants.forEach((v) => {
        if (v.options.length > 0) {
          initialVariants[v.name] = v.options[0];
        }
      });
      setSelectedVariants(initialVariants);
    }
  }, [product]);

  if (!product) return null;

  const isFavorited = isInWishlist(product.id);
  const discountPercent = calculateDiscountPercent(product.price, product.discountPrice);
  const isOutOfStock = product.stock <= 0 || product.status === 'out_of_stock';
  const relatedProducts = productService.getRelatedProducts(product.id, product.categoryId, 3);

  const handleVariantSelect = (variantName: string, option: string) => {
    setSelectedVariants((prev) => ({
      ...prev,
      [variantName]: option,
    }));
  };

  const handleAddToCart = (directCheckout: boolean = false) => {
    if (isOutOfStock) return;
    addToCart(product, quantity, selectedVariants);
    if (directCheckout) {
      onClose();
      setIsCartOpen(true);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Lihat produk ${product.name} di JOSJISMART!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast({
        type: 'info',
        title: 'Tautan Disalin',
        message: 'Tautan produk berhasil disalin ke clipboard.',
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 md:p-6 animate-fade-in">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/80 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-300 shadow-sm transition-all focus:outline-none"
          aria-label="Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        {/* MODAL BODY (SCROLLABLE) */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            
            {/* LEFT: IMAGE GALLERY */}
            <div className="space-y-3">
              {/* MAIN DISPLAY IMAGE */}
              <div className="relative aspect-square w-full rounded-2xl bg-slate-100 dark:bg-slate-800 overflow-hidden border border-slate-200/80 dark:border-slate-700">
                <img
                  src={product.images[activeImageIndex] || product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover object-center"
                />
                {discountPercent > 0 && (
                  <div className="absolute top-3 left-3 bg-sunset-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-sm">
                    Hemat {discountPercent}%
                  </div>
                )}
              </div>

              {/* THUMBNAILS */}
              {product.images.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                        activeImageIndex === idx
                          ? 'border-ocean-600 ring-2 ring-ocean-500/20'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* STORE GUARANTEE SNIPPET */}
              <div className="grid grid-cols-2 gap-2 pt-2 text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>100% Produk Asli</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <Truck className="w-4 h-4 text-ocean-600 shrink-0" />
                  <span>Pengiriman Cepat</span>
                </div>
              </div>
            </div>

            {/* RIGHT: DETAILS & ACTIONS */}
            <div className="flex flex-col">
              {/* CATEGORY & SHARE */}
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span className="font-semibold text-ocean-600 dark:text-ocean-400 uppercase tracking-wider">
                  {product.categoryName}
                </span>
                <button
                  onClick={handleShare}
                  className="flex items-center gap-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Bagikan</span>
                </button>
              </div>

              {/* TITLE */}
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-snug">
                {product.name}
              </h1>

              {/* RATING & STOCK STATUS */}
              <div className="mt-2 flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1 text-amber-500 font-semibold">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-slate-800 dark:text-slate-200">{product.rating}</span>
                  <span className="text-slate-400 font-normal">({product.reviewCount} ulasan pembeli)</span>
                </div>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <div>
                  {isOutOfStock ? (
                    <span className="text-rose-600 dark:text-rose-400 font-bold">Stok Habis</span>
                  ) : (
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                      Tersedia ({product.stock} pcs)
                    </span>
                  )}
                </div>
              </div>

              {/* PRICING */}
              <div className="mt-4 p-4 rounded-2xl bg-ocean-50/70 dark:bg-ocean-950/40 border border-ocean-100 dark:border-ocean-900/60 flex items-baseline gap-3">
                <span className="text-2xl sm:text-3xl font-extrabold text-ocean-800 dark:text-ocean-200">
                  {formatRupiah(product.discountPrice ?? product.price)}
                </span>
                {product.discountPrice && (
                  <span className="text-sm text-slate-400 line-through">
                    {formatRupiah(product.price)}
                  </span>
                )}
                {product.weight > 0 && (
                  <span className="ml-auto text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Package className="w-3.5 h-3.5" />
                    {formatWeight(product.weight)}
                  </span>
                )}
              </div>

              {/* VARIANTS SELECTOR */}
              {product.variants && product.variants.length > 0 && (
                <div className="mt-5 space-y-4">
                  {product.variants.map((variant) => (
                    <div key={variant.name}>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                        {variant.name}:{' '}
                        <span className="text-ocean-600 dark:text-ocean-400 font-normal normal-case">
                          {selectedVariants[variant.name]}
                        </span>
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {variant.options.map((opt) => {
                          const isSelected = selectedVariants[variant.name] === opt;
                          return (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => handleVariantSelect(variant.name, opt)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                                isSelected
                                  ? 'bg-ocean-600 text-white border-ocean-600 shadow-sm'
                                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-ocean-400'
                              }`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* QUANTITY PICKER */}
              <div className="mt-5 flex items-center gap-4">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Jumlah:
                </span>
                <div className="flex items-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1 || isOutOfStock}
                    className="p-2 text-slate-500 hover:text-slate-800 dark:hover:text-white disabled:opacity-30"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center text-sm font-bold text-slate-800 dark:text-slate-200">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    disabled={quantity >= product.stock || isOutOfStock}
                    className="p-2 text-slate-500 hover:text-slate-800 dark:hover:text-white disabled:opacity-30"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* ACTIONS: CART & DIRECT CHECKOUT & WISHLIST */}
              <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center gap-3">
                <button
                  onClick={() => handleAddToCart(false)}
                  disabled={isOutOfStock}
                  className="flex-1 py-3 px-4 rounded-xl text-sm font-bold bg-ocean-600 hover:bg-ocean-700 active:bg-ocean-800 text-white shadow-md flex items-center justify-center gap-2 disabled:bg-slate-200 disabled:text-slate-400 dark:disabled:bg-slate-800 transition-colors"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>+ Keranjang</span>
                </button>

                <button
                  onClick={() => handleAddToCart(true)}
                  disabled={isOutOfStock}
                  className="flex-1 py-3 px-4 rounded-xl text-sm font-bold bg-aqua-600 hover:bg-aqua-700 text-white shadow-md flex items-center justify-center gap-1.5 disabled:opacity-40 transition-colors"
                >
                  <Check className="w-4 h-4" />
                  <span>Beli Langsung</span>
                </button>

                <a
                  href={`https://wa.me/${formatWaNumber(bannerService.getSettings().phone || '085723691588')}?text=${encodeURIComponent(`Halo Admin JOSJISMART! Saya mau tanya seputar produk *${product.name}* (Harga: ${formatRupiah(product.discountPrice ?? product.price)}). Apakah masih tersedia?`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-md flex items-center justify-center transition-colors"
                  title="Tanya Admin via WhatsApp"
                >
                  <MessageCircle className="w-5 h-5" />
                </a>

                <button
                  onClick={() => toggleWishlist(product)}
                  className={`p-3 rounded-xl border transition-colors ${
                    isFavorited
                      ? 'bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-950/60 dark:border-rose-900'
                      : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:text-rose-600 hover:border-rose-300'
                  }`}
                  title={isFavorited ? 'Hapus dari Wishlist' : 'Tambah ke Wishlist'}
                >
                  <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* TABBED DETAILS: DESCRIPTION & SPECIFICATIONS */}
              <div className="mt-8">
                <div className="flex border-b border-slate-200 dark:border-slate-800 text-sm">
                  <button
                    onClick={() => setActiveTab('desc')}
                    className={`pb-2.5 px-3 font-semibold border-b-2 transition-colors ${
                      activeTab === 'desc'
                        ? 'border-ocean-600 text-ocean-600 dark:text-ocean-400'
                        : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400'
                    }`}
                  >
                    Deskripsi Produk
                  </button>
                  <button
                    onClick={() => setActiveTab('specs')}
                    className={`pb-2.5 px-3 font-semibold border-b-2 transition-colors ${
                      activeTab === 'specs'
                        ? 'border-ocean-600 text-ocean-600 dark:text-ocean-400'
                        : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400'
                    }`}
                  >
                    Spesifikasi & Informasi
                  </button>
                </div>

                <div className="pt-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {activeTab === 'desc' ? (
                    <div className="whitespace-pre-line space-y-2">
                      {product.description}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {product.specifications && product.specifications.length > 0 ? (
                        <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
                          {product.specifications.map((spec, i) => (
                            <div key={i} className="py-1.5 flex justify-between gap-4">
                              <span className="font-semibold text-slate-500 dark:text-slate-400">
                                {spec.label}
                              </span>
                              <span className="text-slate-800 dark:text-slate-200 text-right">
                                {spec.value}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-slate-400 italic">Tidak ada spesifikasi khusus.</p>
                      )}
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>

          {/* RELATED PRODUCTS */}
          {relatedProducts.length > 0 && (
            <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
                Produk Terkait di Kategori Ini
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {relatedProducts.map((rel) => (
                  <div
                    key={rel.id}
                    onClick={() => onSelectProduct(rel)}
                    className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-ocean-300 dark:hover:border-ocean-700 bg-slate-50/50 dark:bg-slate-800/40 cursor-pointer transition-all"
                  >
                    <img
                      src={rel.images[0]}
                      alt={rel.name}
                      className="w-14 h-14 rounded-lg object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                        {rel.name}
                      </h4>
                      <p className="text-xs font-bold text-ocean-600 dark:text-ocean-400 mt-0.5">
                        {formatRupiah(rel.discountPrice ?? rel.price)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
