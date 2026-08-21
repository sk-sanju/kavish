import React from 'react';
import { HeroSection } from '../components/home/HeroSection';
import { FeaturedCollections } from '../components/home/FeaturedCollections';
import { HeritageSpotlight } from '../components/home/HeritageSpotlight';
import { CuratedProducts } from '../components/home/CuratedProducts';
import { EditorialQuotes } from '../components/home/EditorialQuotes';
import { SocialGallery } from '../components/home/SocialGallery';
import type { Product } from '../types';

interface HomeProps {
  onSelectProduct: (product: Product) => void;
  onNavigate: (view: string, categoryFilter?: string, collectionFilter?: string) => void;
}

export const Home: React.FC<HomeProps> = ({ onSelectProduct, onNavigate }) => {
  return (
    <div className="animate-fadeIn">
      <HeroSection onNavigate={onNavigate} />
      <FeaturedCollections onNavigate={onNavigate} />
      <HeritageSpotlight onNavigate={onNavigate} />
      <CuratedProducts onSelectProduct={onSelectProduct} onNavigate={onNavigate} />
      <EditorialQuotes />
      <SocialGallery />
    </div>
  );
};
