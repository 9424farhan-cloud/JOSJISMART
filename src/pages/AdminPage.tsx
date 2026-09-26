import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { AdminSidebar, AdminTab } from '../components/admin/AdminSidebar';
import { AdminDashboardView } from '../components/admin/AdminDashboardView';
import { AdminProductsView } from '../components/admin/AdminProductsView';
import { AdminProductFormModal } from '../components/admin/AdminProductFormModal';
import { AdminCategoriesView } from '../components/admin/AdminCategoriesView';
import { AdminOrdersView } from '../components/admin/AdminOrdersView';
import { AdminBannersView } from '../components/admin/AdminBannersView';
import { AdminSettingsView } from '../components/admin/AdminSettingsView';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import { orderService } from '../services/orderService';
import { bannerService } from '../services/bannerService';
import { Product, Category, Order, StoreSettings, OrderStatus } from '../types';
import { ShieldAlert, Lock, ArrowLeft } from 'lucide-react';

interface AdminPageProps {
  products: Product[];
  categories: Category[];
  orders: Order[];
  settings: StoreSettings;
  onRefreshData: () => void;
  onExitAdmin: () => void;
  onPreviewProduct: (product: Product) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({
  products,
  categories,
  orders,
  settings,
  onRefreshData,
  onExitAdmin,
  onPreviewProduct,
}) => {
  const { user, isAdmin, setAuthModalOpen } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // STRICT ACCESS CONTROL
  if (!isAdmin) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 text-center shadow-xl space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto shadow-sm">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Akses Khusus Administrator
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Halaman ini khusus untuk pengelolaan toko JOSJISMART oleh <strong>Gaza admin</strong>. Akun pengunjung (Google Viewer) tidak memiliki izin untuk mengubah database toko.
          </p>

          <div className="pt-2 flex flex-col gap-2.5">
            <button
              onClick={() => setAuthModalOpen(true)}
              className="w-full py-3 px-4 rounded-xl bg-ocean-600 hover:bg-ocean-700 text-white font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-colors"
            >
              <Lock className="w-4 h-4" />
              <span>Masuk sebagai Administrator</span>
            </button>

            <button
              onClick={onExitAdmin}
              className="w-full py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Beranda Toko</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- PRODUCT HANDLERS ---
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProductModalOpen(true);
  };

