import React from 'react';
import { Product, Order, Category } from '../../types';
import { formatRupiah, formatDate } from '../../utils/formatters';
import {
  Package,
  CheckCircle2,
  AlertTriangle,
  ShoppingBag,
  TrendingUp,
  Plus,
  ArrowRight,
} from 'lucide-react';
import { AdminTab } from './AdminSidebar';

interface AdminDashboardViewProps {
  products: Product[];
  orders: Order[];
  categories: Category[];
  setActiveTab: (tab: AdminTab) => void;
  onOpenAddProduct: () => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  products,
  orders,
  categories,
  setActiveTab,
  onOpenAddProduct,
}) => {
  // Compute key stats
  const totalProducts = products.length;
  const activeProducts = products.filter((p) => p.status === 'available' && p.stock > 0).length;
  const outOfStockProducts = products.filter((p) => p.stock <= 0 || p.status === 'out_of_stock');
  const totalOrders = orders.length;
  const totalRevenue = orders
    .filter((o) => o.status !== 'Dibatalkan')
    .reduce((sum, o) => sum + o.total, 0);

  const recentOrders = orders.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* HEADER & QUICK ACTIONS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Dashboard Toko JOSJISMART
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Ringkasan data produk, transaksi, dan stok barang terkini.
          </p>
        </div>

        <button
          onClick={onOpenAddProduct}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-ocean-600 hover:bg-ocean-700 text-white font-bold text-xs sm:text-sm shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>+ Tambah Produk Baru</span>
        </button>
      </div>

      {/* METRIC STATS CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* TOTAL PRODUK */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Total Produk</span>
            <Package className="w-4 h-4 text-ocean-600" />
          </div>
          <p className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            {totalProducts}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {categories.length} Kategori terdaftar
          </span>
        </div>

        {/* PRODUK AKTIF */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Produk Aktif</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-xl sm:text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
            {activeProducts}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">Siap dipesan</span>
        </div>

        {/* STOK HABIS */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Stok Habis</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-xl sm:text-2xl font-extrabold text-rose-600 dark:text-rose-400">
            {outOfStockProducts.length}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">Perlu restock</span>
        </div>

        {/* TOTAL PESANAN */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Total Pesanan</span>
            <ShoppingBag className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            {totalOrders}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">Semua status</span>
        </div>

        {/* TOTAL PENJUALAN */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-xs col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Total Omset</span>
            <TrendingUp className="w-4 h-4 text-ocean-600" />
          </div>
          <p className="text-lg sm:text-xl font-extrabold text-ocean-700 dark:text-ocean-300 truncate">
            {formatRupiah(totalRevenue)}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">Pesanan aktif</span>
        </div>
      </div>

      {/* TWO COLUMN GRID: LOW STOCK ALERTS & RECENT ORDERS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* RECENT ORDERS TABLE */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/80 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                Pesanan Terbaru
              </h2>
              <p className="text-xs text-slate-400">Daftar transaksi pesanan masuk terakhir</p>
            </div>
            <button
              onClick={() => setActiveTab('orders')}
              className="text-xs font-semibold text-ocean-600 dark:text-ocean-400 hover:text-ocean-700 flex items-center gap-1"
            >
              Kelola Pesanan
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-700 text-slate-400 font-semibold">
                  <th className="pb-2.5">No. Pesanan</th>
                  <th className="pb-2.5">Pelanggan</th>
                  <th className="pb-2.5">Total</th>
                  <th className="pb-2.5">Status</th>
                  <th className="pb-2.5">Tanggal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-slate-400">
                      Belum ada pesanan masuk.
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/40">
                      <td className="py-3 font-mono font-bold text-ocean-600 dark:text-ocean-400">
                        {ord.id}
                      </td>
                      <td className="py-3 text-slate-800 dark:text-slate-200 font-medium">
                        {ord.customerName}
                      </td>
                      <td className="py-3 font-bold text-slate-900 dark:text-white">
                        {formatRupiah(ord.total)}
                      </td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            ord.status === 'Selesai'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : ord.status === 'Dikirim'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                              : ord.status === 'Dibatalkan'
                              ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          }`}
                        >
                          {ord.status}
                        </span>
                      </td>
                      <td className="py-3 text-slate-400">
                        {formatDate(ord.createdAt)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* LOW STOCK & RESTOCK MONITOR */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/80 p-5 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                Peringatan Stok Rendah
              </h2>
              <p className="text-xs text-slate-400">Produk dengan stok &le; 5 item</p>
            </div>
            <button
              onClick={() => setActiveTab('products')}
              className="text-xs font-semibold text-ocean-600 dark:text-ocean-400"
            >
              Lihat Stok
            </button>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto">
            {products
              .filter((p) => p.stock <= 5)
              .slice(0, 5)
              .map((prod) => (
                <div
                  key={prod.id}
                  className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-700/40 text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={prod.images[0]}
                      alt={prod.name}
                      className="w-10 h-10 rounded-lg object-cover shrink-0"
                    />
                    <div className="truncate">
                      <p className="font-semibold text-slate-900 dark:text-white truncate">
                        {prod.name}
                      </p>
                      <span className="text-[10px] text-slate-400">{prod.categoryName}</span>
                    </div>
                  </div>
                  <span
                    className={`font-bold px-2 py-0.5 rounded text-[11px] shrink-0 ${
                      prod.stock === 0
                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                    }`}
                  >
                    {prod.stock === 0 ? 'Habis' : `Sisa ${prod.stock}`}
                  </span>
                </div>
              ))}
          </div>
        </div>

      </div>
    </div>
  );
};
