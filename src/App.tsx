import React, { useState, useEffect, useCallback } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider, useToast } from './context/ToastContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { ToastContainer } from './components/common/ToastContainer';
import { CartDrawer } from './components/shop/CartDrawer';
import { CheckoutModal } from './components/shop/CheckoutModal';
import { ProductDetailModal } from './components/shop/ProductDetailModal';
import { OrderSuccessModal } from './components/shop/OrderSuccessModal';
import { AuthModal } from './components/shop/AuthModal';
import { UserAccountModal } from './components/shop/UserAccountModal';
import { QRCodeModal } from './components/shop/QRCodeModal';
import { OrderRespondModal } from './components/admin/OrderRespondModal';

import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { AboutPage } from './pages/AboutPage';
import { AdminPage } from './pages/AdminPage';

import { productService } from './services/productService';
import { categoryService } from './services/categoryService';
import { orderService } from './services/orderService';
import { bannerService } from './services/bannerService';
import { Instagram, Bell, X } from 'lucide-react';
import { formatWaNumber, formatRupiah } from './utils/formatters';
import { playNotificationSound } from './utils/sound';
import { Product, Category, Order, StoreSettings } from './types';

export const MainLayout: React.FC = () => {
  const { isAdmin } = useAuth();
  const { showToast } = useToast();

  // Navigation tab state
  const [currentTab, setCurrentTab] = useState<'home' | 'products' | 'categories' | 'about' | 'admin'>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Modal states
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [lastCreatedOrder, setLastCreatedOrder] = useState<Order | null>(null);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [adminRespondOrder, setAdminRespondOrder] = useState<Order | null>(null);
  const [realtimeAlertOrder, setRealtimeAlertOrder] = useState<Order | null>(null);

  // Data states
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [settings, setSettings] = useState<StoreSettings>(() => bannerService.getSettings());

  const refreshAllData = useCallback(() => {
    setProducts(productService.getAllProducts());
    setCategories(categoryService.getAllCategories());
    setSettings(bannerService.getSettings());
    try {
      if (isAdmin) {
        setOrders(orderService.getAllOrders());
      }
    } catch {
      // Viewer does not have permission to view all orders
      setOrders([]);
    }
  }, [isAdmin]);

  useEffect(() => {
    refreshAllData();
  }, [refreshAllData]);

  // Real-time Cloud + Multi-Tab Order Listener for Admin Notification
  useEffect(() => {
    if (!isAdmin) return;

    // Request native browser desktop notification permission if supported
    if (
      typeof window !== 'undefined' &&
      'Notification' in window &&
      typeof Notification.requestPermission === 'function' &&
      Notification.permission === 'default'
    ) {
      try {
        const p = Notification.requestPermission();
        if (p && typeof p.catch === 'function') {
          p.catch(() => {});
        }
      } catch {}
    }

    let titleBlinkTimer: any = null;
    const originalTitle = document.title;
    const flashTitle = (customerName: string) => {
      if (typeof document === 'undefined' || document.hasFocus()) return;
      let toggle = false;
      clearInterval(titleBlinkTimer);
      titleBlinkTimer = setInterval(() => {
        document.title = toggle ? `🔔 Pesanan Baru: ${customerName}!` : originalTitle;
        toggle = !toggle;
      }, 1000);
    };

    const stopFlashTitle = () => {
      clearInterval(titleBlinkTimer);
      if (typeof document !== 'undefined') {
        document.title = originalTitle;
      }
    };
    window.addEventListener('focus', stopFlashTitle);
    window.addEventListener('click', stopFlashTitle);

    const unsubscribe = orderService.subscribeToOrders((latestOrders, incomingOrder) => {
      setOrders(latestOrders);
      if (incomingOrder && incomingOrder.status === 'Menunggu') {
        playNotificationSound();
        setRealtimeAlertOrder(incomingOrder);
        flashTitle(incomingOrder.customerName);
        showToast({
          type: 'info',
          title: '🔔 Pesanan Baru Masuk!',
          message: `${incomingOrder.customerName} memesan (${formatRupiah(incomingOrder.total)}). Klik lonceng untuk merespon!`,
        });

        // Native Browser Notification (if allowed)
        if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
          try {
            const notif = new Notification('🔔 JOSJISMART: Pesanan Baru Masuk!', {
              body: `${incomingOrder.customerName} memesan (${formatRupiah(incomingOrder.total)}). Klik untuk merespon!`,
              icon: '/favicon.png',
              tag: incomingOrder.id,
            });
            notif.onclick = () => {
              window.focus();
              setRealtimeAlertOrder(incomingOrder);
            };
          } catch {}
        }
      }
    });

    return () => {
      unsubscribe();
      stopFlashTitle();
      window.removeEventListener('focus', stopFlashTitle);
      window.removeEventListener('click', stopFlashTitle);
    };
  }, [isAdmin, showToast]);

  const handleTestNotification = () => {
    playNotificationSound();
    if (
      typeof window !== 'undefined' &&
      'Notification' in window &&
      typeof Notification.requestPermission === 'function' &&
      Notification.permission === 'default'
    ) {
      try {
        const p = Notification.requestPermission();
        if (p && typeof p.catch === 'function') {
          p.catch(() => {});
        }
      } catch {}
    }
    const testOrd = orderService.triggerTestOrderNotification();
    setRealtimeAlertOrder(testOrd);
    showToast({
      type: 'success',
      title: '🔔 Dering & Notifikasi Berhasil Diuji!',
      message: 'Sistem notifikasi real-time aktif dan siap menyambut pesanan pembeli.',
    });
  };

  const recentProducts = products.slice(0, 8);
  const featuredProducts = products.filter((p) => p.isFeatured).slice(0, 8);

  const handleSelectCategory = (catId: string) => {
    setSelectedCategory(catId);
    setCurrentTab('products');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOrderSuccess = (order: Order) => {
    setLastCreatedOrder(order);
    refreshAllData();
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-800 dark:bg-[#0b1528] dark:text-slate-100 transition-colors duration-200">
      {/* 1. HEADER NAVIGATION */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenQrModal={() => setQrModalOpen(true)}
        orders={orders}
        onOpenOrderRespond={(ord) => setAdminRespondOrder(ord)}
        onTestNotification={handleTestNotification}
      />

      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <HomePage
            settings={settings}
            categories={categories}
            recentProducts={recentProducts}
            featuredProducts={featuredProducts}
            onSelectProduct={setSelectedProduct}
            onSelectCategory={handleSelectCategory}
            onNavigateToProducts={() => {
              setSelectedCategory('all');
              setCurrentTab('products');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {(currentTab === 'products' || currentTab === 'categories') && (
          <ProductsPage
            products={products}
            categories={categories}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            onSelectProduct={setSelectedProduct}
          />
        )}

        {currentTab === 'about' && <AboutPage settings={settings} />}

        {currentTab === 'admin' && (
          <AdminPage
            products={products}
            categories={categories}
            orders={orders}
            settings={settings}
            onRefreshData={refreshAllData}
            onExitAdmin={() => setCurrentTab('home')}
            onPreviewProduct={setSelectedProduct}
          />
        )}
      </main>

      {/* 3. FOOTER (Hidden when in Admin Dashboard for focused workspace) */}
      {currentTab !== 'admin' && (
        <Footer settings={settings} setCurrentTab={setCurrentTab} />
      )}

      {/* 4. MODALS & POPUPS */}
      <CartDrawer />
      <CheckoutModal onSuccess={handleOrderSuccess} />
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onSelectProduct={setSelectedProduct}
      />
      <OrderSuccessModal
        order={lastCreatedOrder}
        onClose={() => setLastCreatedOrder(null)}
        onContinueShopping={() => {
          setLastCreatedOrder(null);
          setCurrentTab('products');
        }}
      />
      <AuthModal />
      <UserAccountModal onSelectProduct={setSelectedProduct} />
      <QRCodeModal isOpen={qrModalOpen} onClose={() => setQrModalOpen(false)} />
      
      {/* QUICK RESPOND TO BUYER MODAL (FOR ADMIN) */}
      {adminRespondOrder && (
        <OrderRespondModal
          order={adminRespondOrder}
          onClose={() => setAdminRespondOrder(null)}
          onUpdateStatus={(id, status, notes) => {
            orderService.updateOrderStatus(id, status, notes);
            refreshAllData();
          }}
        />
      )}

      {/* REAL-TIME INCOMING ORDER ALERT BANNER (FOR ADMIN) */}
      {isAdmin && realtimeAlertOrder && (
        <aside
          role="status"
          aria-live="polite"
          className="fixed top-20 right-4 sm:right-6 z-50 max-w-sm w-full bg-white dark:bg-slate-900 border-2 border-emerald-500 rounded-3xl p-4 shadow-2xl shadow-emerald-950/20 animate-fade-in"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Bell className="w-5 h-5 animate-bounce" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase text-emerald-600 dark:text-emerald-400 tracking-wider">
                  🔔 Pesanan Baru Masuk!
                </span>
                <button
                  onClick={() => setRealtimeAlertOrder(null)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
                  aria-label="Tutup Notifikasi"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate mt-0.5">
                {realtimeAlertOrder.customerName}
              </p>
              <p className="text-[11px] text-slate-500 truncate">
                Total: <strong>{formatRupiah(realtimeAlertOrder.total || 0)}</strong> • {realtimeAlertOrder.items?.length || 0} item
              </p>
              <div className="mt-2.5 flex items-center gap-2">
                <button
                  onClick={() => {
                    const target = realtimeAlertOrder;
                    setRealtimeAlertOrder(null);
                    setAdminRespondOrder(target);
                  }}
                  className="flex-1 py-1.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors"
                >
                  Respon Pembeli Sekarang
                </button>
              </div>
            </div>
          </div>
        </aside>
      )}

      {/* FLOATING INSTAGRAM CHAT BUTTON */}
      {currentTab !== 'admin' && (
        <a
          href="https://ig.me/m/z4turu"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-5 left-5 z-40 flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] hover:opacity-95 active:scale-95 text-white font-bold text-xs rounded-full shadow-xl shadow-purple-950/30 border border-white/20 transition-all group"
          aria-label="Chat Instagram Admin @z4turu"
        >
          <div className="relative">
            <span className="w-2 h-2 rounded-full bg-white absolute -top-0.5 -right-0.5 animate-ping" />
            <Instagram className="w-4 h-4" />
          </div>
          <span className="hidden sm:inline">Chat IG: @z4turu</span>
          <span className="sm:hidden">IG: @z4turu</span>
        </a>
      )}

      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <MainLayout />
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
