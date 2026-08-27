import { useEffect, lazy, Suspense } from 'react';
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

// Critical Core Page: Loaded synchronously for instantaneous First Contentful Paint
import { Home } from './pages/Home';

// Lazy-loaded routes to keep initial bundle ultra-lightweight
const Shop = lazy(() => import('./pages/Shop').then(m => ({ default: m.Shop })));
const ProductDetail = lazy(() => import('./pages/ProductDetail').then(m => ({ default: m.ProductDetail })));
const CartPage = lazy(() => import('./pages/CartPage').then(m => ({ default: m.CartPage })));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage').then(m => ({ default: m.CheckoutPage })));
const WishlistPage = lazy(() => import('./pages/WishlistPage').then(m => ({ default: m.WishlistPage })));
const AccountPage = lazy(() => import('./pages/AccountPage').then(m => ({ default: m.AccountPage })));
const Heritage = lazy(() => import('./pages/Heritage').then(m => ({ default: m.Heritage })));
const ContactPage = lazy(() => import('./pages/ContactPage').then(m => ({ default: m.ContactPage })));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const AdminLoginPage = lazy(() => import('./pages/AdminLoginPage').then(m => ({ default: m.AdminLoginPage })));

// Policy & Auxiliary Pages
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy').then(m => ({ default: m.PrivacyPolicy })));
const TermsAndConditions = lazy(() => import('./pages/TermsAndConditions').then(m => ({ default: m.TermsAndConditions })));
const ReturnRefundPolicy = lazy(() => import('./pages/ReturnRefundPolicy').then(m => ({ default: m.ReturnRefundPolicy })));
const ShippingPolicy = lazy(() => import('./pages/ShippingPolicy').then(m => ({ default: m.ShippingPolicy })));
const PaymentInformation = lazy(() => import('./pages/PaymentInformation').then(m => ({ default: m.PaymentInformation })));
const FAQPage = lazy(() => import('./pages/FAQPage').then(m => ({ default: m.FAQPage })));
const OrderSuccess = lazy(() => import('./pages/OrderSuccess').then(m => ({ default: m.OrderSuccess })));
const PaymentFailed = lazy(() => import('./pages/PaymentFailed').then(m => ({ default: m.PaymentFailed })));
const PaymentPending = lazy(() => import('./pages/PaymentPending').then(m => ({ default: m.PaymentPending })));
const TrackOrder = lazy(() => import('./pages/TrackOrder').then(m => ({ default: m.TrackOrder })));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage').then(m => ({ default: m.NotFoundPage })));

import type { Product } from './types';

function PageLoadingSkeleton() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center py-20 px-4">
      <div className="w-10 h-10 border-3 border-[#D4AF37]/30 border-t-[#D4AF37] rounded-full animate-spin" />
      <p className="mt-4 font-serif text-sm tracking-widest text-[#12372A] uppercase font-medium animate-pulse">
        Kavish Atelier
      </p>
    </div>
  );
}

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
        <Suspense fallback={<PageLoadingSkeleton />}>
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
        </Suspense>
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
