'use client';

import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import { OptimizedImage } from '../common/OptimizedImage';

interface FeaturedCollectionsProps {
  onNavigate: (view: string, categoryFilter?: string, collectionFilter?: string) => void;
}

export const FeaturedCollections: React.FC<FeaturedCollectionsProps> = ({ onNavigate }) => {
  const { collections } = useProducts();

  return (
    <section className="py-20 bg-[#FAF8F1] border-b border-[#E8DDC7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-[#D4AF37] font-bold block mb-1">
              Curated Edits
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#12372A]">
              Featured Collections
            </h2>
          </div>
          <p className="text-xs text-[#6B5846] max-w-md mt-4 md:mt-0 leading-relaxed font-light">
            Each collection is thoughtfully designed to preserve centuries of Kerala weaving artistry while providing contemporary fits for global occasions.
          </p>
        </div>

        {/* Collection Grid */}
        {collections.length === 0 ? (
          <div className="bg-white border border-[#E8DDC7] rounded-3xl p-10 text-center space-y-3 shadow-xs">
            <h3 className="font-serif text-xl font-bold text-[#12372A]">No Featured Collections Currently Published</h3>
            <p className="text-xs text-[#6B5846]">Collections added and published from the Admin Panel will dynamically render here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {collections.map((col, idx) => (
              <div
                key={col.id}
                onClick={() => onNavigate('shop', undefined, col.slug)}
                className={`group cursor-pointer bg-white border border-[#E8DDC7] hover:border-[#D4AF37] rounded-3xl transition-all duration-500 overflow-hidden relative shadow-md hover:shadow-2xl transform hover:-translate-y-1.5 ${
                  idx === 0 ? 'md:col-span-2 lg:col-span-2' : ''
                }`}
              >
                {/* Card Image */}
                <div className="aspect-[16/10] md:aspect-auto h-80 lg:h-96 overflow-hidden relative rounded-3xl bg-[#0B241B]">
                  <OptimizedImage
                    src={col.image}
                    alt={`${col.title} - Kavish Collection`}
                    preset={idx === 0 ? 'banner' : 'card'}
                    containerClassName="w-full h-full rounded-3xl"
                    imageClassName="transition-transform duration-700 ease-out group-hover:scale-106"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#12372A]/90 via-[#12372A]/35 to-transparent z-10" />
                </div>

                {/* Card Content Overlay */}
                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 text-[#FAF8F1] flex flex-col justify-end">
                  <div className="flex items-center justify-between mb-2">
                    <span className="bg-[#D4AF37] text-[#12372A] text-[9px] uppercase tracking-widest font-bold px-3 py-1 rounded-full shadow-sm">
                      {col.tag || 'Handloom'}
                    </span>
                    <span className="text-[11px] text-[#E8DDC7] font-medium bg-black/40 px-2.5 py-0.5 rounded-full border border-white/20">
                      {col.itemCount || 0} Garments
                    </span>
                  </div>

                  <h3 className="font-serif text-2xl sm:text-3xl font-bold group-hover:text-[#D4AF37] transition-colors flex items-center justify-between">
                    <span>{col.title}</span>
                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:bg-[#D4AF37] group-hover:text-[#12372A] transition-all">
                      <ArrowUpRight className="w-5 h-5 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                  </h3>

                  <p className="text-xs text-[#E8DDC7]/90 mt-2 line-clamp-2 max-w-lg font-light">
                    {col.description}
                  </p>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
