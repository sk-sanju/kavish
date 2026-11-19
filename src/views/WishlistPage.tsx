'use client';

import React from 'react';
import { Heart } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { ProductCard } from '../components/product/ProductCard';
import type { Product } from '../types';

interface WishlistPageProps {
  onSelectProduct: (product: Product) => void;
  onNavigateHome: () => void;
}

export const WishlistPage: React.FC<WishlistPageProps> = ({ onSelectProduct, onNavigateHome }) => {
  const { wishlist } = useWishlist();

  return (
    <div className="py-12 bg-[#FFFFFF] min-h-screen animate-fadeIn text-[#1A1A1A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="border-b border-[#E5E7EB] pb-6 mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#111111]">Saved Masterpieces</h1>
            <p className="text-xs text-[#6B7280] mt-1">Your curated collection of traditional Kerala attires and handlooms.</p>
          </div>
          <span className="text-xs font-bold text-[#C5A15A] bg-[#111111]/5 px-3 py-1.5 rounded-full border border-[#C5A15A]/30">
            {wishlist.length} Saved Items
          </span>
        </div>

        {wishlist.length === 0 ? (
          <div className="bg-white p-12 text-center border border-[#E5E7EB] rounded-2xl shadow-sm space-y-4 max-w-md mx-auto my-12">
            <Heart className="w-12 h-12 text-[#C5A15A] mx-auto opacity-70" />
            <h3 className="font-serif text-2xl font-bold text-[#111111]">Your Wishlist is Empty</h3>
            <p className="text-xs text-[#6B7280] leading-relaxed">
              Explore our Kerala Kasavu sarees, set mundus, and European linen shirts to curate your favorites.
            </p>
            <button
              onClick={onNavigateHome}
              className="bg-[#111111] text-[#FFFFFF] px-8 py-3.5 text-xs font-bold uppercase tracking-widest hover:bg-[#C5A15A] hover:text-[#111111] transition-all rounded-xl shadow-md cursor-pointer"
            >
              Explore Collections
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {wishlist.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onSelectProduct={onSelectProduct}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
