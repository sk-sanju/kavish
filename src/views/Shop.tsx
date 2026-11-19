'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { SlidersHorizontal, Grid3X3, LayoutGrid, X, Sparkles } from 'lucide-react';
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
  priceRange: [500, 20000],
  minRating: 0,
  inStockOnly: false,
  sortBy: 'recommended',
  searchQuery: '',
};

const COLLECTION_ALIASES: Record<string, string[]> = {
  'kasavu-masterpieces': ['kasavu-masterpieces', 'festive-edit', 'women-kasavu', 'tissue-sarees'],
  'ceremonial-classics': ['ceremonial-classics', 'kerala-classics', 'men-mundu', 'dhotis'],
  'flax-linen': ['flax-linen', 'linen-edit', 'men-shirts', 'linen'],
  'festive-edit': ['festive-edit', 'kasavu-masterpieces'],
  'kerala-classics': ['kerala-classics', 'ceremonial-classics']
};

export const Shop: React.FC<ShopProps> = ({ initialCategory, initialCollection, onSelectProduct }) => {
  const { products } = useProducts();
  const params = useParams() as { category?: string; collection?: string };
  const searchParams = useSearchParams();
  const router = useRouter();

  const activeCat = params.category || initialCategory || searchParams?.get('category') || undefined;
  const activeCol = params.collection || initialCollection || searchParams?.get('collection') || undefined;
  const activeDept = searchParams?.get('dept') || undefined;
  const urlSearchQuery = searchParams?.get('q') || '';
  const isDirectDept = ['women', 'men', 'kids'].includes((activeCat || '').toLowerCase());

  const [filters, setFilters] = useState<FilterState>(() => {
    const initialGenders: string[] = [];
    if (isDirectDept && activeCat) initialGenders.push(activeCat.toLowerCase());
    if (activeDept && !initialGenders.includes(activeDept.toLowerCase())) initialGenders.push(activeDept.toLowerCase());

    return {
      ...INITIAL_FILTERS,
      gender: initialGenders,
      category: !isDirectDept && activeCat ? [activeCat.toLowerCase()] : [],
      collection: activeCol ? [activeCol] : [],
      searchQuery: urlSearchQuery
    };
  });

  useEffect(() => {
    const isDept = ['women', 'men', 'kids'].includes((activeCat || '').toLowerCase());
    const genders: string[] = [];
    if (isDept && activeCat) genders.push(activeCat.toLowerCase());
    if (activeDept && !genders.includes(activeDept.toLowerCase())) genders.push(activeDept.toLowerCase());

    setFilters(prev => ({
      ...prev,
      gender: genders,
      category: !isDept && activeCat ? [activeCat.toLowerCase()] : prev.category,
      collection: activeCol ? [activeCol] : prev.collection,
      searchQuery: urlSearchQuery || prev.searchQuery
    }));
  }, [activeCat, activeCol, activeDept, urlSearchQuery]);

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
      // 1. Department Filter
      if (filters.gender.length > 0 && !filters.gender.includes(product.category)) {
        return false;
      }

      // 2. Category Filter
      if (filters.category.length > 0) {
        const matchesCategory = filters.category.some(cat => {
          const catFilter = cat.toLowerCase().replace(/-/g, ' ');
          const pSub = (product.subcategory || '').toLowerCase();
          const pCat = (product.category || '').toLowerCase();
          return pSub.includes(catFilter) || pCat.includes(catFilter);
        });
        if (!matchesCategory) return false;
      }

      // 3. Collection Filter
      if (filters.collection.length > 0) {
        const matchesCollection = filters.collection.some(col => {
          const target = col.toLowerCase();
          const pCol = (product.collection || '').toLowerCase();
          const pName = product.name.toLowerCase();
          const aliases = COLLECTION_ALIASES[target] || [target];
          return (
            pCol === target ||
            aliases.some(a => pCol.includes(a) || pName.includes(a.replace(/-/g, ' ')))
          );
        });
        if (!matchesCollection) return false;
      }

      // 4. Fabric Filter
      if (filters.fabric.length > 0 && !filters.fabric.includes(product.fabric)) {
        return false;
      }

      // 5. Sizes Filter
      if (filters.sizes.length > 0 && !filters.sizes.some(s => product.sizes?.includes(s))) {
        return false;
      }

      // 6. Colors Filter
      if (filters.colors.length > 0 && !filters.colors.some(c => product.colors?.some(pc => pc.name === c))) {
        return false;
      }

      // 7. Price Range Filter
      if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
        return false;
      }

      // 8. In Stock Only
      if (filters.inStockOnly && !product.inStock && !product.allowBackorders) {
        return false;
      }

      // 9. Search Query
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        const matchesQuery =
          product.name.toLowerCase().includes(q) ||
          product.fabric.toLowerCase().includes(q) ||
          product.category.toLowerCase().includes(q) ||
          product.subcategory.toLowerCase().includes(q) ||
          (product.tags && product.tags.some(t => t.toLowerCase().includes(q))) ||
          product.sku.toLowerCase().includes(q);
        if (!matchesQuery) return false;
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'price-low-high') return a.price - b.price;
      if (filters.sortBy === 'price-high-low') return b.price - a.price;
      if (filters.sortBy === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      if (filters.sortBy === 'rating') return (b.rating || 5) - (a.rating || 5);
      return 0;
    });
  }, [products, filters]);

  const activePillsCount =
    filters.gender.length +
    filters.category.length +
    filters.collection.length +
    filters.sizes.length +
    filters.colors.length +
    (filters.inStockOnly ? 1 : 0);

  const handleProductClick = (product: Product) => {
    if (onSelectProduct) {
      onSelectProduct(product);
    } else {
      router.push(`/product/${product.id}`);
    }
  };

  return (
    <div className="py-8 sm:py-12 bg-[#FFFFFF] min-h-screen pb-24 animate-fadeIn">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title Section */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#C5A15A] font-bold mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Kavish Master Handlooms</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#111111]">
            {activeCol
              ? activeCol.replace(/-/g, ' ').toUpperCase()
              : activeCat
              ? `${activeCat.toUpperCase()} COLLECTION`
              : filters.searchQuery
              ? `SEARCH: "${filters.searchQuery}"`
              : 'All Kerala Handlooms'}
          </h1>
          <p className="text-xs sm:text-sm text-[#1A1A1A]/70 mt-1 max-w-xl font-light">
            Crafted in Kuthampully, Thrissur. Every Kasavu thread and unbleached cotton drape embodies 500 years of Devanga master weaving tradition.
          </p>
        </div>

        {/* Mobile Horizontal Quick-Filter Bar */}
        <div className="lg:hidden mb-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="shrink-0 flex items-center gap-1.5 bg-white border border-[#C5A15A] px-3.5 py-1.5 rounded-xl text-xs font-bold text-[#111111] shadow-xs cursor-pointer"
            >
              <span>Filters</span>
              <span className="w-4 h-4 rounded-full bg-[#111111] text-[#FFFFFF] text-[10px] flex items-center justify-center">
                {activePillsCount}
              </span>
              <SlidersHorizontal className="w-3.5 h-3.5" />
            </button>

            {/* Price Dropdown Chip */}
            <div className="relative shrink-0">
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange({ sortBy: e.target.value as any })}
                className="appearance-none bg-white border border-[#E5E7EB] text-[#1A1A1A] text-xs font-medium pl-3 pr-7 py-1.5 rounded-xl shadow-xs cursor-pointer focus:outline-none focus:border-[#C5A15A]"
              >
                <option value="recommended">Sort: Recommended</option>
                <option value="price-low-high">Price: Low to High</option>
                <option value="price-high-low">Price: High to Low</option>
                <option value="newest">Newest Arrivals</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>

            {/* In Stock Chip */}
            <button
              onClick={() => handleFilterChange({ inStockOnly: !filters.inStockOnly })}
              className={`shrink-0 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all shadow-xs cursor-pointer ${
                filters.inStockOnly
                  ? 'bg-[#111111] text-[#FFFFFF] border-[#111111]'
                  : 'bg-white text-[#1A1A1A] border-[#E5E7EB]'
              }`}
            >
              In Stock Only
            </button>

            {/* Clear All Chip */}
            {activePillsCount > 0 && (
              <button
                onClick={handleResetFilters}
                className="shrink-0 px-3 py-1.5 rounded-xl border border-red-200 text-red-600 bg-red-50 text-xs font-medium shadow-xs cursor-pointer"
              >
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Desktop Toolbar */}
        <div className="hidden lg:flex bg-white p-3.5 sm:p-4 border border-[#E5E7EB] rounded-2xl mb-6 sm:mb-8 flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center justify-between sm:justify-start gap-3">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Active:</span>
              {filters.gender.map(g => (
                <span key={g} className="bg-[#FFFFFF] border border-[#C5A15A]/50 px-2.5 py-1 rounded-full text-[11px] text-[#111111] font-medium flex items-center gap-1">
                  Dept: {g}
                  <X className="w-3 h-3 cursor-pointer hover:text-red-700" onClick={() => handleFilterChange({ gender: filters.gender.filter(x => x !== g) })} />
                </span>
              ))}
              {filters.category.map(c => (
                <span key={c} className="bg-[#FFFFFF] border border-[#C5A15A]/50 px-2.5 py-1 rounded-full text-[11px] text-[#111111] font-medium flex items-center gap-1">
                  Category: {c}
                  <X className="w-3 h-3 cursor-pointer hover:text-red-700" onClick={() => handleFilterChange({ category: filters.category.filter(x => x !== c) })} />
                </span>
              ))}
              {filters.sizes.map(s => (
                <span key={s} className="bg-[#FFFFFF] border border-[#C5A15A]/50 px-2.5 py-1 rounded-full text-[11px] text-[#111111] font-medium flex items-center gap-1">
                  Size: {s}
                  <X className="w-3 h-3 cursor-pointer hover:text-red-700" onClick={() => handleFilterChange({ sizes: filters.sizes.filter(x => x !== s) })} />
                </span>
              ))}
              {filters.colors.map(col => (
                <span key={col} className="bg-[#FFFFFF] border border-[#C5A15A]/50 px-2.5 py-1 rounded-full text-[11px] text-[#111111] font-medium flex items-center gap-1">
                  Color: {col}
                  <X className="w-3 h-3 cursor-pointer hover:text-red-700" onClick={() => handleFilterChange({ colors: filters.colors.filter(x => x !== col) })} />
                </span>
              ))}
              {filters.inStockOnly && (
                <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-full text-[11px] font-medium flex items-center gap-1">
                  In Stock Only
                  <X className="w-3 h-3 cursor-pointer hover:text-red-700" onClick={() => handleFilterChange({ inStockOnly: false })} />
                </span>
              )}
              {activePillsCount > 0 && (
                <button onClick={handleResetFilters} className="text-[#C5A15A] hover:underline text-[11px] font-semibold ml-2 cursor-pointer">
                  Clear All
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            {/* Grid Column Selector */}
            <div className="hidden md:flex items-center border border-[#E5E7EB] rounded-xl overflow-hidden p-0.5">
              <button
                onClick={() => setGridCols(3)}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${gridCols === 3 ? 'bg-[#111111] text-[#FFFFFF]' : 'text-gray-500 hover:text-black'}`}
                title="3 Columns"
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setGridCols(4)}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${gridCols === 4 ? 'bg-[#111111] text-[#FFFFFF]' : 'text-gray-500 hover:text-black'}`}
                title="4 Columns"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>

            {/* Sorting Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-[#6B7280] uppercase font-bold tracking-wider">Sort:</span>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange({ sortBy: e.target.value as any })}
                className="border border-[#E5E7EB] text-xs font-semibold text-[#111111] bg-[#FFFFFF] px-3 py-1.5 rounded-xl cursor-pointer focus:outline-none focus:border-[#C5A15A]"
              >
                <option value="recommended">Featured &amp; Recommended</option>
                <option value="price-low-high">Price: Low to High</option>
                <option value="price-high-low">Price: High to Low</option>
                <option value="newest">Newest Loom Additions</option>
                <option value="rating">Patron Rating</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Shop Layout: Sidebar + Product Grid */}
        <div className="flex gap-8 items-start">
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
              <div className="bg-white border border-[#E5E7EB] rounded-3xl p-12 text-center space-y-4 shadow-xs">
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#111111]">No Matching Garments Found</h3>
                <p className="text-xs text-[#6B7280] max-w-md mx-auto">
                  Try clearing your active filters or expanding your price and category criteria.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="bg-[#111111] text-[#FFFFFF] px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-[#C5A15A] hover:text-[#000000] transition-all cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <>
                <div className={`grid grid-cols-2 sm:grid-cols-2 ${gridCols === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-3 sm:gap-6`}>
                  {filteredProducts.slice(0, visibleCount).map((product, idx) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onSelectProduct={handleProductClick}
                      priority={idx < 4}
                    />
                  ))}
                </div>

                {visibleCount < filteredProducts.length && (
                  <div className="mt-12 text-center">
                    <button
                      onClick={() => setVisibleCount(prev => prev + 12)}
                      className="bg-white border border-[#E5E7EB] hover:border-[#C5A15A] text-[#111111] hover:bg-[#FFFFFF] px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all shadow-xs cursor-pointer"
                    >
                      Load More Garments ({filteredProducts.length - visibleCount} Remaining)
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
