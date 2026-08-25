import React, { useState, useMemo } from 'react';
import { ArrowRight, Sparkles, Compass } from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import { INITIAL_CATEGORIES } from '../../data/categories';
import type { CategoryItem, ProductCategory } from '../../types';
import { getOptimizedImageUrl, handleImageError } from '../../utils/imageOptimizer';

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
    // Navigate to shop with the category's parentCategory or slug
    if (cat.parentCategory) {
      onNavigate('shop', cat.parentCategory, cat.slug);
    } else {
      onNavigate('shop', cat.slug);
    }
  };

  return (
    <section className="py-16 sm:py-20 bg-[#FAF8F1] border-b border-[#E8DDC7] relative overflow-hidden">
      
      {/* Subtle Background Ornament */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#12372A]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-12">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-[#D4AF37]/15 border border-[#D4AF37]/40 px-3 py-1 text-[10px] sm:text-xs uppercase font-bold text-[#12372A] tracking-[0.2em] rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Atelier Directory</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#12372A]">
              Shop by Category
            </h2>
            <p className="text-xs sm:text-sm text-[#6B5846] max-w-xl leading-relaxed font-light">
              Explore authentic GI-tagged Kuthampully handlooms, fine gold zari weaves, and European linen tailored for Kerala luxury.
            </p>
          </div>

          {/* Department Filter Pills */}
          <div className="mt-6 md:mt-0 flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedDept('all')}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all border ${
                selectedDept === 'all'
                  ? 'bg-[#12372A] text-[#FAF8F1] border-[#12372A] shadow-sm'
                  : 'bg-white text-[#6B5846] border-[#E8DDC7] hover:border-[#D4AF37] hover:text-[#12372A]'
              }`}
            >
              All Categories ({activeCategories.length})
            </button>
            <button
              onClick={() => setSelectedDept('women')}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all border ${
                selectedDept === 'women'
                  ? 'bg-[#12372A] text-[#FAF8F1] border-[#12372A] shadow-sm'
                  : 'bg-white text-[#6B5846] border-[#E8DDC7] hover:border-[#D4AF37] hover:text-[#12372A]'
              }`}
            >
              Women
            </button>
            <button
              onClick={() => setSelectedDept('men')}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all border ${
                selectedDept === 'men'
                  ? 'bg-[#12372A] text-[#FAF8F1] border-[#12372A] shadow-sm'
                  : 'bg-white text-[#6B5846] border-[#E8DDC7] hover:border-[#D4AF37] hover:text-[#12372A]'
              }`}
            >
              Men
            </button>
            <button
              onClick={() => setSelectedDept('kids')}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all border ${
                selectedDept === 'kids'
                  ? 'bg-[#12372A] text-[#FAF8F1] border-[#12372A] shadow-sm'
                  : 'bg-white text-[#6B5846] border-[#E8DDC7] hover:border-[#D4AF37] hover:text-[#12372A]'
              }`}
            >
              Kids
            </button>
          </div>
        </div>

        {/* Category Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {displayedCategories.map((cat, idx) => {
            const count = getProductCountForCat(cat);
            const optimizedImg = getOptimizedImageUrl(cat.image, { width: 600, quality: 75 });
            return (
              <div
                key={cat.id}
                onClick={() => handleCategoryClick(cat)}
                className="group cursor-pointer bg-white border border-[#E8DDC7] hover:border-[#D4AF37] rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col justify-between transform hover:-translate-y-1"
              >
                {/* Visual Category Imagery */}
                <div className="relative h-64 sm:h-72 overflow-hidden bg-[#FAF8F1]">
                  <img
                    src={optimizedImg}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                    loading="lazy"
                    decoding="async"
                    onError={handleImageError}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#12372A]/90 via-[#12372A]/30 to-transparent" />

                  {/* Department & Count Badges */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                    <span className="bg-[#12372A]/90 backdrop-blur-md text-[#D4AF37] border border-[#D4AF37]/50 text-[10px] font-bold uppercase tracking-[0.15em] px-3 py-1 rounded-full shadow-sm">
                      {cat.parentCategory.toUpperCase()}
                    </span>

                    <span className="bg-white/90 backdrop-blur-md text-[#12372A] text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                      {count} Garments
                    </span>
                  </div>

                  {/* Title Overlay in Image Bottom */}
                  <div className="absolute bottom-4 left-4 right-4 text-[#FAF8F1]">
                    <h3 className="font-serif text-xl sm:text-2xl font-bold leading-snug group-hover:text-[#D4AF37] transition-colors">
                      {cat.name}
                    </h3>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                  <p className="text-xs text-[#6B5846] leading-relaxed line-clamp-2 font-light">
                    {cat.description || 'Authentic Kuthampully handloom craft, fine textures and pure organic weaves.'}
                  </p>

                  <div className="pt-2 border-t border-[#E8DDC7]/60 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#12372A] group-hover:text-[#D4AF37] transition-colors flex items-center gap-1.5">
                      <span>Explore Category</span>
                      <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                    </span>

                    <span className="text-[11px] text-[#6B5846] font-mono">
                      0{idx + 1}
                    </span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* Bottom Explorer CTA */}
        <div className="mt-12 text-center">
          <button
            onClick={() => onNavigate('shop')}
            className="inline-flex items-center gap-3 bg-[#12372A] text-[#FAF8F1] hover:bg-[#D4AF37] hover:text-[#12372A] px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] rounded-xl transition-all shadow-md border border-[#D4AF37]"
          >
            <Compass className="w-4 h-4 text-[#D4AF37] group-hover:text-[#12372A]" />
            <span>View All Handloom Catalog ({products.length} Items)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
