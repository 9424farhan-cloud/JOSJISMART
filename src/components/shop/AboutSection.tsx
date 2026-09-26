import React from 'react';
import { StoreSettings } from '../../types';
import { CheckCircle2, HeartHandshake, Sparkles, MapPin } from 'lucide-react';

interface AboutSectionProps {
  settings: StoreSettings;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ settings }) => {
  return (
    <section className="py-12 sm:py-16 bg-slate-50/60 dark:bg-slate-900/40 border-y border-slate-200/80 dark:border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* LEFT: STORY & PHILOSOPHY */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-ocean-100 dark:bg-ocean-950/80 text-ocean-700 dark:text-ocean-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Tentang JOSJISMART</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Toko Pribadi yang Dikelola Sepenuh Hati dari Pesisir
            </h2>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              JOSJISMART lahir dari kecintaan kami terhadap suasana pantai tropis yang santai, segar, dan bersahaja. Berbeda dari marketplace massal yang membingungkan, setiap barang di sini dikurasi, diuji, dan dicatat langsung oleh kami sendiri.
            </p>

            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Mulai dari kemeja katun linen yang adem, aksesoris pelindung sinar UV, tumbler penahan dingin, hingga kopi asli pulau nusantara — kami memastikan pelanggan mendapatkan produk dengan kualitas nyata dan harga yang masuk akal.
            </p>

            {/* TRUST POINTS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-ocean-600 dark:text-ocean-400 shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
                  Foto dan deskripsi riil tanpa rekayasa
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-ocean-600 dark:text-ocean-400 shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
                  Pengecekan fisik barang sebelum dikirim
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-ocean-600 dark:text-ocean-400 shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
                  Konsultasi ramah langsung dengan admin
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-ocean-600 dark:text-ocean-400 shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
                  Garansi retur jika barang tidak sesuai
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT: CARD HIGHLIGHT */}
          <div className="lg:col-span-5">
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-md space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-ocean-600 text-white flex items-center justify-center shadow-md">
                <HeartHandshake className="w-6 h-6" />
              </div>

              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Komitmen Pelayanan
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Kami percaya belanja online seharusnya menyenangkan dan menenangkan, layaknya menikmati hembusan angin laut di sore hari. Jangan ragu menghubungi kami bila memerlukan rekomendasi ukuran atau spesifikasi barang.
              </p>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-ocean-600" />
                  <span>{settings.city}</span>
                </div>
                <span className="font-semibold text-ocean-600 dark:text-ocean-400">
                  Pengelola: Gaza admin
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
