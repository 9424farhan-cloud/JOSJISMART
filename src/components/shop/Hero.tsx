import React from 'react';
import { ShoppingBag, ArrowDown, Sparkles } from 'lucide-react';
import { WaveDivider } from '../common/WaveDivider';
import { StoreSettings } from '../../types';

interface HeroProps {
  settings: StoreSettings;
  onShopClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ settings, onShopClick }) => {
  return (
    <section className="relative bg-slate-900 text-white overflow-hidden">
      {/* BACKGROUND IMAGE WITH TROPICAL OCEAN VIBE */}
      <div className="absolute inset-0 z-0">
        <img
          src={settings.heroImage}
          alt="Pantai Tropis JOSJISMART"
          className="w-full h-full object-cover object-center transform scale-105 transition-transform duration-1000 ease-out"
        />
        {/* REFINED OCEAN OVERLAY FOR READABILITY */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-900/60 to-ocean-950/50" />
      </div>

      {/* HERO CONTENT */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-28 pb-28 sm:pb-36 lg:pb-40">
        <div className="max-w-2xl">
          {/* BADGE */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-ocean-500/20 border border-ocean-400/30 backdrop-blur-sm text-ocean-200 text-xs sm:text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4 text-ocean-300" />
            <span>Koleksi Tropis Pilihan & Terpercaya</span>
          </div>

          {/* MAIN HEADLINE */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            {settings.heroTitle}
          </h1>

          {/* SUBTITLE */}
          <p className="mt-4 sm:mt-5 text-xl sm:text-2xl font-light text-ocean-100/90 leading-relaxed">
            "{settings.heroSubtitle}"
          </p>

          <p className="mt-3 text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
            Hadirkan kesejukan dan kemudahan berbelanja online. Dikelola langsung dengan perhatian penuh terhadap mutu dan kepuasan pelanggan.
          </p>

          {/* CTA BUTTON */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              onClick={onShopClick}
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-ocean-600 hover:bg-ocean-700 active:scale-[0.98] text-white font-bold text-sm tracking-wide shadow-lg shadow-ocean-700/30 transition-all duration-200 focus:outline-none"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>{settings.heroButtonText || 'BELANJA SEKARANG'}</span>
            </button>

            <a
              href="#kategori"
              className="inline-flex items-center gap-1.5 px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-[0.98] text-white font-medium text-sm backdrop-blur-sm transition-all"
            >
              <span>Jelajahi Kategori</span>
              <ArrowDown className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* SUBTLE OCEAN WAVE TRANSITION TO MAIN CONTENT */}
      <div className="absolute bottom-0 left-0 right-0 z-20">
        <WaveDivider />
      </div>
    </section>
  );
};
