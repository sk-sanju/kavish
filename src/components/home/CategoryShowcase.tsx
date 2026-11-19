'use client';

import React, { useState, useMemo } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import { INITIAL_CATEGORIES } from '../../data/categories';
import type { CategoryItem, ProductCategory } from '../../types';
import { OptimizedImage } from '../common/OptimizedImage';

interface CategoryShowcaseProps {
  onNavigate: (view: string, categoryFilter?: string, collectionFilter?: string) => void;
}

export const CategoryShowcase: React.FC<CategoryShowcaseProps> = ({ onNavigate }) => {
  const { categories, products } = useProducts();
  const [selectedDept, setSelectedDept] = useState<'all' | ProductCategory>('all');

  const activeCategories: CategoryItem[] = useMemo(() => {
    const list = (categories && categories.length > 0) ? categories : INITIAL_CATEGORIES;
    return list.filter(c => c.status !== 'Disabled');
  }, [categories]);

  const displayedCategories = useMemo(() => {
    if (selectedDept === 'all') return activeCategories;
    return activeCategories.filter(c => c.parentCategory === selectedDept);
  }, [activeCategories, selectedDept]);

  // Compute live product counts dynamically
  const getProductCountForCat = (cat: CategoryItem): number => {
    if (typeof cat.productCount === 'number' && cat.productCount > 0) {
      return cat.productCount;
    }
    const catSlug = (cat.slug || '').toLowerCase();
    const catName = (cat.name || '').toLowerCase();
    const matched = products.filter(p => {
      const pCat = (p.category || '').toLowerCase();
      const pSub = (p.subcategory || '').toLowerCase();
      return (
        pCat === cat.parentCategory.toLowerCase() ||
        pSub.includes(catSlug) ||
        pSub.includes(catName)
      );
    });
    return matched.length > 0 ? matched.length : 6;
  };

  const handleCategoryClick = (cat: CategoryItem) => {
    if (cat.parentCategory) {
      onNavigate('shop', cat.parentCategory, cat.slug);
    } else {
      onNavigate('shop', cat.slug);
    }
  };

  return (
    <section className="py-16 sm:py-20 bg-[#F8F5EF] border-b border-[#E8DFD0] relative overflow-hidden">
      
      {/* Subtle Background Ornament */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#B99A61]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#641E2B]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-12">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-[#B99A61]/15 border border-[#B99A61]/40 px-3 py-1 text-[10px] sm:text-xs uppercase font-bold text-[#641E2B] tracking-[0.2em] rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-[#B99A61]" />
              <span>Atelier Directory</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#641E2B]">
              Shop by Category
            </h2>
            <p className="text-xs sm:text-sm text-[#292522]/70 max-w-xl leading-relaxed font-light">
              Explore authentic GI-tagged Kuthampully handlooms, fine gold zari weaves, and European linen tailored for Kerala luxury.
            </p>
          </div>

          {/* Department Filter Pills */}
          <div className="mt-6 md:mt-0 flex flex-wrap gap-2 font-sans text-xs uppercase tracking-wider font-semibold">
            <button
              onClick={() => setSelectedDept('all')}
              className={`px-4 py-2 rounded-full transition-all border cursor-pointer ${
                selectedDept === 'all'
                  ? 'bg-[#641E2B] text-[#F8F5EF] border-[#641E2B] shadow-sm font-bold'
                  : 'bg-white text-[#292522] border-[#E8DFD0] hover:border-[#B99A61]'
              }`}
            >
              All ({activeCategories.length})
            </button>
            <button
              onClick={() => setSelectedDept('women')}
              className={`px-4 py-2 rounded-full transition-all border cursor-pointer ${
                selectedDept === 'women'
                  ? 'bg-[#641E2B] text-[#F8F5EF] border-[#641E2B] shadow-sm font-bold'
                  : 'bg-white text-[#292522] border-[#E8DFD0] hover:border-[#B99A61]'
              }`}
            >
              Women
            </button>
            <button
              onClick={() => setSelectedDept('men')}
              className={`px-4 py-2 rounded-full transition-all border cursor-pointer ${
                selectedDept === 'men'
                  ? 'bg-[#641E2B] text-[#F8F5EF] border-[#641E2B] shadow-sm font-bold'
                  : 'bg-white text-[#292522] border-[#E8DFD0] hover:border-[#B99A61]'
              }`}
            >
              Men
            </button>
            <button
              onClick={() => setSelectedDept('kids')}
              className={`px-4 py-2 rounded-full transition-all border cursor-pointer ${
                selectedDept === 'kids'
                  ? 'bg-[#641E2B] text-[#F8F5EF] border-[#641E2B] shadow-sm font-bold'
                  : 'bg-white text-[#292522] border-[#E8DFD0] hover:border-[#B99A61]'
              }`}
            >
              Kids
            </button>
          </div>
        </div>

        {/* Category Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {displayedCategories.map((cat) => {
            const count = getProductCountForCat(cat);
            return (
              <div
                key={cat.id}
                onClick={() => handleCategoryClick(cat)}
                className="group luxury-card relative bg-white border border-[#E8DFD0] hover:border-[#B99A61] overflow-hidden cursor-pointer shadow-xs"
              >
                <div className="aspect-[4/3] sm:aspect-[16/11] relative overflow-hidden bg-[#F8F5EF]">
                  <OptimizedImage
                    src={cat.image || '/assets/categories/women_kasavu.jpg'}
                    alt={cat.name}
                    preset="card"
                    containerClassName="w-full h-full"
                    imageClassName="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  
                  <div className="absolute top-4 left-4">
                    <span className="bg-[#641E2B]/90 backdrop-blur-md text-[#F8F5EF] text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full border border-[#B99A61]/40">
                      {cat.parentCategory}
                    </span>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="font-serif text-2xl font-bold leading-tight group-hover:text-[#B99A61] transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-white/80 line-clamp-1 mt-1 font-light">
                      {cat.description || 'Authentic Kuthampully handwoven creation.'}
                    </p>
                  </div>
                </div>

                <div className="p-4 flex items-center justify-between text-xs border-t border-[#E8DFD0]/60 bg-white">
                  <span className="text-[#6E685D] font-medium">
                    {count} {count === 1 ? 'Garment' : 'Garments'}
                  </span>
                  <div className="flex items-center gap-1 text-[#641E2B] font-bold uppercase tracking-wider group-hover:translate-x-1 transition-transform">
                    <span>Explore</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
