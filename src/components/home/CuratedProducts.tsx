'use client';

import React, { useState, useMemo } from 'react';
import { ProductCard } from '../product/ProductCard';
import { useProducts } from '../../context/ProductContext';
import type { Product, ProductCategory } from '../../types';
import { ArrowRight, Sparkles, Flame, Clock, Award } from 'lucide-react';

interface CuratedProductsProps {
  onSelectProduct: (product: Product) => void;
  onNavigate: (view: string, categoryFilter?: string, collectionFilter?: string) => void;
}

type CurationMode = 'best-sellers' | 'new-arrivals' | 'featured' | 'festive';

export const CuratedProducts: React.FC<CuratedProductsProps> = ({ onSelectProduct, onNavigate }) => {
  const { products } = useProducts();
  const [activeDept, setActiveDept] = useState<'all' | ProductCategory>('all');
  const [curationMode, setCurationMode] = useState<CurationMode>('best-sellers');

  const filtered = useMemo(() => {
    let list = [...products];

    // 1. Department filter
    if (activeDept !== 'all') {
      list = list.filter(p => p.category === activeDept);
    }

    // 2. Curation filter
    if (curationMode === 'best-sellers') {
      const best = list.filter(p => p.isBestSeller || p.rating >= 4.9);
      return best.length >= 4 ? best.slice(0, 8) : list.slice(0, 8);
    } else if (curationMode === 'new-arrivals') {
      const newItems = list.filter(p => p.isNew);
      return newItems.length >= 4 ? newItems.slice(0, 8) : list.slice(0, 8);
    } else if (curationMode === 'featured') {
      const featured = list.filter(p => p.isFeatured);
      return featured.length >= 4 ? featured.slice(0, 8) : list.slice(0, 8);
    } else if (curationMode === 'festive') {
      const festive = list.filter(p => 
        p.collection?.includes('festive') || 
        p.collection?.includes('kasavu') || 
        (p.tags && p.tags.some(t => t.toLowerCase().includes('festive') || t.toLowerCase().includes('onam') || t.toLowerCase().includes('zari')))
      );
      return festive.length >= 4 ? festive.slice(0, 8) : list.slice(0, 8);
    }

    return list.slice(0, 8);
  }, [products, activeDept, curationMode]);

  return (
    <section className="py-20 bg-[#F8F5EF] border-b border-[#E8DFD0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#B99A61]/15 border border-[#B99A61]/40 px-3 py-1 rounded-full text-[10px] sm:text-xs uppercase font-bold text-[#641E2B] tracking-[0.2em] mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#B99A61]" />
              <span>Atelier Handloom Showcase</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#641E2B]">
              Best-Sellers &amp; New Arrivals
            </h2>
            <p className="text-xs sm:text-sm text-[#292522]/70 font-light mt-1 max-w-xl">
              From ceremonial pure gold zari Kasavu sarees to tailored European linen Kerala shirts, discover Kerala's most coveted handloom creations.
            </p>
          </div>

          {/* Department Pills */}
          <div className="flex flex-wrap gap-2 mt-6 md:mt-0 font-sans text-xs uppercase tracking-wider font-semibold">
            {(['all', 'women', 'men', 'kids'] as const).map(dept => (
              <button
                key={dept}
                onClick={() => setActiveDept(dept)}
                className={`px-4 py-2 border rounded-full transition-all cursor-pointer ${
                  activeDept === dept
                    ? 'bg-[#641E2B] text-[#F8F5EF] border-[#641E2B] shadow-sm font-bold'
                    : 'bg-white text-[#292522] border-[#E8DFD0] hover:border-[#B99A61]'
                }`}
              >
                {dept === 'all' ? 'All Weaves' : dept}
              </button>
            ))}
          </div>
        </div>

        {/* Curation Mode Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 border-b border-[#E8DFD0]/60 text-xs">
          <button
            onClick={() => setCurationMode('best-sellers')}
            className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              curationMode === 'best-sellers'
                ? 'bg-[#641E2B] text-[#F8F5EF] shadow-sm'
                : 'bg-white text-[#292522] hover:bg-white border border-[#E8DFD0]'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-[#B99A61]" />
            <span>Best-Selling Masterpieces</span>
          </button>

          <button
            onClick={() => setCurationMode('new-arrivals')}
            className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              curationMode === 'new-arrivals'
                ? 'bg-[#641E2B] text-[#F8F5EF] shadow-sm'
                : 'bg-white text-[#292522] hover:bg-white border border-[#E8DFD0]'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-[#B99A61]" />
            <span>New Loom Arrivals</span>
          </button>

          <button
            onClick={() => setCurationMode('featured')}
            className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              curationMode === 'featured'
                ? 'bg-[#641E2B] text-[#F8F5EF] shadow-sm'
                : 'bg-white text-[#292522] hover:bg-white border border-[#E8DFD0]'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-[#B99A61]" />
            <span>Signature Heirlooms</span>
          </button>

          <button
            onClick={() => setCurationMode('festive')}
            className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              curationMode === 'festive'
                ? 'bg-[#641E2B] text-[#F8F5EF] shadow-sm'
                : 'bg-white text-[#292522] hover:bg-white border border-[#E8DFD0]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#B99A61]" />
            <span>Festive &amp; Bridal Edit</span>
          </button>
        </div>

        {/* Product Grid */}
        {filtered.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-3xl border border-[#E8DFD0]">
            <p className="font-serif text-xl text-[#641E2B]">No garments currently matching this curation</p>
            <p className="text-xs text-[#6E685D] mt-1">Please explore our other atelier collections.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {filtered.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={onSelectProduct}
              />
            ))}
          </div>
        )}

        {/* View All CTA */}
        <div className="mt-12 text-center">
          <button
            onClick={() => onNavigate('shop')}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white border border-[#B99A61] text-[#641E2B] hover:bg-[#641E2B] hover:text-[#F8F5EF] font-bold text-xs uppercase tracking-widest transition-all shadow-sm cursor-pointer"
          >
            <span>Explore Complete Atelier Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
