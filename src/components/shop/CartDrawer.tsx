import React from 'react';
import { useCart } from '../../context/CartContext';
import { formatRupiah } from '../../utils/formatters';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    subtotal,
    clearCart,
    setCheckoutOpen,
  } = useCart();

  if (!isCartOpen) return null;

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-xs flex justify-end animate-fade-in">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800 animate-slide-left">
        
        {/* HEADER */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-ocean-600 dark:text-ocean-400" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Keranjang Belanja
            </h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-ocean-100 dark:bg-ocean-950 text-ocean-700 dark:text-ocean-300">
              {items.length} item
            </span>
          </div>

          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button
                onClick={clearCart}
                className="text-xs text-slate-400 hover:text-rose-500 transition-colors"
                title="Kosongkan Keranjang"
              >
                Kosongkan
              </button>
            )}
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
              aria-label="Tutup Keranjang"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* CART ITEMS LIST */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 divide-y divide-slate-100 dark:divide-slate-800/80">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <div className="w-16 h-16 rounded-full bg-ocean-50 dark:bg-ocean-950 flex items-center justify-center text-ocean-500 mb-3">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Keranjang Masih Kosong
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">
                Temukan berbagai produk favorit bernuansa tropis dan tambahkan ke sini.
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="mt-4 px-4 py-2 rounded-xl text-xs font-bold bg-ocean-600 hover:bg-ocean-700 text-white transition-colors"
              >
                Mulai Belanja
              </button>
            </div>
          ) : (
            items.map((item, idx) => {
              const unitPrice = item.product.discountPrice ?? item.product.price;
              const itemTotal = unitPrice * item.quantity;
              const variantKeys = Object.keys(item.selectedVariants || {});

              return (
                <div key={idx} className="py-4 flex gap-3 sm:gap-4 items-start">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-16 h-16 rounded-xl object-cover border border-slate-200 dark:border-slate-800 shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                      {item.product.name}
                    </h4>

                    {/* VARIANT TAGS */}
                    {variantKeys.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {variantKeys.map((key) => (
                          <span
                            key={key}
                            className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                          >
                            {key}: {item.selectedVariants[key]}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="mt-1 flex items-baseline gap-1.5">
                      <span className="text-xs font-bold text-ocean-700 dark:text-ocean-300">
                        {formatRupiah(unitPrice)}
                      </span>
                    </div>

                    {/* QUANTITY CONTROLS */}
                    <div className="mt-2.5 flex items-center justify-between">
                      <div className="flex items-center rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              item.quantity - 1,
                              item.selectedVariants
                            )
                          }
                          className="p-1 text-slate-500 hover:text-slate-800 dark:hover:text-white"
                          aria-label="Kurangi"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-7 text-center text-xs font-bold text-slate-800 dark:text-slate-200">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              item.quantity + 1,
                              item.selectedVariants
                            )
                          }
                          disabled={item.quantity >= item.product.stock}
                          className="p-1 text-slate-500 hover:text-slate-800 dark:hover:text-white disabled:opacity-30"
                          aria-label="Tambah"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          {formatRupiah(itemTotal)}
                        </span>
                        <button
                          onClick={() => removeFromCart(item.product.id, item.selectedVariants)}
                          className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                          title="Hapus item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* FOOTER SUMMARY & CTA */}
        {items.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>Subtotal Produk</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {formatRupiah(subtotal)}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm font-bold text-slate-900 dark:text-white pt-1 border-t border-slate-200 dark:border-slate-800">
              <span>Total Perkiraan</span>
              <span className="text-base text-ocean-700 dark:text-ocean-300">
                {formatRupiah(subtotal)}
              </span>
            </div>

            <button
              onClick={handleProceedToCheckout}
              className="w-full py-3.5 px-4 rounded-xl text-sm font-bold bg-ocean-600 hover:bg-ocean-700 active:scale-[0.99] text-white shadow-md flex items-center justify-center gap-2 transition-all"
            >
              <span>LANJUT KE CHECKOUT</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-[11px] text-center text-slate-400">
              Ongkos kirim dan diskon promo dihitung pada tahap checkout.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
