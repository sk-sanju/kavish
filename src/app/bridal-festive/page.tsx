'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, SlidersHorizontal, Award } from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import { ProductCard } from '../../components/product/ProductCard';

export default function BridalFestivePage() {
  const router = useRouter();
  const { products } = useProducts();
  const [sortBy, setSortBy] = useState<'recommended' | 'price-low' | 'price-high'>('recommended');

  const festiveProducts = useMemo(() => {
    let items = products.filter(p => 
      p.collection?.includes('festive') ||
      p.collection?.includes('kasavu') ||
      p.name.toLowerCase().includes('tissue') ||
      p.name.toLowerCase().includes('royal') ||
      (p.tags && p.tags.some(t => t.toLowerCase().includes('festive') || t.toLowerCase().includes('zari')))
    );

    if (items.length === 0) {
      items = products.slice(0, 8);
    }

    if (sortBy === 'price-low') {
      items = [...items].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      items = [...items].sort((a, b) => b.price - a.price);
    }

    return items;
  }, [products, sortBy]);

  return (
    <div className="min-h-screen bg-[#FFFFFF] pb-24 animate-fadeIn">
      {/* Editorial Header Banner */}
      <div className="relative bg-[#000000] text-[#FFFFFF] py-16 sm:py-24 border-b border-[#C5A15A]/30 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#000000] via-[#111111]/85 to-transparent z-10" />
        <img
          src="/assets/categories/bridal_festive.jpg"
          alt="Kerala Bridal and Festive Kasavu"
          className="absolute inset-0 w-full h-full object-cover opacity-35"
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
          <div className="inline-flex items-center gap-2 bg-[#C5A15A]/20 border border-[#C5A15A]/50 px-3 py-1 rounded-full text-[10px] sm:text-xs uppercase font-bold text-[#C5A15A] tracking-[0.2em] mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A15A]" />
            <span>Royal Kochi Court Heirloom Edits</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
            Bridal &amp; Festive Heritage Collection
          </h1>
          <p className="text-xs sm:text-sm text-[#FFFFFF]/85 mt-3 max-w-2xl leading-relaxed font-light">
            Exquisite wedding Kasavu sarees woven with electroplated 24k gold zari, temple border motifs, and shimmering tissue weaves designed for unforgettable weddings, Onam, and sacred celebrations.
          </p>
        </div>
      </div>

      {/* Control Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E7EB] pb-6">
          <div className="flex items-center gap-2 text-xs text-[#111111] font-bold uppercase tracking-wider">
            <Award className="w-4 h-4 text-[#C5A15A]" />
            <span>Authentic Kuthampully Handlooms ({festiveProducts.length} Pieces)</span>
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
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mt-8">
          {festiveProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={(p) => router.push(`/product/${p.id}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