  const handleEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setProductModalOpen(true);
  };

  const handleSaveProduct = (data: any) => {
    try {
      if (editingProduct) {
        productService.updateProduct(editingProduct.id, data);
        showToast({
          type: 'success',
          title: 'Produk Diperbarui',
          message: `${data.name} berhasil disimpan.`,
        });
      } else {
        productService.createProduct(data);
        showToast({
          type: 'success',
          title: 'Produk Baru Ditambahkan',
          message: `${data.name} berhasil dimasukkan ke katalog toko.`,
        });
      }
      setProductModalOpen(false);
      onRefreshData();
    } catch (err: any) {
      showToast({
        type: 'error',
        title: 'Gagal Menyimpan',
        message: err.message || 'Terjadi kesalahan otorisasi.',
      });
    }
  };

  const handleDeleteProduct = (productId: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus produk ini secara permanen?')) {
      try {
        productService.deleteProduct(productId);
        showToast({
          type: 'info',
          title: 'Produk Dihapus',
          message: 'Produk telah dihapus dari database.',
        });
        onRefreshData();
      } catch (err: any) {
        showToast({
          type: 'error',
          title: 'Gagal Menghapus',
          message: err.message,
        });
      }
    }
  };

  const handleQuickStock = (productId: string, stock: number) => {
    try {
      productService.quickUpdateStock(productId, stock);
      onRefreshData();
    } catch (err: any) {
      showToast({ type: 'error', title: 'Gagal Update Stok', message: err.message });
    }
  };

  const handleQuickPrice = (productId: string, newPrice: number) => {
    try {
      productService.quickUpdatePrice(productId, newPrice);
      showToast({ type: 'success', title: 'Harga Berhasil Diperbarui' });
      onRefreshData();
    } catch (err: any) {
      showToast({ type: 'error', title: 'Gagal Update Harga', message: err.message });
    }
  };

  // --- CATEGORY HANDLERS ---
  const handleCreateCategory = (data: { name: string; description: string; icon?: string }) => {
    try {
      categoryService.createCategory(data);
      onRefreshData();
    } catch (err: any) {
      showToast({ type: 'error', title: 'Gagal Membuat Kategori', message: err.message });
    }
  };

  const handleUpdateCategory = (id: string, updates: Partial<Category>) => {
    try {
      categoryService.updateCategory(id, updates);
      onRefreshData();
    } catch (err: any) {
      showToast({ type: 'error', title: 'Gagal Update Kategori', message: err.message });
    }
  };

  const handleDeleteCategory = (id: string) => {
    if (window.confirm('Hapus kategori ini?')) {
      try {
        categoryService.deleteCategory(id);
        showToast({ type: 'info', title: 'Kategori Dihapus' });
        onRefreshData();
      } catch (err: any) {
        showToast({ type: 'error', title: 'Gagal Menghapus', message: err.message });
      }
    }
  };

  // --- ORDER HANDLERS ---
  const handleUpdateOrderStatus = (orderId: string, status: OrderStatus, notes?: string) => {
    try {
      orderService.updateOrderStatus(orderId, status, notes);
      onRefreshData();
    } catch (err: any) {
      showToast({ type: 'error', title: 'Gagal Update Status', message: err.message });
    }
  };

  const handleDeleteOrder = (orderId: string) => {
    if (window.confirm('Hapus riwayat pesanan ini?')) {
      try {
        orderService.deleteOrder(orderId);
        showToast({ type: 'info', title: 'Pesanan Dihapus' });
        onRefreshData();
      } catch (err: any) {
        showToast({ type: 'error', title: 'Gagal Menghapus', message: err.message });
      }
    }
  };

  // --- BANNER & SETTINGS HANDLERS ---
  const handleUpdateSettings = (updates: Partial<StoreSettings>) => {
    try {
      bannerService.updateSettings(updates);
      onRefreshData();
    } catch (err: any) {
      showToast({ type: 'error', title: 'Gagal Menyimpan Pengaturan', message: err.message });
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-5rem)]">
      {/* SIDEBAR NAVIGATION */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onExitAdmin={onExitAdmin}
      />

      {/* MAIN VIEW CONTENT AREA */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
        {activeTab === 'dashboard' && (
          <AdminDashboardView
            products={products}
            orders={orders}
            categories={categories}
            setActiveTab={setActiveTab}
            onOpenAddProduct={handleOpenAddProduct}
          />
        )}

        {activeTab === 'products' && (
          <AdminProductsView
            products={products}
            categories={categories}
            onOpenAddModal={handleOpenAddProduct}
            onEditProduct={handleEditProduct}
            onDeleteProduct={handleDeleteProduct}
            onPreviewProduct={onPreviewProduct}
            onQuickUpdateStock={handleQuickStock}
            onQuickUpdatePrice={handleQuickPrice}
          />
        )}

        {activeTab === 'categories' && (
          <AdminCategoriesView
            categories={categories}
            onCreateCategory={handleCreateCategory}
            onUpdateCategory={handleUpdateCategory}
            onDeleteCategory={handleDeleteCategory}
          />
        )}

        {activeTab === 'orders' && (
          <AdminOrdersView
            orders={orders}
            onUpdateStatus={handleUpdateOrderStatus}
            onDeleteOrder={handleDeleteOrder}
          />
        )}

        {activeTab === 'banners' && (
          <AdminBannersView
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
          />
        )}

        {activeTab === 'settings' && (
          <AdminSettingsView
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            onResetData={onRefreshData}
          />
        )}
      </main>

      {/* PRODUCT FORM MODAL */}
      <AdminProductFormModal
        isOpen={productModalOpen}
        onClose={() => setProductModalOpen(false)}
        categories={categories}
        initialProduct={editingProduct}
        onSave={handleSaveProduct}
      />
    </div>
  );
};
