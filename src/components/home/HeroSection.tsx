import React, { useState, useMemo, useEffect } from 'react';
import { ArrowRight, Sparkles, Compass } from 'lucide-react';
import { useAdmin, DEFAULT_HERO_BANNERS } from '../../context/AdminContext';
import type { HeroBanner } from '../../types';
import { getOptimizedImageUrl, handleImageError } from '../../utils/imageOptimizer';

interface HeroSectionProps {
  onNavigate: (view: string, categoryFilter?: string, collectionFilter?: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate }) => {
  const { storeContent, heroBanners } = useAdmin();
  const [activeIdx, setActiveIdx] = useState(0);

  const bannersList: HeroBanner[] = useMemo(() => {
    // 1. If live heroBanners is available in AdminContext
    if (heroBanners && Array.isArray(heroBanners) && heroBanners.length > 0) {
      const active = heroBanners.filter(b => b.isActive !== false);
      if (active.length > 0) return active;
    }

    // 2. If storeContent has heroBanners
    if (storeContent?.heroBanners && Array.isArray(storeContent.heroBanners) && storeContent.heroBanners.length > 0) {
      const active = storeContent.heroBanners.filter(b => b.isActive !== false);
      if (active.length > 0) return active;
    }

    // 3. If storeContent has live bannerImage or heroTitle from database
    if (storeContent?.bannerImage || storeContent?.heroTitle) {
      return [
        {
          id: 'banner-live-primary',
          tag: 'Atelier Signature Edit',
          title: storeContent.heroTitle || DEFAULT_HERO_BANNERS[0].title,
          subtitle: storeContent.heroSubtitle || DEFAULT_HERO_BANNERS[0].subtitle,
          image: storeContent.bannerImage || DEFAULT_HERO_BANNERS[0].image,
          primaryCtaText: 'Shop Collection',
          primaryCtaLink: 'shop',
          secondaryCtaText: 'Explore Our Story',
          secondaryCtaLink: 'heritage',
          collectionSlug: 'kasavu-masterpieces',
          isActive: true,
          order: 1
        }
      ];
    }

    return DEFAULT_HERO_BANNERS;
  }, [heroBanners, storeContent]);

  const safeIdx = (activeIdx >= 0 && activeIdx < bannersList.length) ? activeIdx : 0;
  const current = bannersList[safeIdx] || DEFAULT_HERO_BANNERS[0];
  const optimizedBannerImg = getOptimizedImageUrl(current.image, { width: 1400, quality: 80 });

  // Preload all other banners in the background for instant sliding transitions
  useEffect(() => {
    bannersList.forEach(banner => {
      if (banner.image) {
        const img = new Image();
        img.src = getOptimizedImageUrl(banner.image, { width: 1400, quality: 80 });
      }
    });
  }, [bannersList]);

  return (
    <section className="relative bg-[#0F2D22] text-[#FAF8F1] min-h-[75vh] sm:min-h-[85vh] flex items-center overflow-hidden">
      
      {/* Background Image with Gradient Overlay */}
      <div className="absolute inset-0 z-0 bg-[#0F2D22]">
        <img
          key={current.id || current.image}
          src={optimizedBannerImg}
          alt="Kavish Kerala Luxury Fashion Campaign"
          className="w-full h-full object-cover opacity-40 sm:opacity-45 transform scale-105 transition-all duration-1000 ease-out"
          loading="eager"
          // @ts-ignore
          fetchpriority="high"
          decoding="async"
          onError={handleImageError}
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
              onClick={() => onNavigate(current.primaryCtaLink || 'shop', undefined, current.collectionSlug || undefined)}
              className="bg-[#D4AF37] text-[#12372A] hover:bg-[#FAF8F1] hover:text-[#12372A] px-6 sm:px-8 py-3.5 sm:py-4 text-xs font-bold uppercase tracking-[0.2em] transition-all shadow-xl flex items-center justify-center gap-3 border border-[#D4AF37]"
            >
              <span>{current.primaryCtaText || 'Shop Collection'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate(current.secondaryCtaLink || 'heritage')}
              className="bg-transparent text-[#FAF8F1] border border-[#FAF8F1]/40 hover:border-[#D4AF37] hover:text-[#D4AF37] px-6 sm:px-8 py-3.5 sm:py-4 text-xs font-bold uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3"
            >
              <Compass className="w-4 h-4" />
              <span>{current.secondaryCtaText || 'Explore Our Story'}</span>
            </button>
          </div>

          {/* Campaign Switcher Dots */}
          {bannersList.length > 1 && (
            <div className="pt-6 sm:pt-10 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs text-[#E8DDC7]">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#D4AF37]">Campaign Edit:</span>
              <div className="flex flex-wrap gap-2">
                {bannersList.map((c, idx) => (
                  <button
                    key={c.id}
                    onClick={() => setActiveIdx(idx)}
                    className={`px-3 py-1 text-[10px] sm:text-[11px] border transition-all ${
                      activeIdx === idx
                        ? 'bg-[#D4AF37] text-[#12372A] font-bold border-[#D4AF37]'
                        : 'bg-black/30 text-[#E8DDC7] border-white/20 hover:border-[#D4AF37]'
                    }`}
                  >
                    0{idx + 1} • {c.tag.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

    </section>
  );
};
