import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';

import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { ModalProvider } from './context/ModalContext';
import { AuthProvider } from './context/AuthContext';
import { CurrencyProvider } from './context/CurrencyContext';
import { ProductProvider } from './context/ProductContext';
import { AdminProvider } from './context/AdminContext';

import { AnnouncementBar } from './components/layout/AnnouncementBar';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { MobileNavigation } from './components/layout/MobileNavigation';
import { Toast } from './components/common/Toast';

import { QuickViewModal } from './components/product/QuickViewModal';
import { SizeGuideModal } from './components/product/SizeGuideModal';
import { CartDrawer } from './components/cart/CartDrawer';
import { SearchOverlay } from './components/search/SearchOverlay';
import { OrderTrackerModal } from './components/account/OrderTrackerModal';
import { CustomerAuthModal } from './components/account/CustomerAuthModal';
import { AdminLoginModal } from './components/admin/AdminLoginModal';

import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { ProductDetail } from './pages/ProductDetail';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { WishlistPage } from './pages/WishlistPage';
import { AccountPage } from './pages/AccountPage';
import { Heritage } from './pages/Heritage';
import { ContactPage } from './pages/ContactPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminLoginPage } from './pages/AdminLoginPage';

// Policy & Dedicated Flow Pages
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { TermsAndConditions } from './pages/TermsAndConditions';
import { ReturnRefundPolicy } from './pages/ReturnRefundPolicy';
import { ShippingPolicy } from './pages/ShippingPolicy';
import { PaymentInformation } from './pages/PaymentInformation';
import { FAQPage } from './pages/FAQPage';
import { OrderSuccess } from './pages/OrderSuccess';
import { PaymentFailed } from './pages/PaymentFailed';
import { PaymentPending } from './pages/PaymentPending';
import { TrackOrder } from './pages/TrackOrder';
import { NotFoundPage } from './pages/NotFoundPage';

import type { Product } from './types';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  return null;
}

export function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleSelectProduct = (product: Product) => {
    navigate(`/product/${product.id}`);
  };

  const handleNavigate = (view: string, category?: string, collection?: string) => {
    if (view === 'home') navigate('/');
    else if (view === 'shop' && category) navigate(`/shop/category/${category}`);
    else if (view === 'shop' && collection) navigate(`/shop/collection/${collection}`);
    else if (view === 'shop') navigate('/shop');
    else if (view === 'cart') navigate('/cart');
    else if (view === 'checkout') navigate('/checkout');
    else if (view === 'wishlist') navigate('/wishlist');
    else if (view === 'account') navigate('/account');
    else if (view === 'heritage' || view === 'about') navigate('/heritage');
    else if (view === 'contact') navigate('/contact');
    else if (view === 'faq') navigate('/faq');
    else if (view === 'track-order') navigate('/track-order');
    else if (view === 'privacy-policy') navigate('/privacy-policy');
    else if (view === 'terms-and-conditions') navigate('/terms-and-conditions');
    else if (view === 'return-refund-policy') navigate('/return-refund-policy');
    else if (view === 'shipping-policy') navigate('/shipping-policy');
    else if (view === 'payment-information') navigate('/payment-information');
    else if (view === 'admin') navigate('/admin');
    else navigate(`/${view}`);
  };

  const isAdminRoute = location.pathname.startsWith('/admin') || location.pathname.startsWith('/kavish');

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#FAF8F1] font-sans antialiased text-[#171717]">
      <ScrollToTop />
      
      {!isAdminRoute && <AnnouncementBar />}
      {!isAdminRoute && <Header />}

      <main className="flex-1">
        <Routes>
          {/* Main Pages */}
          <Route path="/" element={<Home onSelectProduct={handleSelectProduct} onNavigate={handleNavigate} />} />
          <Route path="/shop" element={<Shop onSelectProduct={handleSelectProduct} />} />
          <Route path="/shop/category/:category" element={<Shop onSelectProduct={handleSelectProduct} />} />
          <Route path="/shop/collection/:collection" element={<Shop onSelectProduct={handleSelectProduct} />} />
          <Route path="/product/:id" element={<ProductDetail onSelectProduct={handleSelectProduct} onProceedToCheckout={() => navigate('/checkout')} />} />
          <Route path="/cart" element={<CartPage onProceedToCheckout={() => navigate('/checkout')} />} />
          <Route path="/checkout" element={<CheckoutPage onOrderSuccess={() => {}} onNavigateHome={() => navigate('/')} />} />
          <Route path="/wishlist" element={<WishlistPage onSelectProduct={handleSelectProduct} onNavigateHome={() => navigate('/')} />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/heritage" element={<Heritage onNavigate={handleNavigate} />} />
          <Route path="/about" element={<Heritage onNavigate={handleNavigate} />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* Legal & Policy Pages */}
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
          <Route path="/return-refund-policy" element={<ReturnRefundPolicy />} />
          <Route path="/shipping-policy" element={<ShippingPolicy />} />
          <Route path="/payment-information" element={<PaymentInformation />} />
          <Route path="/faq" element={<FAQPage />} />

          {/* Order Lifecycle & Tracking */}
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/payment-failed" element={<PaymentFailed />} />
          <Route path="/payment-pending" element={<PaymentPending />} />
          <Route path="/track-order" element={<TrackOrder />} />
          
          {/* Admin Login & Console URL Routes */}
          <Route path="/kavish" element={<AdminLoginPage />} />
          <Route path="/kavish/admin" element={<AdminLoginPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/*" element={<AdminDashboard />} />

          {/* 404 Not Found Handling */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      {!isAdminRoute && <Footer onNavigate={handleNavigate} />}
      {!isAdminRoute && <MobileNavigation />}

      <QuickViewModal />
      <SizeGuideModal />
      <CartDrawer onProceedToCheckout={() => navigate('/checkout')} />
      <SearchOverlay
        onSelectProduct={handleSelectProduct}
        onSearchCategory={(cat) => navigate(`/shop/category/${cat}`)}
      />
      <OrderTrackerModal />
      <CustomerAuthModal />
      <AdminLoginModal onAdminLoginSuccess={() => navigate('/admin')} />

      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <WishlistProvider>
          <CartProvider>
            <ModalProvider>
              <CurrencyProvider>
                <ProductProvider>
                  <AdminProvider>
                    <AppContent />
                  </AdminProvider>
                </ProductProvider>
              </CurrencyProvider>
            </ModalProvider>
          </CartProvider>
        </WishlistProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
