'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, SlidersHorizontal } from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import { ProductCard } from '../../components/product/ProductCard';

export default function MenCollectionPage() {
  const router = useRouter();
  const { products } = useProducts();
  const [activeSubcategory, setActiveSubcategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'recommended' | 'price-low' | 'price-high'>('recommended');

  const menProducts = useMemo(() => {
    let items = products.filter(p => p.category === 'men');

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
    { id: 'all', label: 'All Men Apparel' },
    { id: 'mundu', label: 'Traditional Double Mundu' },
    { id: 'linen', label: 'European Flax Linen Shirts' },
    { id: 'kerala', label: 'Kerala Festive Shirts' },
  ];

  return (
    <div className="min-h-screen bg-[#F8F5EF] pb-24 animate-fadeIn">
      {/* Editorial Header Banner */}
      <div className="relative bg-[#46141D] text-[#F8F5EF] py-16 sm:py-24 border-b border-[#B99A61]/30 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#46141D] via-[#641E2B]/80 to-transparent z-10" />
        <img
          src="/assets/banners/hero_men.jpg"
          alt="Men Kerala Mundu & Linen Collection"
          className="absolute inset-0 w-full h-full object-cover opacity-35"
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
          <div className="inline-flex items-center gap-2 bg-[#B99A61]/20 border border-[#B99A61]/50 px-3 py-1 rounded-full text-[10px] sm:text-xs uppercase font-bold text-[#B99A61] tracking-[0.2em] mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ceremonial &amp; Casual Luxury</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
            Men's Double Mundu &amp; Linen Shirts
          </h1>
          <p className="text-xs sm:text-sm text-[#F8F5EF]/85 mt-3 max-w-2xl leading-relaxed font-light">
            Timeless ceremonial double mundus with gold kasavu borders paired with tailored 100% organic European flax linen shirts for effortless Kerala sophistication.
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
              ({menProducts.length} {menProducts.length === 1 ? 'Garment' : 'Garments'})
            </span>
          </div>
        </div>

        {/* Products Grid */}
        {menProducts.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-3xl border border-[#E8DFD0] mt-8">
            <p className="font-serif text-2xl text-[#641E2B]">Men's garments currently updating</p>
            <p className="text-xs text-[#6E685D] mt-2">New loom runs for ceremonial double mundus and shirts are arriving shortly.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mt-8">
            {menProducts.map(product => (
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
