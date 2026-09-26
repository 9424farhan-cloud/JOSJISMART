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
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import logoImg from '../../assets/logo.png';

interface HeaderProps {
  currentTab: 'home' | 'products' | 'categories' | 'about' | 'admin';
  setCurrentTab: (tab: 'home' | 'products' | 'categories' | 'about' | 'admin') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenWishlist?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  searchQuery,
  setSearchQuery,
}) => {
  const { theme, toggleTheme } = useTheme();
  const { user, isAdmin, setAuthModalOpen, setUserModalOpen } = useAuth();
  const { totalItems, setIsCartOpen } = useCart();
  const { wishlist } = useWishlist();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);

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
