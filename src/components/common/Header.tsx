import React, { useState } from 'react';
import {
  ShoppingBag,
  Search,
  User as UserIcon,
  Sun,
  Moon,
  Menu,
  X,
  Heart,
  ShieldCheck,
  Compass,
  QrCode,
  Bell,
  MessageCircle,
  CheckCircle2,
  Volume2,
  Radio,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { Order } from '../../types';
import { formatRupiah } from '../../utils/formatters';
import logoImg from '../../assets/logo.png';

interface HeaderProps {
  currentTab: 'home' | 'products' | 'categories' | 'about' | 'admin';
  setCurrentTab: (tab: 'home' | 'products' | 'categories' | 'about' | 'admin') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenWishlist?: () => void;
  onOpenQrModal?: () => void;
  orders?: Order[];
  onOpenOrderRespond?: (order: Order) => void;
  onTestNotification?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  searchQuery,
  setSearchQuery,
  onOpenQrModal,
  orders = [],
  onOpenOrderRespond,
  onTestNotification,
}) => {
  const { theme, toggleTheme } = useTheme();
  const { user, isAdmin, setAuthModalOpen, setUserModalOpen } = useAuth();
  const { totalItems, setIsCartOpen } = useCart();
  const { wishlist } = useWishlist();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  const pendingOrders = orders.filter((o) => o.status === 'Menunggu');
  const pendingOrdersCount = pendingOrders.length;

  const handleNavClick = (tab: 'home' | 'products' | 'categories' | 'about' | 'admin') => {
    setCurrentTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentTab !== 'products') {
      setCurrentTab('products');
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#0b1528]/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          
          {/* LOGO & BRAND */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-2.5 group text-left focus:outline-none"
            >
              <img
                src={logoImg}
                alt="JOSJISMART Logo"
                className="w-10 h-10 sm:w-11 sm:h-11 object-contain rounded-xl shadow-xs group-hover:scale-105 transition-transform"
              />
              <div>
                <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  JOSJIS<span className="text-ocean-600 dark:text-ocean-400">MART</span>
                </span>
                <span className="hidden sm:block text-[10px] uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-400">
                  Toko Online Pilihan Terbaik
                </span>
              </div>
            </button>
          </div>

          {/* DESKTOP NAVIGATION MENU */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <button
              onClick={() => handleNavClick('home')}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentTab === 'home'
                  ? 'text-ocean-700 dark:text-ocean-400 bg-ocean-50 dark:bg-ocean-950/60 font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('products')}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentTab === 'products'
                  ? 'text-ocean-700 dark:text-ocean-400 bg-ocean-50 dark:bg-ocean-950/60 font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              Produk
            </button>
            <button
              onClick={() => handleNavClick('categories')}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentTab === 'categories'
                  ? 'text-ocean-700 dark:text-ocean-400 bg-ocean-50 dark:bg-ocean-950/60 font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              Kategori
            </button>
            <button
              onClick={() => handleNavClick('about')}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentTab === 'about'
                  ? 'text-ocean-700 dark:text-ocean-400 bg-ocean-50 dark:bg-ocean-950/60 font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              Tentang
            </button>

            {/* ADMIN DASHBOARD LINK (ONLY VISIBLE IF ADMIN) */}
            {isAdmin && (
              <button
                onClick={() => handleNavClick('admin')}
                className={`ml-2 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 border transition-all ${
                  currentTab === 'admin'
                    ? 'bg-ocean-700 text-white border-ocean-800 shadow-sm'
                    : 'bg-ocean-50 text-ocean-700 border-ocean-200 dark:bg-ocean-950/80 dark:text-ocean-300 dark:border-ocean-800/80 hover:bg-ocean-100'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-ocean-600 dark:text-ocean-400" />
                Admin Panel
              </button>
            )}
          </nav>

          {/* SEARCH BAR (DESKTOP) */}
          <div className="hidden lg:flex items-center flex-1 max-w-xs xl:max-w-sm mx-2">
            <form onSubmit={handleSearchSubmit} className="w-full relative">
              <input
                type="text"
                placeholder="Cari produk tropis..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (currentTab !== 'products') setCurrentTab('products');
                }}
                className="w-full pl-9 pr-4 py-2 text-sm rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-transparent focus:border-ocean-500 focus:bg-white dark:focus:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder-slate-400 transition-all focus:outline-none"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </form>
          </div>

          {/* ACTIONS: SEARCH (MOBILE TOGGLE), WISHLIST, THEME, CART, USER */}
          <div className="flex items-center gap-1 sm:gap-2">
            
            {/* Search Toggle for Mobile */}
            <button
              onClick={() => setShowSearchInput(!showSearchInput)}
              className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Pencarian"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist Button */}
            <button
              onClick={() => {
                if (currentTab !== 'products') setCurrentTab('products');
              }}
              className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Daftar Wishlist Favorit"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white dark:ring-slate-900">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* QRIS & QR Toko Button */}
            <button
              onClick={onOpenQrModal}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5 group"
              title="Bayar via QRIS & QR Toko"
              aria-label="QRIS & QR Toko"
            >
              <QrCode className="w-5 h-5 text-ocean-600 dark:text-ocean-400 group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline text-[11px] font-bold text-ocean-700 dark:text-ocean-300 bg-ocean-50 dark:bg-ocean-950/80 px-2 py-0.5 rounded-lg border border-ocean-200 dark:border-ocean-800">
                QRIS
              </span>
            </button>

            {/* Dark / Light Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={theme === 'dark' ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap'}
              aria-label="Ubah Tema"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-amber-400" />
              ) : (
                <Moon className="w-5 h-5 text-slate-600" />
              )}
            </button>

            {/* Shopping Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Keranjang Belanja"
            >
              <ShoppingBag className="w-5 h-5 text-ocean-700 dark:text-ocean-400" />
              {totalItems > 0 && (
                <span className="absolute top-1 right-1 min-w-4 h-4 px-1 rounded-full bg-ocean-600 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white dark:ring-slate-900">
                  {totalItems}
                </span>
              )}
            </button>

            {/* ADMIN ORDER NOTIFICATIONS BELL */}
            {isAdmin && (
              <div className="relative">
                <button
                  onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                  className={`relative p-2 rounded-xl transition-all ${
                    pendingOrdersCount > 0
                      ? 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/70 border border-amber-300 dark:border-amber-700/80 shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                  title={
                    pendingOrdersCount > 0
                      ? `${pendingOrdersCount} Pesanan Baru Menunggu Respon Anda!`
                      : 'Notifikasi Pesanan Masuk'
                  }
                  aria-label="Notifikasi Pesanan"
                >
                  <Bell
                    className={`w-5 h-5 ${
                      pendingOrdersCount > 0 ? 'animate-bounce text-rose-500 dark:text-rose-400' : ''
                    }`}
                  />
                  {pendingOrdersCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 rounded-full bg-rose-600 text-white text-[10px] font-black flex items-center justify-center ring-2 ring-white dark:ring-slate-900 shadow-md animate-pulse">
                      {pendingOrdersCount}
                    </span>
                  )}
                </button>

                {/* NOTIFICATION POPUP DROPDOWN */}
                {notifDropdownOpen && (
                  <div className="absolute right-0 mt-2.5 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 z-50 overflow-hidden animate-fade-in">
                    <div className="p-3.5 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bell className="w-4 h-4 text-ocean-600 dark:text-ocean-400" />
                        <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                          Pesanan Masuk
                        </span>
                      </div>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                        {pendingOrdersCount} Menunggu Respon
                      </span>
                    </div>

                    {/* REAL-TIME CLOUD & CROSS-TAB LIVE BADGE */}
                    <div className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/40 border-b border-emerald-100 dark:border-emerald-900/50 flex items-center justify-between text-[11px] text-emerald-800 dark:text-emerald-300">
                      <div className="flex items-center gap-1.5 font-medium">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                        <span>Live Sync Multi-Tab & Perangkat Aktif</span>
                      </div>
                      {typeof window !== 'undefined' &&
                        'Notification' in window &&
                        typeof Notification.requestPermission === 'function' &&
                        Notification.permission !== 'granted' && (
                        <button
                          onClick={() => {
                            try {
                              const p = Notification.requestPermission();
                              if (p && typeof p.catch === 'function') {
                                p.catch(() => {});
                              }
                            } catch {}
                          }}
                          className="text-[10px] font-bold text-ocean-600 dark:text-ocean-400 underline hover:opacity-80"
                        >
                          Izinkan Desktop
                        </button>
                      )}
                    </div>

                    <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                      {pendingOrders.length === 0 ? (
                        <div className="p-6 text-center text-slate-400 text-xs">
                          <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-60" />
                          <p className="font-semibold text-slate-700 dark:text-slate-300">
                            Semua Pesanan Sudah Direspon!
                          </p>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            Jika ada pesanan baru dari akun lain, dering suara & notifikasi akan langsung berbunyi di sini.
                          </p>
                        </div>
                      ) : (
                        pendingOrders.map((ord) => (
                          <div
                            key={ord.id}
                            className="p-3.5 hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
                          >
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <span className="font-bold text-xs text-slate-900 dark:text-white truncate">
                                {ord.customerName}
                              </span>
                              <span className="font-extrabold text-xs text-ocean-600 dark:text-ocean-400 shrink-0">
                                {formatRupiah(ord.total || 0)}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 mb-2 truncate">
                              {(ord.items || []).map((i) => `${i.quantity}x ${i.productName}`).join(', ') || '1 item'}
                            </p>
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[10px] text-slate-400 font-mono">
                                #{ord.id} • {ord.customerPhone}
                              </span>
                              <button
                                onClick={() => {
                                  setNotifDropdownOpen(false);
                                  onOpenOrderRespond?.(ord);
                                }}
                                className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shadow-xs flex items-center gap-1 transition-all active:scale-95"
                              >
                                <MessageCircle className="w-3 h-3" />
                                <span>Respon</span>
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                      {onTestNotification && (
                        <button
                          onClick={() => {
                            onTestNotification();
                          }}
                          className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600 flex items-center gap-1.5 shadow-2xs transition-colors"
                          title="Klik untuk mengetes suara dering dan notifikasi pop-up"
                        >
                          <Volume2 className="w-3.5 h-3.5 text-ocean-600 dark:text-ocean-400" />
                          <span>Tes Dering</span>
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setNotifDropdownOpen(false);
                          setCurrentTab('admin');
                        }}
                        className="text-xs font-bold text-ocean-600 dark:text-ocean-400 hover:underline ml-auto"
                      >
                        Buka Semua di Admin Panel →
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* User Profile / Login */}
            {user ? (
              <button
                onClick={() => setUserModalOpen(true)}
                className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Kelola Akun"
              >
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-7 h-7 rounded-full object-cover ring-1 ring-ocean-500"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-ocean-100 dark:bg-ocean-900/60 text-ocean-700 dark:text-ocean-300 flex items-center justify-center text-xs font-bold">
                    {user.name.charAt(0)}
                  </div>
                )}
                <span className="hidden sm:inline text-xs font-semibold text-slate-800 dark:text-slate-200 max-w-[90px] truncate">
                  {user.name}
                </span>
                {user.role === 'ADMIN' ? (
                  <span className="hidden sm:inline px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300">
                    Admin
                  </span>
                ) : (
                  <span className="hidden sm:inline px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    Viewer
                  </span>
                )}
              </button>
            ) : (
              <button
                onClick={() => setAuthModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-ocean-600 hover:bg-ocean-700 text-white shadow-sm transition-all"
              >
                <UserIcon className="w-4 h-4" />
                <span>Masuk</span>
              </button>
            )}

            {/* Mobile Menu Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Buka Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* MOBILE SEARCH BAR DROPDOWN */}
        {showSearchInput && (
          <div className="lg:hidden pb-3 pt-1">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Cari produk tropis..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (currentTab !== 'products') setCurrentTab('products');
                }}
                className="w-full pl-9 pr-4 py-2 text-sm rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-ocean-500 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
                autoFocus
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </form>
          </div>
        )}
      </div>

      {/* MOBILE DRAWER / MENU */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b1528] px-4 pt-3 pb-5 space-y-2">
          <button
            onClick={() => handleNavClick('home')}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              currentTab === 'home'
                ? 'bg-ocean-50 dark:bg-ocean-950/80 text-ocean-700 dark:text-ocean-300 font-semibold'
                : 'text-slate-700 dark:text-slate-300'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => handleNavClick('products')}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              currentTab === 'products'
                ? 'bg-ocean-50 dark:bg-ocean-950/80 text-ocean-700 dark:text-ocean-300 font-semibold'
                : 'text-slate-700 dark:text-slate-300'
            }`}
          >
            Semua Produk
          </button>
          <button
            onClick={() => handleNavClick('categories')}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              currentTab === 'categories'
                ? 'bg-ocean-50 dark:bg-ocean-950/80 text-ocean-700 dark:text-ocean-300 font-semibold'
                : 'text-slate-700 dark:text-slate-300'
            }`}
          >
            Kategori Pilihan
          </button>
          <button
            onClick={() => handleNavClick('about')}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              currentTab === 'about'
                ? 'bg-ocean-50 dark:bg-ocean-950/80 text-ocean-700 dark:text-ocean-300 font-semibold'
                : 'text-slate-700 dark:text-slate-300'
            }`}
          >
            Tentang JOSJISMART
          </button>

          <button
            onClick={() => {
              onOpenQrModal?.();
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold text-ocean-700 dark:text-ocean-300 bg-ocean-50/80 dark:bg-ocean-950/60 border border-ocean-100 dark:border-ocean-900 flex items-center justify-between"
          >
            <span className="flex items-center gap-2">
              <QrCode className="w-4 h-4 text-ocean-600 dark:text-ocean-400" />
              <span>Bayar via QRIS & QR Toko</span>
            </span>
            <span className="text-[10px] font-bold bg-rose-500 text-white px-1.5 py-0.5 rounded">QRIS</span>
          </button>

          {isAdmin && (
            <button
              onClick={() => handleNavClick('admin')}
              className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold bg-ocean-600 text-white flex items-center justify-between shadow-sm mt-3"
            >
              <span>Admin Dashboard</span>
              <ShieldCheck className="w-4 h-4" />
            </button>
          )}
        </div>
      )}
    </header>
  );
};
