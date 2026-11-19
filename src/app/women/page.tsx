'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Filter, SlidersHorizontal } from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import { ProductCard } from '../../components/product/ProductCard';
import type { Product } from '../../types';

export default function WomenCollectionPage() {
  const router = useRouter();
  const { products } = useProducts();
  const [activeSubcategory, setActiveSubcategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'recommended' | 'price-low' | 'price-high'>('recommended');

  const womenProducts = useMemo(() => {
    let items = products.filter(p => p.category === 'women');

    if (activeSubcategory !== 'all') {
      items = items.filter(p => 
        p.subcategory.toLowerCase().includes(activeSubcategory.toLowerCase()) ||
        (p.collection && p.collection.toLowerCase().includes(activeSubcategory.toLowerCase()))
      );
    }

    if (sortBy === 'price-low') {
      items = [...items].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      items = [...items].sort((a, b) => b.price - a.price);
    }

    return items;
  }, [products, activeSubcategory, sortBy]);

  const subcategories = [
    { id: 'all', label: 'All Women Weaves' },
    { id: 'kasavu', label: 'Kasavu Sarees' },
    { id: 'tissue', label: 'Tissue Sarees' },
    { id: 'set mundu', label: 'Traditional Set Mundu' },
    { id: 'cotton', label: 'Kerala Cotton Sarees' },
  ];

  return (
    <div className="min-h-screen bg-[#FFFFFF] pb-24 animate-fadeIn">
      {/* Editorial Header Banner */}
      <div className="relative bg-[#000000] text-[#FFFFFF] py-16 sm:py-24 border-b border-[#C5A15A]/30 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#000000] via-[#111111]/80 to-transparent z-10" />
        <img
          src="/assets/categories/women_kasavu.jpg"
          alt="Women Kerala Kasavu Collection"
          className="absolute inset-0 w-full h-full object-cover opacity-35"
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
          <div className="inline-flex items-center gap-2 bg-[#C5A15A]/20 border border-[#C5A15A]/50 px-3 py-1 rounded-full text-[10px] sm:text-xs uppercase font-bold text-[#C5A15A] tracking-[0.2em] mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Kuthampully Atelier Edit</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
            Women's Kasavu &amp; Saree Collection
          </h1>
          <p className="text-xs sm:text-sm text-[#FFFFFF]/85 mt-3 max-w-2xl leading-relaxed font-light">
            Woven on traditional pit-looms with 24k electroplated gold zari, our Kasavu sarees and set mundus honor 500 years of royal Devanga weaving artistry from Kuthampully, Kerala.
          </p>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E5E7EB] pb-6">
          {/* Subcategory Pills */}
          <div className="flex flex-wrap gap-2 text-xs">
            {subcategories.map(sub => (
              <button
                key={sub.id}
                onClick={() => setActiveSubcategory(sub.id)}
                className={`px-4 py-2 rounded-full font-bold transition-all cursor-pointer ${
                  activeSubcategory === sub.id
                    ? 'bg-[#111111] text-[#FFFFFF] shadow-sm'
                    : 'bg-white text-[#1A1A1A] border border-[#E5E7EB] hover:border-[#C5A15A]'
                }`}
              >
                {sub.label}
              </button>
            ))}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#6B7280] font-medium flex items-center gap-1">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#C5A15A]" /> Sort:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white border border-[#E5E7EB] rounded-xl px-3 py-1.5 text-xs text-[#1A1A1A] font-semibold focus:outline-none focus:border-[#C5A15A]"
            >
              <option value="recommended">Curated / Recommended</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
            <span className="text-[#6B7280] text-xs ml-2">
              ({womenProducts.length} {womenProducts.length === 1 ? 'Garment' : 'Garments'})
            </span>
          </div>
        </div>

        {/* Products Grid */}
        {womenProducts.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-3xl border border-[#E5E7EB] mt-8">
            <p className="font-serif text-2xl text-[#111111]">No garments currently in this filter</p>
            <p className="text-xs text-[#6B7280] mt-2">Try selecting "All Women Weaves" to explore our full atelier collection.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mt-8">
            {womenProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={(p) => router.push(`/product/${p.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
