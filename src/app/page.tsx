'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { HeroSection } from '../components/home/HeroSection';
import { CategoryShowcase } from '../components/home/CategoryShowcase';
import { HeritageSpotlight } from '../components/home/HeritageSpotlight';
import { CuratedProducts } from '../components/home/CuratedProducts';
import { EditorialQuotes } from '../components/home/EditorialQuotes';
import { SocialGallery } from '../components/home/SocialGallery';
import type { Product } from '../types';

export default function HomePage() {
  const router = useRouter();

  const handleSelectProduct = (product: Product) => {
    router.push(`/product/${product.id}`);
  };

  const handleNavigate = (view: string, categoryFilter?: string, collectionFilter?: string) => {
    if (view === 'home') router.push('/');
    else if (view === 'shop' && categoryFilter) router.push(`/shop/category/${categoryFilter}`);
    else if (view === 'shop' && collectionFilter) router.push(`/shop/collection/${collectionFilter}`);
    else if (view === 'shop') router.push('/shop');
    else if (view === 'cart') router.push('/cart');
    else if (view === 'checkout') router.push('/checkout');
    else if (view === 'wishlist') router.push('/wishlist');
    else if (view === 'account') router.push('/account');
    else if (view === 'heritage' || view === 'about') router.push('/heritage');
    else if (view === 'contact') router.push('/contact');
    else if (view === 'faq') router.push('/faq');
    else if (view === 'track-order') router.push('/track-order');
    else if (view === 'admin') router.push('/admin');
    else router.push(`/${view}`);
  };

  return (
    <div className="animate-fadeIn">
      <HeroSection onNavigate={handleNavigate} />
      <CategoryShowcase onNavigate={handleNavigate} />
      <HeritageSpotlight onNavigate={handleNavigate} />
      <CuratedProducts onSelectProduct={handleSelectProduct} onNavigate={handleNavigate} />
      <EditorialQuotes />
      <SocialGallery />
    </div>
  );
}
