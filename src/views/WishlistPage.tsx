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
    <div className="py-12 bg-[#FAF8F1] min-h-screen animate-fadeIn">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="border-b border-[#E8DDC7] pb-6 mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#12372A]">Saved Masterpieces</h1>
            <p className="text-xs text-[#6B5846] mt-1">Your curated collection of traditional Kerala attires.</p>
          </div>
          <span className="text-xs font-bold text-[#D4AF37]">{wishlist.length} Saved Items</span>
        </div>

        {wishlist.length === 0 ? (
          <div className="bg-white p-12 text-center border border-[#E8DDC7] space-y-4 max-w-md mx-auto my-12">
            <Heart className="w-12 h-12 text-[#D4AF37] mx-auto" />
            <h3 className="font-serif text-2xl font-bold text-[#12372A]">Your Wishlist is Empty</h3>
            <p className="text-xs text-[#6B5846]">Explore our Kerala Kasavu sarees, set mundus, and linen shirts to save your favorites.</p>
            <button
              onClick={onNavigateHome}
              className="bg-[#12372A] text-[#FAF8F1] px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-[#D4AF37] hover:text-[#12372A] transition-colors"
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
