'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { SlidersHorizontal, Grid3X3, LayoutGrid, X } from 'lucide-react';
import { ProductCard } from '../components/product/ProductCard';
import { ProductFilter } from '../components/product/ProductFilter';
import { useProducts } from '../context/ProductContext';
import type { Product, FilterState } from '../types';

interface ShopProps {
  initialCategory?: string;
  initialCollection?: string;
  onSelectProduct?: (product: Product) => void;
}

const INITIAL_FILTERS: FilterState = {
  gender: [],
  category: [],
  collection: [],
  fabric: [],
  sizes: [],
  colors: [],
  priceRange: [500, 15000],
  minRating: 0,
  inStockOnly: false,
  sortBy: 'recommended',
  searchQuery: '',
};

export const Shop: React.FC<ShopProps> = ({ initialCategory, initialCollection, onSelectProduct }) => {
  const { products } = useProducts();
  const params = useParams() as { category?: string; collection?: string };
  const router = useRouter();

  const activeCat = params.category || initialCategory;
  const activeCol = params.collection || initialCollection;
  const isDirectDept = ['women', 'men', 'kids'].includes((activeCat || '').toLowerCase());

  const [filters, setFilters] = useState<FilterState>(() => ({
    ...INITIAL_FILTERS,
    gender: isDirectDept && activeCat ? [activeCat.toLowerCase()] : [],
    category: !isDirectDept && activeCat ? [activeCat.toLowerCase()] : [],
    collection: activeCol ? [activeCol] : [],
  }));

  useEffect(() => {
    const isDept = ['women', 'men', 'kids'].includes((activeCat || '').toLowerCase());
    setFilters(prev => ({
      ...prev,
      gender: isDept && activeCat ? [activeCat.toLowerCase()] : [],
      category: !isDept && activeCat ? [activeCat.toLowerCase()] : [],
      collection: activeCol ? [activeCol] : [],
    }));
  }, [activeCat, activeCol]);

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [gridCols, setGridCols] = useState<3 | 4>(3);
  const [visibleCount, setVisibleCount] = useState(12);

  const handleFilterChange = (updated: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...updated }));
    setVisibleCount(12);
  };

  const handleResetFilters = () => {
    setFilters(INITIAL_FILTERS);
    setVisibleCount(12);
    router.push('/shop');
  };

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      if (filters.gender.length > 0 && !filters.gender.includes(product.category)) {
        return false;
      }
      if (filters.category.length > 0) {
        const catFilter = filters.category[0].toLowerCase().replace(/-/g, ' ');
        const pSub = (product.subcategory || '').toLowerCase();
        const pName = (product.name || '').toLowerCase();
        const pCat = (product.category || '').toLowerCase();
        const matchesCategory = pSub.includes(catFilter) ||
          catFilter.includes(pSub) ||
          pName.includes(catFilter) ||
          pCat.includes(catFilter) ||
          (product.tags && product.tags.some(t => t.toLowerCase().includes(catFilter)));
        if (!matchesCategory) return false;
      }
      if (filters.collection.length > 0 && !filters.collection.includes(product.collection)) {
        return false;
      }
      if (filters.fabric.length > 0 && !filters.fabric.some(f => product.fabric.toLowerCase().includes(f.toLowerCase()))) {
        return false;
      }
      if (product.price > filters.priceRange[1]) {
        return false;
      }
      if (filters.inStockOnly && !product.inStock) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'price-low-high') return a.price - b.price;
      if (filters.sortBy === 'price-high-low') return b.price - a.price;
      if (filters.sortBy === 'rating') return b.rating - a.rating;
      if (filters.sortBy === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      return 0;
    });
  }, [filters]);

  const activePillsCount = filters.gender.length + filters.collection.length + filters.fabric.length + (filters.inStockOnly ? 1 : 0);

  const handleProductClick = (product: Product) => {
    if (onSelectProduct) {
      onSelectProduct(product);
    }
    router.push(`/product/${product.id}`);
  };

  return (
    <div className="py-8 sm:py-12 bg-[#FAF8F1] min-h-screen animate-fadeIn">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        <div className="border-b border-[#E8DDC7] pb-6 sm:pb-8 mb-6 sm:mb-8">
          <div className="text-[10px] sm:text-xs text-[#6B5846] uppercase tracking-wider mb-2">
            <span className="cursor-pointer hover:underline" onClick={() => router.push('/')}>Home</span> <span className="mx-1">•</span> <span className="text-[#12372A] font-bold">Shop Collection</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <h1 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold text-[#12372A] uppercase tracking-tight">
                {activeCat ? `${activeCat} Attire` : activeCol ? activeCol.replace('-', ' ') : 'All Collections'}
              </h1>
              <p className="text-xs text-[#6B5846] mt-1 max-w-xl">
                Handcrafted Kerala Kasavu sarees, handloom mundus, European linen shirts, and kids legacy wear.
              </p>
            </div>
            <span className="text-xs font-bold text-[#D4AF37] shrink-0">
              Showing {filteredProducts.length} Artisanal Items
            </span>
          </div>
        </div>

        {/* Mobile Quick Filter Chips Bar */}
        <div className="lg:hidden mb-4 -mx-1 px-1">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {/* Filter Toggle Button */}
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className={`shrink-0 px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs ${
                activePillsCount > 0
                  ? 'bg-[#12372A] text-[#FAF8F1] border-[#12372A]'
                  : 'bg-white text-gray-800 border-gray-300 hover:border-gray-400'
              }`}
            >
              <span className="w-4 h-4 rounded bg-gray-100 text-gray-900 text-[10px] font-bold flex items-center justify-center">
                {activePillsCount > 0 ? activePillsCount : '1'}
              </span>
              <SlidersHorizontal className="w-3.5 h-3.5" />
            </button>

            {/* Price Dropdown Chip */}
            <div className="relative shrink-0">
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange({ sortBy: e.target.value as any })}
                className="appearance-none bg-white border border-gray-300 text-gray-800 text-xs font-medium pl-3 pr-7 py-1.5 rounded-lg shadow-xs cursor-pointer focus:outline-none focus:border-[#D4AF37]"
              >
                <option value="recommended">Price ▾</option>
                <option value="price-low-high">Price: Low to High</option>
                <option value="price-high-low">Price: High to Low</option>
                <option value="newest">Newest Arrivals</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>

            {/* In Stock / Express Chip */}
            <button
              onClick={() => handleFilterChange({ inStockOnly: !filters.inStockOnly })}
              className={`shrink-0 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all shadow-xs ${
                filters.inStockOnly
                  ? 'bg-[#12372A] text-[#FAF8F1] border-[#12372A]'
                  : 'bg-white text-gray-700 border-gray-300'
              }`}
            >
              Delivery in 1-2 Days ▾
            </button>

            {/* Clear All Chip */}
            {activePillsCount > 0 && (
              <button
                onClick={handleResetFilters}
                className="shrink-0 px-3 py-1.5 rounded-lg border border-red-200 text-red-600 bg-red-50 text-xs font-medium shadow-xs"
              >
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Desktop Toolbar */}
        <div className="hidden lg:flex bg-white p-3 sm:p-4 border border-[#E8DDC7] rounded-2xl mb-6 sm:mb-8 flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center justify-between sm:justify-start gap-3">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-[11px] font-bold text-[#6B5846] uppercase tracking-wider">Active:</span>
              {filters.gender.map(g => (
                <span key={g} className="bg-[#FAF8F1] border border-[#D4AF37]/50 px-2.5 py-1 rounded-full text-[11px] text-[#12372A] font-medium flex items-center gap-1">
                  Dept: {g}
                  <X className="w-3 h-3 cursor-pointer hover:text-red-700" onClick={() => handleFilterChange({ gender: filters.gender.filter(x => x !== g) })} />
                </span>
              ))}
              {filters.collection.map(c => (
                <span key={c} className="bg-[#FAF8F1] border border-[#D4AF37]/50 px-2.5 py-1 rounded-full text-[11px] text-[#12372A] font-medium flex items-center gap-1">
                  {c}
                  <X className="w-3 h-3 cursor-pointer hover:text-red-700" onClick={() => handleFilterChange({ collection: filters.collection.filter(x => x !== c) })} />
                </span>
              ))}
              {activePillsCount > 0 && (
                <button onClick={handleResetFilters} className="text-[#D4AF37] hover:underline font-bold text-[11px] ml-2">
                  Clear All
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-[#6B5846] uppercase tracking-wider font-semibold text-[11px] whitespace-nowrap">Sort:</span>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange({ sortBy: e.target.value as any })}
                className="bg-[#FAF8F1] border border-[#E8DDC7] px-2.5 py-1.5 text-xs text-[#12372A] font-semibold focus:outline-none focus:border-[#D4AF37] cursor-pointer rounded-xl"
              >
                <option value="recommended">Curated / Recommended</option>
                <option value="price-low-high">Price: Low to High</option>
                <option value="price-high-low">Price: High to Low</option>
                <option value="newest">Newest Arrivals</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>

            <div className="flex items-center gap-1 border-l border-[#E8DDC7] pl-3">
              <button
                onClick={() => setGridCols(3)}
                className={`p-1.5 rounded-lg ${gridCols === 3 ? 'text-[#12372A] bg-[#E8DDC7]/40' : 'text-gray-400'}`}
                title="3 Columns"
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setGridCols(4)}
                className={`p-1.5 rounded-lg ${gridCols === 4 ? 'text-[#12372A] bg-[#E8DDC7]/40' : 'text-gray-400'}`}
                title="4 Columns"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          
          <ProductFilter
            filters={filters}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
            isOpen={isMobileFilterOpen}
            onClose={() => setIsMobileFilterOpen(false)}
            totalResults={filteredProducts.length}
          />

          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="bg-white p-8 sm:p-12 text-center border border-[#E8DDC7] rounded-3xl space-y-4 shadow-xs">
                <p className="font-serif text-xl sm:text-2xl font-bold text-[#12372A]">No Garments Match Selected Filters</p>
                <p className="text-xs text-[#6B5846]">Try resetting price range or clearing fabric filters to view more items.</p>
                <button
                  onClick={handleResetFilters}
                  className="bg-[#12372A] text-[#FAF8F1] px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-[#D4AF37] hover:text-[#12372A] transition-colors rounded-xl shadow-md"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="space-y-8">
                {/* 2 columns on mobile, 3/4 on larger screens */}
                <div
                  className={`grid grid-cols-2 sm:grid-cols-2 ${
                    gridCols === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-3 xl:grid-cols-4'
                  } gap-2.5 sm:gap-4 md:gap-6`}
                >
                  {filteredProducts.slice(0, visibleCount).map((product, idx) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      priority={idx < 4}
                      onSelectProduct={handleProductClick}
                    />
                  ))}
                </div>

                {visibleCount < filteredProducts.length && (
                  <div className="text-center pt-4">
                    <button
                      onClick={() => setVisibleCount(prev => prev + 12)}
                      className="bg-[#12372A] text-[#FAF8F1] hover:bg-[#D4AF37] hover:text-[#12372A] px-8 py-3 text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-md inline-flex items-center gap-2"
                    >
                      <span>Load More Artisanal Pieces</span>
                      <span className="text-[10px] text-[#E8DDC7] bg-black/30 px-2 py-0.5 rounded-full">
                        {filteredProducts.length - visibleCount} remaining
                      </span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
