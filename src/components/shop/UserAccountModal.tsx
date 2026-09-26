import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';
import { orderService } from '../../services/orderService';
import { formatRupiah, formatDate } from '../../utils/formatters';
import { Product, Order } from '../../types';
import {
  X,
  User,
  Heart,
  Package,
  LogOut,
  ShieldAlert,
  ShieldCheck,
  Trash2,
} from 'lucide-react';

interface UserAccountModalProps {
  onSelectProduct: (product: Product) => void;
}

export const UserAccountModal: React.FC<UserAccountModalProps> = ({ onSelectProduct }) => {
  const { user, logout, userModalOpen, setUserModalOpen } = useAuth();
  const { wishlist, toggleWishlist } = useWishlist();

  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'wishlist'>('profile');

  if (!userModalOpen || !user) return null;

  // Retrieve user's orders (matched by email)
  const userOrders: Order[] = orderService.getOrdersByEmail(user.email);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto max-h-[90vh] flex flex-col">
        
        {/* HEADER */}
        <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-ocean-500"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-ocean-100 text-ocean-600 flex items-center justify-center font-bold">
                {user.name.charAt(0)}
              </div>
            )}
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                {user.name}
              </h2>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-xs text-slate-400">{user.email}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                  user.role === 'ADMIN'
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    : 'bg-ocean-100 text-ocean-800 dark:bg-ocean-950 dark:text-ocean-300'
                }`}>
                  {user.role}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setUserModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* NAVIGATION TABS */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 text-xs sm:text-sm font-semibold bg-slate-50 dark:bg-slate-900/50">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-3 px-3 border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'profile'
                ? 'border-ocean-600 text-ocean-600 dark:text-ocean-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profil & Keamanan</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3 px-3 border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'orders'
                ? 'border-ocean-600 text-ocean-600 dark:text-ocean-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Riwayat Pesanan ({userOrders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('wishlist')}
            className={`py-3 px-3 border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'wishlist'
                ? 'border-ocean-600 text-ocean-600 dark:text-ocean-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>Wishlist ({wishlist.length})</span>
          </button>
        </div>

        {/* TAB CONTENTS */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-6 text-xs sm:text-sm">
          {/* PROFILE & SECURITY */}
          {activeTab === 'profile' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Nama Lengkap:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{user.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Email:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{user.email}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Metode Masuk:</span>
                  <span className="font-semibold text-slate-900 dark:text-white capitalize">{user.authProvider}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Role Keamanan:</span>
                  <span className="font-bold text-ocean-600 dark:text-ocean-400">{user.role}</span>
                </div>
              </div>

              {/* RBAC INFO NOTICE */}
              {user.role === 'VIEWER' ? (
                <div className="p-3.5 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-900/60 text-xs text-sky-800 dark:text-sky-300 flex items-start gap-2.5">
                  <ShieldAlert className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                  <div className="leading-relaxed">
                    <strong>Batasan Akun Viewer:</strong> Sesuai protokol keamanan JOSJISMART, akun Google hanya dapat mengamati katalog, menambahkan barang ke keranjang, dan melakukan pembelian. Izin modifikasi toko dibatasi secara server-side hanya untuk akun Administrator.
                  </div>
                </div>
              ) : (
                <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div className="leading-relaxed">
                    <strong>Akses Administrator Aktif:</strong> Anda memiliki otorisasi penuh untuk mengelola katalog produk, pesanan pembeli, dan pengaturan toko JOSJISMART.
                  </div>
                </div>
              )}

              <div className="pt-4">
                <button
                  onClick={() => {
                    logout();
                    setUserModalOpen(false);
                  }}
                  className="w-full py-2.5 px-4 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 dark:border-rose-900/60 dark:hover:bg-rose-950/40 flex items-center justify-center gap-2 font-bold text-xs transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Keluar dari Akun</span>
                </button>
              </div>
            </div>
          )}

          {/* USER ORDERS HISTORY */}
          {activeTab === 'orders' && (
            <div className="space-y-3">
              {userOrders.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  <Package className="w-10 h-10 mx-auto mb-2 opacity-50" />
                  <p>Belum ada riwayat pesanan dengan email ini.</p>
                </div>
              ) : (
                userOrders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 space-y-2"
                  >
                    <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-700/60">
                      <div>
                        <span className="font-mono font-bold text-ocean-600 dark:text-ocean-400">{ord.id}</span>
                        <p className="text-[11px] text-slate-400">{formatDate(ord.createdAt)}</p>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                        {ord.status}
                      </span>
                    </div>

                    <div className="space-y-1 text-xs">
                      {ord.items.map((item, i) => (
                        <div key={i} className="flex justify-between text-slate-600 dark:text-slate-300">
                          <span className="truncate max-w-[280px]">
                            {item.quantity}x {item.productName}
                          </span>
                          <span>{formatRupiah(item.price * item.quantity)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex justify-between items-center font-bold text-xs sm:text-sm">
                      <span>Total:</span>
                      <span className="text-ocean-700 dark:text-ocean-300">{formatRupiah(ord.total)}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* WISHLIST */}
          {activeTab === 'wishlist' && (
            <div className="space-y-3">
              {wishlist.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  <Heart className="w-10 h-10 mx-auto mb-2 opacity-50" />
                  <p>Daftar wishlist favorit Anda masih kosong.</p>
                </div>
              ) : (
                wishlist.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 gap-3"
                  >
                    <div
                      onClick={() => {
                        setUserModalOpen(false);
                        onSelectProduct(item);
                      }}
                      className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
                    >
                      <img
                        src={item.images[0]}
                        alt={item.name}
                        className="w-12 h-12 rounded-xl object-cover"
                      />
                      <div className="truncate">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {item.name}
                        </h4>
                        <span className="text-xs font-semibold text-ocean-600 dark:text-ocean-400">
                          {formatRupiah(item.discountPrice ?? item.price)}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleWishlist(item)}
                      className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
                      title="Hapus dari Wishlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
