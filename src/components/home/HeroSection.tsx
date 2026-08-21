import React, { useState } from 'react';
import { ArrowRight, Sparkles, Compass } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

interface HeroSectionProps {
  onNavigate: (view: string, categoryFilter?: string, collectionFilter?: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate }) => {
  const { storeContent } = useAdmin();
  const [activeIdx, setActiveIdx] = useState(0);

  const CAMPAIGNS = [
    {
      id: 'main',
      tag: 'Atelier Signature Edit',
      title: storeContent?.heroTitle || 'Rooted in Kerala.\nMade for Today.',
      subtitle: storeContent?.heroSubtitle || 'Discover timeless Kasavu textiles crafted with centuries of handloom heritage, refined gold zari, and contemporary sensibility.',
      image: storeContent?.bannerImage || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1800&q=90',
      collection: 'kasavu-masterpieces'
    },
    {
      id: 'festive',
      tag: 'Festive Campaign',
      title: 'The Royal Kasavu\nGold Zari Legacy.',
      subtitle: 'Woven with 24k electroplated gold threads in Chendamangalam for grand celebrations and heirloom memories.',
      image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1800&q=90',
      collection: 'festive-edit'
    }
  ];

  const current = CAMPAIGNS[activeIdx] || CAMPAIGNS[0];

  return (
    <section className="relative bg-[#12372A] text-[#FAF8F1] min-h-[75vh] sm:min-h-[85vh] flex items-center overflow-hidden">
      
      {/* Background Image with Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={current.image}
          alt="Kavish Kerala Luxury Fashion Campaign"
          className="w-full h-full object-cover opacity-40 sm:opacity-45 transform scale-105 transition-all duration-1000 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#12372A] via-[#12372A]/85 sm:via-[#12372A]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#12372A] via-transparent to-transparent" />
      </div>

      {/* Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 relative z-10 w-full">
        <div className="max-w-2xl space-y-4 sm:space-y-6">
          
          {/* Campaign Tag */}
          <div className="inline-flex items-center gap-2 bg-[#D4AF37]/20 border border-[#D4AF37]/60 px-3 py-1 text-[10px] sm:text-xs uppercase font-semibold text-[#D4AF37] tracking-[0.2em]">
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 animate-pulse" />
            <span>{current.tag}</span>
          </div>

          {/* Headline */}
          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] text-[#FAF8F1] whitespace-pre-line tracking-tight">
            {current.title}
          </h1>

          {/* Subtitle */}
          <p className="font-sans text-xs sm:text-sm md:text-base text-[#E8DDC7]/90 leading-relaxed max-w-xl font-light">
            {current.subtitle}
          </p>

          {/* CTA Buttons */}
          <div className="pt-2 sm:pt-4 flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center">
            <button
              onClick={() => onNavigate('shop', undefined, current.collection)}
              className="bg-[#D4AF37] text-[#12372A] hover:bg-[#FAF8F1] hover:text-[#12372A] px-6 sm:px-8 py-3.5 sm:py-4 text-xs font-bold uppercase tracking-[0.2em] transition-all shadow-xl flex items-center justify-center gap-3 border border-[#D4AF37]"
            >
              <span>Shop Collection</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('heritage')}
              className="bg-transparent text-[#FAF8F1] border border-[#FAF8F1]/40 hover:border-[#D4AF37] hover:text-[#D4AF37] px-6 sm:px-8 py-3.5 sm:py-4 text-xs font-bold uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3"
            >
              <Compass className="w-4 h-4" />
              <span>Explore Our Story</span>
            </button>
          </div>

          {/* Campaign Switcher Dots */}
          <div className="pt-6 sm:pt-10 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs text-[#E8DDC7]">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#D4AF37]">Campaign Edit:</span>
            <div className="flex flex-wrap gap-2">
              {CAMPAIGNS.map((c, idx) => (
                <button
                  key={c.id}
                  onClick={() => setActiveIdx(idx)}
                  className={`px-3 py-1 text-[10px] sm:text-[11px] border transition-all ${
                    activeIdx === idx
                      ? 'bg-[#D4AF37] text-[#12372A] font-bold border-[#D4AF37]'
                      : 'bg-black/30 text-[#E8DDC7] border-white/20 hover:border-[#D4AF37]'
                  }`}
                >
                  0{idx + 1} • {c.id.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>

    </section>
  );
};
