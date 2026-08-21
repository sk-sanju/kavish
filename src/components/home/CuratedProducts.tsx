import React, { useState } from 'react';
import { ProductCard } from '../product/ProductCard';
import { useProducts } from '../../context/ProductContext';
import type { Product } from '../../types';
import { ArrowRight } from 'lucide-react';

interface CuratedProductsProps {
  onSelectProduct: (product: Product) => void;
  onNavigate: (view: string, categoryFilter?: string) => void;
}

export const CuratedProducts: React.FC<CuratedProductsProps> = ({ onSelectProduct, onNavigate }) => {
  const { products } = useProducts();
  const [activeTab, setActiveTab] = useState<'all' | 'women' | 'men' | 'kids'>('all');

  const filtered = activeTab === 'all'
    ? products.slice(0, 8)
    : products.filter(p => p.category === activeTab).slice(0, 8);

  return (
    <section className="py-20 bg-[#FAF8F1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-[#D4AF37] font-bold block mb-1">
              Atelier Selection
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#12372A]">
              Curated for You
            </h2>
          </div>

          <div className="flex flex-wrap gap-2 mt-6 md:mt-0 font-sans text-xs uppercase tracking-wider font-semibold">
            {(['all', 'women', 'men', 'kids'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2.5 border rounded-full transition-all ${
                  activeTab === tab
                    ? 'bg-[#12372A] text-[#FAF8F1] border-[#12372A] shadow-md'
                    : 'bg-white text-[#171717] border-[#E8DDC7] hover:border-[#D4AF37]'
                }`}
              >
                {tab === 'all' ? 'All Masterpieces' : tab}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="bg-white border border-[#E8DDC7] rounded-3xl p-10 text-center space-y-3 shadow-xs">
            <h3 className="font-serif text-xl font-bold text-[#12372A]">No Garments Currently Published</h3>
            <p className="text-xs text-[#6B5846]">Products added in the Admin Panel will automatically render here dynamically in real time.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onSelectProduct={onSelectProduct}
              />
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <button
            onClick={() => onNavigate('shop', activeTab === 'all' ? undefined : activeTab)}
            className="inline-flex items-center gap-3 bg-[#12372A] text-[#FAF8F1] hover:bg-[#D4AF37] hover:text-[#12372A] px-10 py-4 text-xs font-bold uppercase tracking-[0.2em] transition-all border border-[#D4AF37] rounded-full shadow-lg"
          >
            <span>Explore Complete Store ({products.length} Items)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
