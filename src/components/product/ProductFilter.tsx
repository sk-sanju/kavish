'use client';

import React, { useMemo } from 'react';
import { SlidersHorizontal, X, RotateCcw } from 'lucide-react';
import type { FilterState } from '../../types';
import { useCurrency } from '../../context/CurrencyContext';
import { useProducts } from '../../context/ProductContext';

interface ProductFilterProps {
  filters: FilterState;
  onFilterChange: (updated: Partial<FilterState>) => void;
  onResetFilters: () => void;
  isOpen: boolean;
  onClose: () => void;
  totalResults: number;
}

const COLLECTIONS = [
  { label: 'Kasavu Masterpieces', value: 'kasavu-masterpieces' },
  { label: 'The Festive Edit', value: 'festive-edit' },
  { label: 'Kerala Classics', value: 'kerala-classics' },
  { label: 'Everyday Kerala Linen', value: 'everyday-kerala' },
  { label: 'Kids Heritage', value: 'kids-heritage' }
];

export const ProductFilter: React.FC<ProductFilterProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  isOpen,
  onClose,
  totalResults,
}) => {
  const { formatPrice } = useCurrency();
  const { categories } = useProducts();

  const activeCategories = useMemo(() => {
    return (categories || []).filter(c => c.status !== 'Disabled');
  }, [categories]);

  const toggleGender = (g: string) => {
    const exists = filters.gender.includes(g);
    const updated = exists ? filters.gender.filter(item => item !== g) : [...filters.gender, g];
    onFilterChange({ gender: updated });
  };

  const toggleCategory = (catSlug: string) => {
    const clean = catSlug.toLowerCase();
    const exists = filters.category.some(c => c.toLowerCase() === clean);
    const updated = exists
      ? filters.category.filter(c => c.toLowerCase() !== clean)
      : [...filters.category, clean];
    onFilterChange({ category: updated });
  };

  const toggleCollection = (col: string) => {
    const exists = filters.collection.includes(col);
    const updated = exists ? filters.collection.filter(item => item !== col) : [...filters.collection, col];
    onFilterChange({ collection: updated });
  };

  const content = (
    <div className="space-y-6 text-xs text-[#171717]">
      <div className="flex items-center justify-between pb-4 border-b border-[#E8DDC7]">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-[#12372A]" />
          <span className="font-serif font-bold text-base text-[#12372A]">Filter Collection</span>
          <span className="text-[10px] text-[#6B5846]">({totalResults} items)</span>
        </div>
        <button
          onClick={onResetFilters}
          className="text-[#D4AF37] hover:text-[#12372A] flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset All</span>
        </button>
      </div>

      <div className="space-y-2">
        <h4 className="font-serif font-semibold text-sm text-[#12372A] uppercase tracking-wider">Department</h4>
        <div className="flex flex-wrap gap-2">
          {['women', 'men', 'kids'].map(g => {
            const active = filters.gender.includes(g);
            return (
              <button
                key={g}
                onClick={() => toggleGender(g)}
                className={`px-3.5 py-1.5 capitalize text-xs border rounded-full transition-all ${
                  active
                    ? 'bg-[#12372A] text-[#FAF8F1] border-[#12372A] font-semibold shadow-xs'
                    : 'bg-white text-[#171717] border-[#E8DDC7] hover:border-[#D4AF37]'
                }`}
              >
                {g}
              </button>
            );
          })}
        </div>
      </div>

      {activeCategories.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-[#E8DDC7]/60">
          <h4 className="font-serif font-semibold text-sm text-[#12372A] uppercase tracking-wider">Categories</h4>
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {activeCategories.map(cat => {
              const catSlug = (cat.slug || '').toLowerCase();
              const catName = (cat.name || '').toLowerCase();
              const active = filters.category.some(c => {
                const clean = c.toLowerCase();
                return clean === catSlug || clean === catName || clean.replace(/-/g, ' ') === catName;
              });
              return (
                <label key={cat.id} className="flex items-center justify-between gap-2.5 cursor-pointer hover:text-[#D4AF37]">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={active}
                      onChange={() => toggleCategory(cat.slug || cat.name)}
                      className="rounded-sm accent-[#12372A] w-3.5 h-3.5"
                    />
                    <span className={active ? 'font-semibold text-[#12372A]' : ''}>{cat.name}</span>
                  </div>
                  <span className="text-[10px] text-gray-400 capitalize">{cat.parentCategory}</span>
                </label>
              );
            })}
          </div>
        </div>
      )}

      <div className="space-y-2 pt-2 border-t border-[#E8DDC7]/60">
        <h4 className="font-serif font-semibold text-sm text-[#12372A] uppercase tracking-wider">Signature Collection</h4>
        <div className="space-y-1.5">
          {COLLECTIONS.map(c => {
            const active = filters.collection.includes(c.value);
            return (
              <label key={c.value} className="flex items-center gap-2.5 cursor-pointer hover:text-[#D4AF37]">
                <input
                  type="checkbox"
                  checked={active}
                  onChange={() => toggleCollection(c.value)}
                  className="rounded-sm accent-[#12372A] w-3.5 h-3.5"
                />
                <span className={active ? 'font-semibold text-[#12372A]' : ''}>{c.label}</span>
              </label>
            );
          })}
        </div>
      </div>

      <div className="space-y-3 pt-2 border-t border-[#E8DDC7]/60">
        <div className="flex items-center justify-between">
          <h4 className="font-serif font-semibold text-sm text-[#12372A] uppercase tracking-wider">Price Range</h4>
          <span className="text-[#D4AF37] font-semibold text-xs bg-[#FAF8F1] px-2 py-0.5 rounded-full border border-[#D4AF37]/30">
            Up to {formatPrice(filters.priceRange[1])}
          </span>
        </div>
        <input
          type="range"
          min={500}
          max={15000}
          step={500}
          value={filters.priceRange[1]}
          onChange={(e) => onFilterChange({ priceRange: [filters.priceRange[0], Number(e.target.value)] })}
          className="w-full accent-[#12372A] cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-[#6B5846]">
          <span>{formatPrice(500)}</span>
          <span>{formatPrice(15000)}+</span>
        </div>
      </div>



      <div className="pt-2 border-t border-[#E8DDC7]/60">
        <label className="flex items-center gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={(e) => onFilterChange({ inStockOnly: e.target.checked })}
            className="rounded-sm accent-[#12372A] w-3.5 h-3.5"
          />
          <span className="font-semibold text-[#12372A]">In-Stock Ready to Dispatch</span>
        </label>
      </div>

    </div>
  );

  return (
    <>
      <div className="hidden lg:block w-64 shrink-0 bg-white p-5 border border-[#E8DDC7] rounded-2xl self-start sticky top-24 shadow-xs">
        {content}
      </div>

      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex justify-end">
          <div className="bg-[#FAF8F1] w-full max-w-xs h-full p-6 overflow-y-auto flex flex-col justify-between animate-slideLeft">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#D4AF37]/30 mb-6">
                <span className="font-serif text-xl font-bold text-[#12372A]">Refine Selection</span>
                <button onClick={onClose} className="p-1 text-[#171717] hover:text-[#D4AF37] w-8 h-8 rounded-full bg-white flex items-center justify-center">
                  <X className="w-5 h-5" />
                </button>
              </div>
              {content}
            </div>

            <div className="pt-6 border-t border-[#E8DDC7] mt-6">
              <button
                onClick={onClose}
                className="w-full bg-[#12372A] text-[#FAF8F1] py-3 text-xs uppercase font-bold tracking-widest hover:bg-[#D4AF37] hover:text-[#12372A] transition-colors rounded-xl shadow-md"
              >
                Apply Filters ({totalResults})
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
