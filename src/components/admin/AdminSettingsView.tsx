import React, { useState } from 'react';
import { StoreSettings } from '../../types';
import { useToast } from '../../context/ToastContext';
import { storageService } from '../../services/storageService';
import { Settings, Check, RotateCcw, Trash2, AlertTriangle, ShieldCheck } from 'lucide-react';

interface AdminSettingsViewProps {
  settings: StoreSettings;
  onUpdateSettings: (updates: Partial<StoreSettings>) => void;
  onResetData: () => void;
}

export const AdminSettingsView: React.FC<AdminSettingsViewProps> = ({
  settings,
  onUpdateSettings,
  onResetData,
}) => {
  const { showToast } = useToast();

  const [storeName, setStoreName] = useState(settings.storeName);
  const [tagline, setTagline] = useState(settings.tagline);
  const [phone, setPhone] = useState(settings.phone);
  const [email, setEmail] = useState(settings.email);
  const [address, setAddress] = useState(settings.address);
  const [city, setCity] = useState(settings.city);
  const [baseShippingCost, setBaseShippingCost] = useState(settings.baseShippingCost);
  const [freeShippingMinAmount, setFreeShippingMinAmount] = useState(settings.freeShippingMinAmount);

  const [confirmResetOpen, setConfirmResetOpen] = useState(false);
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings({
      storeName: storeName.trim(),
      tagline: tagline.trim(),
      phone: phone.trim(),
      email: email.trim(),
      address: address.trim(),
      city: city.trim(),
      baseShippingCost: Number(baseShippingCost),
      freeShippingMinAmount: Number(freeShippingMinAmount),
    });

    showToast({
      type: 'success',
      title: 'Pengaturan Disimpan',
      message: 'Informasi kontak dan operasional toko berhasil diperbarui.',
    });
  };

  const handleResetDemo = () => {
    storageService.resetDemoData();
    onResetData();
    setConfirmResetOpen(false);
    showToast({
      type: 'success',
      title: 'Data Demo Direset',
      message: 'Katalog produk, kategori, dan pesanan telah dikembalikan ke sampel awal.',
    });
  };

  const handleClearAllProducts = () => {
    storageService.clearAllProducts();
    onResetData();
    setConfirmClearOpen(false);
    showToast({
      type: 'info',
      title: 'Semua Produk Dibersihkan',
      message: 'Katalog produk kini kosong dan siap diisi barang riil oleh admin.',
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
          Pengaturan Toko
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Kelola profil toko, WhatsApp admin, pengiriman, dan manajemen database.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* STORE PROFILE */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-700">
            <Settings className="w-5 h-5 text-ocean-600" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Profil & Identitas Toko
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Nama Toko *
              </label>
              <input
                type="text"
                required
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-ocean-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Slogan / Tagline Toko
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-ocean-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                WhatsApp Admin (Untuk konfirmasi pesanan) *
              </label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-ocean-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Email Toko
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-ocean-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Kota / Lokasi Toko
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-ocean-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Minimal Belanja Gratis Ongkir (Rp)
              </label>
              <input
                type="number"
                min={0}
                value={freeShippingMinAmount}
                onChange={(e) => setFreeShippingMinAmount(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-ocean-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Alamat Fisik Toko
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-ocean-500"
              />
            </div>
          </div>

          <div className="flex justify-end pt-3">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-ocean-600 hover:bg-ocean-700 text-white font-bold text-xs shadow-md transition-colors flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Simpan Pengaturan</span>
            </button>
          </div>
        </div>

        {/* DATABASE MANAGEMENT & DEMO DATA CONTROLS */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-700">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Manajemen Data & Reset Demo
            </h2>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            Anda dapat mereset data toko ke demo awal (12 produk pilihan, 6 kategori termasuk Barang Rahasia, 3 pesanan contoh) atau membersihkan seluruh produk dummy agar toko siap diisi dengan produk nyata Anda.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="button"
              onClick={() => setConfirmResetOpen(true)}
              className="px-4 py-2.5 rounded-xl border border-ocean-200 dark:border-ocean-900 bg-ocean-50 dark:bg-ocean-950/60 text-ocean-700 dark:text-ocean-300 font-bold text-xs hover:bg-ocean-100 flex items-center gap-2 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset ke Contoh Demo Awal</span>
            </button>

            <button
              type="button"
              onClick={() => setConfirmClearOpen(true)}
              className="px-4 py-2.5 rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-bold text-xs hover:bg-rose-100 flex items-center gap-2 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Hapus Seluruh Produk (Mulai Toko Kosong)</span>
            </button>
          </div>
        </div>

      </form>

      {/* CONFIRM RESET MODAL */}
      {confirmResetOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-sm w-full border border-slate-200 dark:border-slate-800 text-center space-y-4">
            <RotateCcw className="w-10 h-10 text-ocean-600 mx-auto" />
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Reset ke Data Demo Awal?
            </h3>
            <p className="text-xs text-slate-500">
              Tindakan ini akan mengembalikan seluruh 12 produk sampel, 6 kategori, dan pesanan dummy.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setConfirmResetOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold border text-slate-600 dark:text-slate-300"
              >
                Batal
              </button>
              <button
                onClick={handleResetDemo}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-ocean-600 hover:bg-ocean-700 text-white"
              >
                Ya, Reset Data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM CLEAR MODAL */}
      {confirmClearOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-sm w-full border border-slate-200 dark:border-slate-800 text-center space-y-4">
            <Trash2 className="w-10 h-10 text-rose-600 mx-auto" />
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Hapus Semua Produk?
            </h3>
            <p className="text-xs text-slate-500">
              Seluruh produk di katalog akan dikosongkan agar Anda dapat menginput produk riil toko dari nol.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setConfirmClearOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold border text-slate-600 dark:text-slate-300"
              >
                Batal
              </button>
              <button
                onClick={handleClearAllProducts}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white"
              >
                Ya, Kosongkan Produk
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
