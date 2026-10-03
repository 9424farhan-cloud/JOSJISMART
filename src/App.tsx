import React, { useState, useEffect, useCallback } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
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

import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { AboutPage } from './pages/AboutPage';
import { AdminPage } from './pages/AdminPage';

import { productService } from './services/productService';
import { categoryService } from './services/categoryService';
import { orderService } from './services/orderService';
import { bannerService } from './services/bannerService';
import { MessageCircle } from 'lucide-react';
import { formatWaNumber } from './utils/formatters';
import { Product, Category, Order, StoreSettings } from './types';

export const MainLayout: React.FC = () => {
  const { isAdmin } = useAuth();

  // Navigation tab state
  const [currentTab, setCurrentTab] = useState<'home' | 'products' | 'categories' | 'about' | 'admin'>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Modal states
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [lastCreatedOrder, setLastCreatedOrder] = useState<Order | null>(null);
  const [qrModalOpen, setQrModalOpen] = useState(false);

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
      
      {/* FLOATING WHATSAPP CHAT BUTTON */}
      {currentTab !== 'admin' && (
        <a
          href={`https://wa.me/${formatWaNumber(settings.phone || '085723691588')}?text=${encodeURIComponent('Halo Admin JOSJISMART! Saya tertarik berbelanja dan ingin bertanya seputar produk/pesanan.')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-5 left-5 z-40 flex items-center gap-2.5 px-4 py-3 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs rounded-full shadow-xl shadow-emerald-950/40 border border-emerald-400/30 transition-all group"
          aria-label="Chat WhatsApp Admin"
        >
          <div className="relative">
            <span className="w-2 h-2 rounded-full bg-emerald-300 absolute -top-0.5 -right-0.5 animate-ping" />
            <MessageCircle className="w-4 h-4" />
          </div>
          <span className="hidden sm:inline">WhatsApp: 0857-2369-1588</span>
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
