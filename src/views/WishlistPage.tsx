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
    <div className="py-12 bg-[#F8F5EF] min-h-screen animate-fadeIn text-[#292522]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="border-b border-[#E8DFD0] pb-6 mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#641E2B]">Saved Masterpieces</h1>
            <p className="text-xs text-[#6E685D] mt-1">Your curated collection of traditional Kerala attires and handlooms.</p>
          </div>
          <span className="text-xs font-bold text-[#B99A61] bg-[#641E2B]/5 px-3 py-1.5 rounded-full border border-[#B99A61]/30">
            {wishlist.length} Saved Items
          </span>
        </div>

        {wishlist.length === 0 ? (
          <div className="bg-white p-12 text-center border border-[#E8DFD0] rounded-2xl shadow-sm space-y-4 max-w-md mx-auto my-12">
            <Heart className="w-12 h-12 text-[#B99A61] mx-auto opacity-70" />
            <h3 className="font-serif text-2xl font-bold text-[#641E2B]">Your Wishlist is Empty</h3>
            <p className="text-xs text-[#6E685D] leading-relaxed">
              Explore our Kerala Kasavu sarees, set mundus, and European linen shirts to curate your favorites.
            </p>
            <button
              onClick={onNavigateHome}
              className="bg-[#641E2B] text-[#F8F5EF] px-8 py-3.5 text-xs font-bold uppercase tracking-widest hover:bg-[#B99A61] hover:text-[#641E2B] transition-all rounded-xl shadow-md cursor-pointer"
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
