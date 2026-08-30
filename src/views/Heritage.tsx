'use client';

import React from 'react';
import { HERITAGE_STORIES } from '../data/heritage';
import { ArrowRight, ShieldCheck, MapPin, Award, Heart } from 'lucide-react';
import { OptimizedImage } from '../components/common/OptimizedImage';

interface HeritageProps {
  onNavigate: (view: string, categoryFilter?: string, collectionFilter?: string) => void;
}

export const Heritage: React.FC<HeritageProps> = ({ onNavigate }) => {
  return (
    <div className="bg-[#FAF8F1] animate-fadeIn">
      
      {/* Hero Banner */}
      <section className="relative bg-[#12372A] text-[#FAF8F1] py-20 sm:py-28 overflow-hidden">
        <div className="max-w-4xl mx-auto text-center px-4 space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 bg-[#D4AF37]/20 border border-[#D4AF37]/50 px-4 py-1.5 rounded-full text-xs uppercase font-bold text-[#D4AF37] tracking-[0.2em]">
            <MapPin className="w-4 h-4" />
            <span>Kuthampully, Thrissur, Kerala</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl font-bold leading-tight">
            500 Years of Royal Kuthampully Handloom Heritage
          </h1>

          <p className="text-sm sm:text-base text-[#E8DDC7]/90 leading-relaxed max-w-2xl mx-auto font-light">
            Rooted in the historic weaving village of Kuthampully along the Nila River, Kavish preserves the ancient craft of the Devanga master artisans who dressed the Royal Palace of Kochi.
          </p>
        </div>
      </section>

      {/* Village & GI Tag Spotlight Banner */}
      <section className="py-12 bg-[#0B241B] text-[#FAF8F1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-[#D4AF37]/20">
            
            <div className="p-4 space-y-1">
              <span className="font-serif text-3xl font-bold text-[#D4AF37]">500+</span>
              <p className="text-xs text-[#E8DDC7]">Years of Handloom Heritage</p>
            </div>

            <div className="p-4 space-y-1">
              <span className="font-serif text-3xl font-bold text-[#D4AF37]">GI Tag</span>
              <p className="text-xs text-[#E8DDC7]">Certified Geographical Indication 2011</p>
            </div>

            <div className="p-4 space-y-1">
              <span className="font-serif text-3xl font-bold text-[#D4AF37]">Devanga</span>
              <p className="text-xs text-[#E8DDC7]">Master Artisan Weaving Guilds</p>
            </div>

            <div className="p-4 space-y-1">
              <span className="font-serif text-3xl font-bold text-[#D4AF37]">24k Gold</span>
              <p className="text-xs text-[#E8DDC7]">Electroplated Tarnish-Free Kasavu</p>
            </div>

          </div>
        </div>
      </section>

      {/* Detailed Chapters */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
        {HERITAGE_STORIES.map((story, idx) => (
          <div
            key={story.id}
            className={`grid grid-cols-1 lg:grid-cols-12 gap-12 items-center ${
              idx % 2 === 1 ? 'lg:flex-row-reverse' : ''
            }`}
          >
            <div className={`lg:col-span-6 ${idx % 2 === 1 ? 'lg:order-2' : 'lg:order-1'}`}>
              <div className="aspect-[4/3] bg-white border border-[#D4AF37]/40 p-3 shadow-xl rounded-3xl overflow-hidden">
                <OptimizedImage
                  src={story.image}
                  alt={`${story.title} - ${story.subtitle}`}
                  preset="card"
                  aspectRatio="4/3"
                  containerClassName="w-full h-full rounded-2xl"
                  imageClassName="rounded-2xl"
                />
              </div>
            </div>

            <div className={`lg:col-span-6 space-y-6 ${idx % 2 === 1 ? 'lg:order-1' : 'lg:order-2'}`}>
              <span className="text-xs uppercase tracking-[0.2em] text-[#D4AF37] font-bold block">
                Chapter 0{idx + 1}
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#12372A]">
                {story.title}
              </h2>
              <p className="text-xs text-[#D4AF37] font-bold uppercase tracking-wider">{story.subtitle}</p>
              <p className="text-xs text-[#6B5846] leading-relaxed font-light">{story.description}</p>

              <div className="space-y-2.5 pt-2 border-t border-[#E8DDC7]">
                {story.details.map((det, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-xs text-[#12372A]">
                    <ShieldCheck className="w-4 h-4 text-[#D4AF37] shrink-0" />
                    <span>{det}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Kuthampully Master Artisans Feature */}
      <section className="bg-white py-16 border-t border-[#E8DDC7]">
        <div className="max-w-4xl mx-auto text-center px-4 space-y-4">
          <Award className="w-12 h-12 text-[#D4AF37] mx-auto" />
          <h2 className="font-serif text-3xl font-bold text-[#12372A]">Sustaining Kuthampully's Weaver Guilds</h2>
          <p className="text-xs text-[#6B5846] leading-relaxed max-w-2xl mx-auto font-light">
            Every Kavish order directly supports master weaving families in Kuthampully, Thiruvilwamala. By ensuring fair wages, healthcare support, and raw material access, we keep this ancient Kerala art form thriving for future generations.
          </p>
          <div className="pt-4">
            <button
              onClick={() => onNavigate('shop')}
              className="inline-flex items-center gap-2 bg-[#12372A] text-[#FAF8F1] px-8 py-3.5 text-xs font-bold uppercase tracking-widest hover:bg-[#D4AF37] hover:text-[#12372A] transition-all rounded-full shadow-md"
            >
              <span>Explore Kuthampully Masterpieces</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* CTA Footer Banner */}
      <section className="bg-[#12372A] text-[#FAF8F1] py-16 text-center">
        <div className="max-w-2xl mx-auto px-4 space-y-4">
          <Heart className="w-10 h-10 text-[#D4AF37] mx-auto" />
          <h2 className="font-serif text-3xl font-bold">Experience Royal Kuthampully Luxury</h2>
          <p className="text-xs text-[#E8DDC7]">Discover our hand-woven tissue Kasavu sarees, set mundus, and linen shirts.</p>
          <button
            onClick={() => onNavigate('shop')}
            className="inline-flex items-center gap-2 bg-[#D4AF37] text-[#12372A] px-8 py-3.5 text-xs font-bold uppercase tracking-widest hover:bg-[#FAF8F1] rounded-full transition-all shadow-lg"
          >
            <span>Browse Atelier Collection</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

    </div>
  );
};
