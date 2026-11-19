'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, SlidersHorizontal } from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import { ProductCard } from '../../components/product/ProductCard';

export default function KidsCollectionPage() {
  const router = useRouter();
  const { products } = useProducts();
  const [activeSubcategory, setActiveSubcategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'recommended' | 'price-low' | 'price-high'>('recommended');

  const kidsProducts = useMemo(() => {
    let items = products.filter(p => p.category === 'kids');

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
    { id: 'all', label: 'All Kids Ethnic Wear' },
    { id: 'pattu pavada', label: 'Pattu Pavada' },
    { id: 'festive', label: 'Kids Festive Sets' },
  ];

  return (
    <div className="min-h-screen bg-[#F8F5EF] pb-24 animate-fadeIn">
      {/* Editorial Header Banner */}
      <div className="relative bg-[#46141D] text-[#F8F5EF] py-16 sm:py-24 border-b border-[#B99A61]/30 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#46141D] via-[#641E2B]/80 to-transparent z-10" />
        <img
          src="/assets/categories/kids_ethnic.jpg"
          alt="Kids Kerala Pattu Pavada Collection"
          className="absolute inset-0 w-full h-full object-cover opacity-35"
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
          <div className="inline-flex items-center gap-2 bg-[#B99A61]/20 border border-[#B99A61]/50 px-3 py-1 rounded-full text-[10px] sm:text-xs uppercase font-bold text-[#B99A61] tracking-[0.2em] mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Little Heirlooms Edit</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
            Kids Ethnic Wear &amp; Pattu Pavada
          </h1>
          <p className="text-xs sm:text-sm text-[#F8F5EF]/85 mt-3 max-w-2xl leading-relaxed font-light">
            Enchanting traditional Pattu Pavada sets and ethnic shirts crafted from soft, hypoallergenic handloom cotton and gold zari for festive memories that last a lifetime.
          </p>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E8DFD0] pb-6">
          {/* Subcategory Pills */}
          <div className="flex flex-wrap gap-2 text-xs">
            {subcategories.map(sub => (
              <button
                key={sub.id}
                onClick={() => setActiveSubcategory(sub.id)}
                className={`px-4 py-2 rounded-full font-bold transition-all cursor-pointer ${
                  activeSubcategory === sub.id
                    ? 'bg-[#641E2B] text-[#F8F5EF] shadow-sm'
                    : 'bg-white text-[#292522] border border-[#E8DFD0] hover:border-[#B99A61]'
                }`}
              >
                {sub.label}
              </button>
            ))}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#6E685D] font-medium flex items-center gap-1">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#B99A61]" /> Sort:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white border border-[#E8DFD0] rounded-xl px-3 py-1.5 text-xs text-[#292522] font-semibold focus:outline-none focus:border-[#B99A61]"
            >
              <option value="recommended">Curated / Recommended</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
            <span className="text-[#6E685D] text-xs ml-2">
              ({kidsProducts.length} {kidsProducts.length === 1 ? 'Garment' : 'Garments'})
            </span>
          </div>
        </div>

        {/* Products Grid */}
        {kidsProducts.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-3xl border border-[#E8DFD0] mt-8">
            <p className="font-serif text-2xl text-[#641E2B]">Kids ethnic wear currently updating</p>
            <p className="text-xs text-[#6E685D] mt-2">New festive Pattu Pavada creations are being prepared for the upcoming season.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mt-8">
            {kidsProducts.map(product => (
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
