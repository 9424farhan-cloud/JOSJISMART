import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { X, ShieldCheck, Lock, User, Eye, EyeOff, Sparkles } from 'lucide-react';
import logoImg from '../../assets/logo.png';

export const AuthModal: React.FC = () => {
  const { authModalOpen, setAuthModalOpen, loginAdmin, loginGoogle } = useAuth();
  const [authTab, setAuthTab] = useState<'viewer' | 'admin'>('viewer');

  // Admin form
  const [adminUsername, setAdminUsername] = useState('Gaza admin');
  const [adminPassword, setAdminPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Google Viewer custom modal input
  const [googleName, setGoogleName] = useState('Pengunjung Pantai');
  const [googleEmail, setGoogleEmail] = useState('pengunjung@gmail.com');

  if (!authModalOpen) return null;

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const success = await loginAdmin(adminUsername, adminPassword);
    setIsLoading(false);
    if (success) {
      setAdminPassword('');
      setAuthModalOpen(false);
    }
  };

  const handleGoogleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const success = await loginGoogle({ name: googleName, email: googleEmail });
    setIsLoading(false);
    if (success) {
      setAuthModalOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto p-6 sm:p-8">
        
        {/* CLOSE BUTTON */}
        <button
          onClick={() => setAuthModalOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          aria-label="Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        {/* HEADER */}
        <div className="text-center mb-6">
          <img
            src={logoImg}
            alt="JOSJISMART"
            className="w-16 h-16 object-contain mx-auto mb-3 drop-shadow-sm"
          />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Masuk ke JOSJISMART
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Pilih jenis akun Anda untuk melanjutkan
          </p>
        </div>

        {/* TAB TOGGLE */}
        <div className="flex p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold mb-6">
          <button
            type="button"
            onClick={() => setAuthTab('viewer')}
            className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              authTab === 'viewer'
                ? 'bg-white dark:bg-slate-700 text-ocean-700 dark:text-ocean-300 shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
            }`}
          >
            <span>Google Viewer</span>
          </button>

          <button
            type="button"
            onClick={() => setAuthTab('admin')}
            className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              authTab === 'admin'
                ? 'bg-white dark:bg-slate-700 text-ocean-700 dark:text-ocean-300 shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
            <span>Administrator</span>
          </button>
        </div>

        {/* GOOGLE VIEWER PANEL */}
        {authTab === 'viewer' && (
          <form onSubmit={handleGoogleSubmit} className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-ocean-50/70 dark:bg-ocean-950/40 border border-ocean-100 dark:border-ocean-900/60 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              <span className="font-bold text-ocean-800 dark:text-ocean-300 block mb-1">
                Akses Pengunjung (Role: VIEWER)
              </span>
              Anda dapat menjelajahi seluruh produk, kategori, mencari barang, menambahkan ke keranjang, dan melakukan simulasi belanja secara bebas.
            </div>

            {/* GOOGLE SIGN IN BUTTON */}
            <button
              type="button"
              onClick={() => loginGoogle()}
              className="w-full py-3 px-4 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center gap-3 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 transition-colors shadow-xs"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>Masuk Cepat dengan Google</span>
            </button>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
              <span className="flex-shrink mx-3 text-[10px] text-slate-400 uppercase tracking-wider">
                Atau Tentukan Profil Google
              </span>
              <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Nama Pengguna
              </label>
              <input
                type="text"
                value={googleName}
                onChange={(e) => setGoogleName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-ocean-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Email Akun
              </label>
              <input
                type="email"
                value={googleEmail}
                onChange={(e) => setGoogleEmail(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-ocean-500"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-ocean-600 hover:bg-ocean-700 text-white transition-colors"
            >
              Masuk sebagai Pengunjung
            </button>
          </form>
        )}

        {/* ADMIN LOGIN PANEL */}
        {authTab === 'admin' && (
          <form onSubmit={handleAdminSubmit} className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
              <span className="font-bold block mb-1">
                Area Khusus Administrator (Gaza admin)
              </span>
              Akses penuh untuk menambah & mengedit barang, mengelola kategori, mengatur banner, dan mengubah status pesanan.
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Username Admin *
              </label>
              <input
                type="text"
                required
                value={adminUsername}
                onChange={(e) => setAdminUsername(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-ocean-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Kata Sandi Admin *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Masukkan kata sandi..."
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-ocean-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="mt-1 text-[11px] text-slate-400">
                Password dikonfigurasi melalui environment variable (.env).
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold bg-ocean-700 hover:bg-ocean-800 text-white shadow-md flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            >
              <Lock className="w-4 h-4" />
              <span>{isLoading ? 'Memverifikasi...' : 'Masuk sebagai Admin'}</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
