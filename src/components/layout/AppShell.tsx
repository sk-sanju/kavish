'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AnnouncementBar } from './AnnouncementBar';
import { Header } from './Header';
import { Footer } from './Footer';
import { MobileNavigation } from './MobileNavigation';
import { Toast } from '../common/Toast';

import { QuickViewModal } from '../product/QuickViewModal';
import { SizeGuideModal } from '../product/SizeGuideModal';
import { CartDrawer } from '../cart/CartDrawer';
import { SearchOverlay } from '../search/SearchOverlay';
import { OrderTrackerModal } from '../account/OrderTrackerModal';
import { CustomerAuthModal } from '../account/CustomerAuthModal';
import { AdminLoginModal } from '../admin/AdminLoginModal';
import type { Product } from '../../types';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '';
  const router = useRouter();

  const isAdminRoute = pathname.startsWith('/admin') || pathname.startsWith('/kavish');

  const handleSelectProduct = (product: Product) => {
    router.push(`/product/${product.id}`);
  };

  const handleNavigate = (view: string, category?: string, collection?: string) => {
    if (view === 'home') router.push('/');
    else if (view === 'shop' && category) router.push(`/shop/category/${category}`);
    else if (view === 'shop' && collection) router.push(`/shop/collection/${collection}`);
    else if (view === 'shop') router.push('/shop');
    else if (view === 'cart') router.push('/cart');
    else if (view === 'checkout') router.push('/checkout');
    else if (view === 'wishlist') router.push('/wishlist');
    else if (view === 'account') router.push('/account');
    else if (view === 'heritage' || view === 'about') router.push('/heritage');
    else if (view === 'contact') router.push('/contact');
    else if (view === 'faq') router.push('/faq');
    else if (view === 'track-order') router.push('/track-order');
    else if (view === 'privacy-policy') router.push('/privacy-policy');
    else if (view === 'terms-and-conditions') router.push('/terms-and-conditions');
    else if (view === 'return-refund-policy') router.push('/return-refund-policy');
    else if (view === 'shipping-policy') router.push('/shipping-policy');
    else if (view === 'payment-information') router.push('/payment-information');
    else if (view === 'admin') router.push('/admin');
    else router.push(`/${view}`);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#FAF8F1] font-sans antialiased text-[#171717]">
      {!isAdminRoute && <AnnouncementBar />}
      {!isAdminRoute && <Header />}

      <main className="flex-1">{children}</main>

      {!isAdminRoute && <Footer onNavigate={handleNavigate} />}
      {!isAdminRoute && <MobileNavigation />}

      <QuickViewModal />
      <SizeGuideModal />
      <CartDrawer onProceedToCheckout={() => router.push('/checkout')} />
      <SearchOverlay
        onSelectProduct={handleSelectProduct}
        onSearchCategory={(cat) => router.push(`/shop/category/${cat}`)}
      />
      <OrderTrackerModal />
      <CustomerAuthModal />
      <AdminLoginModal onAdminLoginSuccess={() => router.push('/admin')} />

      <Toast />
    </div>
  );
}
