import React, { useState } from 'react';
import { StoreSettings } from '../../types';
import { useToast } from '../../context/ToastContext';
import { Image, Check, Sparkles, Tag, Upload } from 'lucide-react';

interface AdminBannersViewProps {
  settings: StoreSettings;
  onUpdateSettings: (updates: Partial<StoreSettings>) => void;
}

export const AdminBannersView: React.FC<AdminBannersViewProps> = ({
  settings,
  onUpdateSettings,
}) => {
  const { showToast } = useToast();

  // Hero Banner form
  const [heroTitle, setHeroTitle] = useState(settings.heroTitle);
  const [heroSubtitle, setHeroSubtitle] = useState(settings.heroSubtitle);
  const [heroImage, setHeroImage] = useState(settings.heroImage);
  const [heroButtonText, setHeroButtonText] = useState(settings.heroButtonText);

  // Promo Banner form
  const [promoActive, setPromoActive] = useState(settings.promoActive);
  const [promoTitle, setPromoTitle] = useState(settings.promoTitle);
  const [promoSubtitle, setPromoSubtitle] = useState(settings.promoSubtitle);
  const [promoCode, setPromoCode] = useState(settings.promoCode);
  const [promoDiscountPercent, setPromoDiscountPercent] = useState(settings.promoDiscountPercent);
  const [promoImage, setPromoImage] = useState(settings.promoImage);

  const handleHeroBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const res = event.target?.result as string;
      if (res) setHeroImage(res);
    };
    reader.readAsDataURL(file);
  };

  const handlePromoBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const res = event.target?.result as string;
      if (res) setPromoImage(res);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings({
      heroTitle,
      heroSubtitle,
      heroImage,
      heroButtonText,
      promoActive,
      promoTitle,
      promoSubtitle,
      promoCode,
      promoDiscountPercent: Number(promoDiscountPercent),
      promoImage,
    });

    showToast({
      type: 'success',
      title: 'Banner & Promo Diperbarui',
      message: 'Perubahan banner dan promo toko telah aktif di halaman utama.',
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
          Kelola Banner & Promosi
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Ubah tampilan foto utama laut tropis dan kupon promo spesial toko JOSJISMART
        </p>
      </div>

      <form onSubmit={handleSaveAll} className="space-y-8">
        
        {/* HERO SECTION CONFIG */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-700">
            <Sparkles className="w-5 h-5 text-ocean-600" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Hero Section (Halaman Depan)
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Judul Hero Utama
              </label>
              <input
                type="text"
                value={heroTitle}
                onChange={(e) => setHeroTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-ocean-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Teks Tombol Aksi
              </label>
              <input
                type="text"
                value={heroButtonText}
                onChange={(e) => setHeroButtonText(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-ocean-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Subjudul / Tagline Hero
              </label>
              <input
                type="text"
                value={heroSubtitle}
                onChange={(e) => setHeroSubtitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-ocean-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Foto Latar Belakang Laut Tropis (URL atau Unggah File)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={heroImage}
                  onChange={(e) => setHeroImage(e.target.value)}
                  className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-ocean-500"
                />
                <label className="px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 cursor-pointer">
                  <Upload className="w-4 h-4" />
                  <span>Unggah</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleHeroBannerUpload}
                    className="hidden"
                  />
                </label>
              </div>
              <div className="mt-2 h-28 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                <img src={heroImage} alt="Pratinjau Hero" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>

        {/* PROMO BANNER CONFIG */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-2">
              <Tag className="w-5 h-5 text-sunset-500" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Banner Promosi & Kupon Diskon
              </h2>
            </div>
            <label className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={promoActive}
                onChange={(e) => setPromoActive(e.target.checked)}
                className="w-4 h-4 rounded text-ocean-600 focus:ring-ocean-500"
              />
              <span>Aktifkan Promo di Beranda</span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Judul Promo
              </label>
              <input
                type="text"
                value={promoTitle}
                onChange={(e) => setPromoTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-ocean-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Kode Kupon
                </label>
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm font-mono text-slate-800 dark:text-slate-100 focus:outline-none focus:border-ocean-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Potongan (%)
                </label>
                <input
                  type="number"
                  min={1}
                  max={99}
                  value={promoDiscountPercent}
                  onChange={(e) => setPromoDiscountPercent(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-ocean-500"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Keterangan Promo
              </label>
              <input
                type="text"
                value={promoSubtitle}
                onChange={(e) => setPromoSubtitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-ocean-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Foto Background Banner Promo
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoImage}
                  onChange={(e) => setPromoImage(e.target.value)}
                  className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-ocean-500"
                />
                <label className="px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 cursor-pointer">
                  <Upload className="w-4 h-4" />
                  <span>Unggah</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePromoBannerUpload}
                    className="hidden"
                  />
                </label>
              </div>
              <div className="mt-2 h-24 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                <img src={promoImage} alt="Pratinjau Promo" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-ocean-600 hover:bg-ocean-700 text-white font-bold text-sm shadow-md flex items-center gap-2 transition-colors"
          >
            <Check className="w-4 h-4" />
            <span>Simpan Perubahan Banner & Promo</span>
          </button>
        </div>

      </form>
    </div>
  );
};
