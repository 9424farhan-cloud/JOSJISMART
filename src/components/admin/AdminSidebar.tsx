import React from 'react';
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  Image,
  Settings,
  ArrowLeft,
  ShieldCheck,
} from 'lucide-react';
import logoImg from '../../assets/logo.png';

export type AdminTab = 'dashboard' | 'products' | 'categories' | 'orders' | 'banners' | 'settings';

interface AdminSidebarProps {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  onExitAdmin: () => void;
  pendingOrdersCount?: number;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  setActiveTab,
  onExitAdmin,
  pendingOrdersCount = 0,
}) => {
  const menuItems = [
    { id: 'dashboard' as AdminTab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products' as AdminTab, label: 'Katalog Produk', icon: Package },
    { id: 'categories' as AdminTab, label: 'Kategori', icon: Layers },
    { id: 'orders' as AdminTab, label: 'Daftar Pesanan', icon: ShoppingBag },
    { id: 'banners' as AdminTab, label: 'Banner & Promo', icon: Image },
    { id: 'settings' as AdminTab, label: 'Pengaturan Toko', icon: Settings },
  ];

  return (
    <aside className="w-full lg:w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-4 lg:p-6 flex flex-col shrink-0">
      {/* BRAND & ROLE HEADER */}
      <div className="pb-6 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <img
            src={logoImg}
            alt="JOSJISMART"
            className="w-9 h-9 object-contain rounded-xl shadow-xs"
          />
          <div>
            <span className="font-extrabold text-sm tracking-tight text-slate-900 dark:text-white block">
              JOSJISMART
            </span>
            <p className="text-[10px] text-ocean-600 dark:text-ocean-400 font-semibold uppercase tracking-wider flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> ADMIN PANEL
            </p>
          </div>
        </div>
      </div>

      {/* NAVIGATION ITEMS */}
      <nav className="mt-6 space-y-1.5 flex-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-ocean-600 text-white shadow-md shadow-ocean-600/20'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </div>
              {item.id === 'orders' && pendingOrdersCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-500 text-white shadow-xs animate-pulse">
                  {pendingOrdersCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* EXIT TO STORE BUTTON */}
      <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
        <button
          onClick={onExitAdmin}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Website Toko</span>
        </button>
      </div>
    </aside>
  );
};
