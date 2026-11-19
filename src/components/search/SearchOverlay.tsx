'use client';

import React, { useState } from 'react';
import { Search, X, TrendingUp, Sparkles } from 'lucide-react';
import { useModal } from '../../context/ModalContext';
import { useCurrency } from '../../context/CurrencyContext';
import { useProducts } from '../../context/ProductContext';
import { OptimizedImage } from '../common/OptimizedImage';
import type { Product } from '../../types';

interface SearchOverlayProps {
  onSelectProduct: (product: Product) => void;
  onSearchCategory: (category: string) => void;
}

const RECENT_SEARCHES = ['Kasavu Tissue Saree', 'Classic Double Mundu', 'Kerala Organic Linen', 'Pattu Pavada'];
const POPULAR_TAGS = ['Kuthampully Kasavu', 'Onam Special', 'Kerala Handloom', 'Unbleached Cotton', 'Festive Silk'];

export const SearchOverlay: React.FC<SearchOverlayProps> = ({ onSelectProduct, onSearchCategory }) => {
  const { isSearchOpen, setIsSearchOpen } = useModal();
  const { formatPrice } = useCurrency();
  const { products } = useProducts();
  const [query, setQuery] = useState('');

  if (!isSearchOpen) return null;

  const filteredProducts = query.trim()
    ? products.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.subtitle.toLowerCase().includes(query.toLowerCase()) ||
        p.subcategory.toLowerCase().includes(query.toLowerCase()) ||
        p.fabric.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const handleSelect = (product: Product) => {
    setIsSearchOpen(false);
    onSelectProduct(product);
  };

  const handleTagClick = (tag: string) => {
    setQuery(tag);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#F8F5EF]/95 backdrop-blur-md overflow-y-auto p-4 sm:p-8 animate-fadeIn">
      <div className="max-w-5xl mx-auto">
        
        <div className="flex items-center justify-between pb-6 border-b border-[#B99A61]/30">
          <div className="flex items-center gap-2">
            <span className="font-serif text-2xl font-bold tracking-widest text-[#641E2B]">KAVISH</span>
            <span className="text-xs text-[#B99A61] font-semibold uppercase tracking-widest">Atelier Search</span>
          </div>

          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-2 text-[#641E2B] hover:text-[#B99A61] transition-colors"
          >
            <X className="w-7 h-7" />
          </button>
        </div>

        <div className="py-8 border-b border-[#E8DFD0]">
          <div className="relative flex items-center">
            <Search className="w-7 h-7 text-[#B99A61] absolute left-4" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search Kasavu Sarees, Mundu, European Linen Shirts, Kids Wear..."
              className="w-full bg-white border border-[#B99A61]/40 pl-14 pr-12 py-4 text-sm sm:text-base font-sans text-[#292522] placeholder-[#6E685D]/60 focus:outline-none focus:border-[#641E2B] shadow-sm rounded-xl"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-4 text-gray-400 hover:text-[#641E2B]"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {query.trim() ? (
          <div className="py-8 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-semibold text-[#641E2B]">
                Search Results ({filteredProducts.length})
              </h3>
              <span className="text-xs text-[#6E685D]">Showing matches for "{query}"</span>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-12 text-[#6E685D] space-y-2">
                <p className="font-serif text-lg text-[#641E2B]">No products found matching "{query}"</p>
                <p className="text-xs">Try searching for "Kasavu", "Mundu", "Silk", or "Linen"</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredProducts.map(prod => (
                  <div
                    key={prod.id}
                    onClick={() => handleSelect(prod)}
                    className="bg-white p-3 border border-[#E8DFD0] hover:border-[#B99A61] cursor-pointer group transition-all rounded-xl shadow-xs"
                  >
                    <div className="aspect-[3/4] bg-[#F8F5EF] overflow-hidden mb-2 rounded-xl">
                      <OptimizedImage
                        src={prod.images[0]}
                        alt={prod.name}
                        preset="card"
                        aspectRatio="3/4"
                        containerClassName="w-full h-full rounded-xl"
                        imageClassName="group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <span className="text-[9px] uppercase font-bold text-[#B99A61]">{prod.subcategory}</span>
                    <h4 className="font-serif text-sm font-semibold text-[#641E2B] line-clamp-1 group-hover:text-[#B99A61]">
                      {prod.name}
                    </h4>
                    <p className="text-xs font-bold text-[#641E2B] mt-1">{formatPrice(prod.price)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="py-8 grid grid-cols-1 md:grid-cols-2 gap-8 text-xs">
            <div>
              <div className="flex items-center gap-2 font-serif font-bold text-base text-[#641E2B] mb-3">
                <TrendingUp className="w-4 h-4 text-[#B99A61]" />
                <span>Recent Trending Searches</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {RECENT_SEARCHES.map(item => (
                  <button
                    key={item}
                    onClick={() => handleTagClick(item)}
                    className="bg-white border border-[#E8DFD0] px-3.5 py-2 rounded-lg hover:border-[#B99A61] hover:text-[#641E2B] transition-colors"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 font-serif font-bold text-base text-[#641E2B] mb-3">
                <Sparkles className="w-4 h-4 text-[#B99A61]" />
                <span>Popular Weaving Tags</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {POPULAR_TAGS.map(tag => (
                  <button
                    key={tag}
                    onClick={() => {
                      handleTagClick(tag);
                      onSearchCategory(tag);
                    }}
                    className="bg-[#E8DFD0]/40 border border-[#B99A61]/30 text-[#641E2B] px-3.5 py-2 rounded-lg hover:bg-[#641E2B] hover:text-[#F8F5EF] transition-colors font-medium"
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
