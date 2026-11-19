'use client';

import React, { useMemo } from 'react';
import { SlidersHorizontal, X, RotateCcw, Check } from 'lucide-react';
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
  { label: 'Ceremonial Classics', value: 'ceremonial-classics' },
  { label: 'European Flax Linen', value: 'flax-linen' },
];

const STANDARD_SIZES = ['Free Size', 'S', 'M', 'L', 'XL', 'XXL', '38', '40', '42', '44'];

const STANDARD_COLORS = [
  { name: 'Kasavu Gold', hex: '#C5A15A' },
  { name: 'Natural Ivory', hex: '#FFFFFF' },
  { name: 'Royal Maroon', hex: '#111111' },
  { name: 'Deep Peacock', hex: '#0F4C5C' },
  { name: 'Charcoal Black', hex: '#1A1A1A' },
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

  const toggleSize = (sz: string) => {
    const exists = filters.sizes.includes(sz);
    const updated = exists ? filters.sizes.filter(s => s !== sz) : [...filters.sizes, sz];
    onFilterChange({ sizes: updated });
  };

  const toggleColor = (colName: string) => {
    const exists = filters.colors.includes(colName);
    const updated = exists ? filters.colors.filter(c => c !== colName) : [...filters.colors, colName];
    onFilterChange({ colors: updated });
  };

  const content = (
    <div className="space-y-6 text-xs text-[#1A1A1A]">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#E5E7EB]">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-[#111111]" />
          <span className="font-serif font-bold text-base text-[#111111]">Filter Collection</span>
          <span className="text-[10px] text-[#6B7280]">({totalResults} items)</span>
        </div>
        <button
          onClick={onResetFilters}
          className="text-[#C5A15A] hover:text-[#111111] flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset All</span>
        </button>
      </div>

      {/* 1. Department */}
      <div className="space-y-2.5">
        <span className="font-bold uppercase tracking-wider text-[11px] text-[#111111] block">
          Department
        </span>
        <div className="space-y-1.5">
          {[
            { id: 'women', label: 'Women Collection' },
            { id: 'men', label: 'Men Collection' },
            { id: 'kids', label: 'Kids Ethnic' }
          ].map(d => (
            <label key={d.id} className="flex items-center gap-2.5 cursor-pointer hover:text-[#111111]">
              <input
                type="checkbox"
                checked={filters.gender.includes(d.id)}
                onChange={() => toggleGender(d.id)}
                className="w-4 h-4 rounded border-[#E5E7EB] text-[#111111] focus:ring-[#C5A15A] cursor-pointer"
              />
              <span className="font-medium text-xs">{d.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 2. Categories */}
      {activeCategories.length > 0 && (
        <div className="space-y-2.5 pt-4 border-t border-[#E5E7EB]">
          <span className="font-bold uppercase tracking-wider text-[11px] text-[#111111] block">
            Handloom Categories
          </span>
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {activeCategories.map(cat => (
              <label key={cat.id} className="flex items-center gap-2.5 cursor-pointer hover:text-[#111111]">
                <input
                  type="checkbox"
                  checked={filters.category.some(c => c.toLowerCase() === cat.slug.toLowerCase())}
                  onChange={() => toggleCategory(cat.slug)}
                  className="w-4 h-4 rounded border-[#E5E7EB] text-[#111111] focus:ring-[#C5A15A] cursor-pointer"
                />
                <span className="font-medium text-xs capitalize">{cat.name}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* 3. Curated Collections */}
      <div className="space-y-2.5 pt-4 border-t border-[#E5E7EB]">
        <span className="font-bold uppercase tracking-wider text-[11px] text-[#111111] block">
          Royal Collections
        </span>
        <div className="space-y-1.5">
          {COLLECTIONS.map(col => (
            <label key={col.value} className="flex items-center gap-2.5 cursor-pointer hover:text-[#111111]">
              <input
                type="checkbox"
                checked={filters.collection.includes(col.value)}
                onChange={() => toggleCollection(col.value)}
                className="w-4 h-4 rounded border-[#E5E7EB] text-[#111111] focus:ring-[#C5A15A] cursor-pointer"
              />
              <span className="font-medium text-xs">{col.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 4. Sizes */}
      <div className="space-y-2.5 pt-4 border-t border-[#E5E7EB]">
        <span className="font-bold uppercase tracking-wider text-[11px] text-[#111111] block">
          Size / Draping
        </span>
        <div className="flex flex-wrap gap-1.5">
          {STANDARD_SIZES.map(sz => {
            const isSelected = filters.sizes.includes(sz);
            return (
              <button
                key={sz}
                type="button"
                onClick={() => toggleSize(sz)}
                className={`px-2.5 py-1 text-[11px] border rounded-lg transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#111111] text-[#FFFFFF] border-[#111111] font-bold shadow-xs'
                    : 'bg-white text-[#1A1A1A] border-[#E5E7EB] hover:border-[#C5A15A]'
                }`}
              >
                {sz}
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Colors & Zari */}
      <div className="space-y-2.5 pt-4 border-t border-[#E5E7EB]">
        <span className="font-bold uppercase tracking-wider text-[11px] text-[#111111] block">
          Zari Accent &amp; Color
        </span>
        <div className="flex flex-wrap gap-2">
          {STANDARD_COLORS.map(c => {
            const isSelected = filters.colors.includes(c.name);
            return (
              <button
                key={c.name}
                type="button"
                onClick={() => toggleColor(c.name)}
                className={`w-7 h-7 rounded-full border-2 transition-transform relative flex items-center justify-center cursor-pointer ${
                  isSelected ? 'border-[#111111] ring-2 ring-[#C5A15A] scale-110' : 'border-[#E5E7EB] hover:scale-105'
                }`}
                style={{ backgroundColor: c.hex }}
                title={c.name}
              >
                {isSelected && <Check className={`w-3.5 h-3.5 ${c.hex === '#FFFFFF' ? 'text-black' : 'text-white'}`} />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 6. Availability Checkbox */}
      <div className="pt-4 border-t border-[#E5E7EB]">
        <label className="flex items-center gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={(e) => onFilterChange({ inStockOnly: e.target.checked })}
            className="w-4 h-4 rounded border-[#E5E7EB] text-[#111111] focus:ring-[#C5A15A] cursor-pointer"
          />
          <span className="font-semibold text-xs text-[#111111]">In Stock &amp; Express Dispatch</span>
        </label>
      </div>

      {/* 7. Price Range */}
      <div className="space-y-2.5 pt-4 border-t border-[#E5E7EB]">
        <div className="flex items-center justify-between">
          <span className="font-bold uppercase tracking-wider text-[11px] text-[#111111]">
            Price Limit
          </span>
          <span className="font-bold text-[#111111] text-xs">
            {formatPrice(filters.priceRange[1])}
          </span>
        </div>
        <input
          type="range"
          min="500"
          max="20000"
          step="250"
          value={filters.priceRange[1]}
          onChange={(e) => onFilterChange({ priceRange: [filters.priceRange[0], Number(e.target.value)] })}
          className="w-full accent-[#111111] cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-[#6B7280]">
          <span>{formatPrice(500)}</span>
          <span>{formatPrice(20000)}</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar Filter */}
      <aside className="hidden lg:block w-64 shrink-0 bg-white p-5 border border-[#E5E7EB] rounded-3xl shadow-xs sticky top-28 self-start">
        {content}
      </aside>

      {/* Mobile Drawer Filter */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" onClick={onClose} />
          <div className="relative ml-auto w-full max-w-xs bg-white h-full shadow-2xl p-6 overflow-y-auto z-10 animate-slideLeft">
            <div className="flex justify-end pb-2">
              <button
                onClick={onClose}
                className="p-1.5 rounded-full bg-[#FFFFFF] text-[#1A1A1A] hover:bg-[#E5E7EB] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {content}
            <div className="mt-8 pt-4 border-t border-[#E5E7EB]">
              <button
                onClick={onClose}
                className="w-full py-3 bg-[#111111] text-[#FFFFFF] font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[#C5A15A] hover:text-[#000000] transition-all cursor-pointer shadow-sm"
              >
                View {totalResults} Garments
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
