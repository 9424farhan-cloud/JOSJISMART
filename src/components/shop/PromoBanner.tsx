import React from 'react';
import { StoreSettings } from '../../types';
import { Tag, ArrowRight, Copy } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface PromoBannerProps {
  settings: StoreSettings;
  onShopPromo: () => void;
}

export const PromoBanner: React.FC<PromoBannerProps> = ({ settings, onShopPromo }) => {
  const { showToast } = useToast();

  if (!settings.promoActive) return null;

  const copyPromoCode = () => {
    navigator.clipboard.writeText(settings.promoCode);
    showToast({
      type: 'success',
      title: 'Kode Promo Disalin',
      message: `Kode "${settings.promoCode}" siap digunakan saat checkout!`,
    });
  };

  return (
    <section className="py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden shadow-lg border border-ocean-100 dark:border-slate-800 bg-slate-900 text-white">
          
          {/* BACKGROUND BEACH PHOTO */}
          <div className="absolute inset-0 z-0">
            <img
              src={settings.promoImage}
              alt="Promo Tropis"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/80 to-ocean-950/60" />
          </div>

          {/* CONTENT */}
          <div className="relative z-10 p-6 sm:p-10 md:p-14 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-sunset-500/20 border border-sunset-400/40 text-sunset-300 text-xs font-bold mb-4 backdrop-blur-xs">
              <Tag className="w-3.5 h-3.5" />
              <span>PENAWARAN TERBATAS</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
              {settings.promoTitle}
            </h3>

            <p className="mt-2 text-sm sm:text-base text-slate-300 leading-relaxed">
              {settings.promoSubtitle}
            </p>

            {/* PROMO CODE BADGE & CTA */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                onClick={copyPromoCode}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-mono text-sm font-bold tracking-wider backdrop-blur-sm transition-all"
                title="Klik untuk salin kode"
              >
                <span>{settings.promoCode}</span>
                <Copy className="w-4 h-4 text-ocean-300" />
              </button>

              <button
                onClick={onShopPromo}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-ocean-500 hover:bg-ocean-600 text-white font-bold text-sm shadow-md transition-colors"
              >
                <span>Gunakan Promo</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
