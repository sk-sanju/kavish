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
    <div className="bg-[#FFFFFF] animate-fadeIn">
      
      {/* Hero Banner */}
      <section className="relative bg-[#111111] text-[#FFFFFF] py-20 sm:py-28 overflow-hidden">
        <div className="max-w-4xl mx-auto text-center px-4 space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 bg-[#C5A15A]/20 border border-[#C5A15A]/50 px-4 py-1.5 rounded-full text-xs uppercase font-bold text-[#C5A15A] tracking-[0.2em]">
            <MapPin className="w-4 h-4" />
            <span>Kuthampully, Thrissur, Kerala</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl font-bold leading-tight">
            500 Years of Royal Kuthampully Handloom Heritage
          </h1>

          <p className="text-sm sm:text-base text-[#E5E7EB]/90 leading-relaxed max-w-2xl mx-auto font-light">
            Rooted in the historic weaving village of Kuthampully along the Nila River, Kavish preserves the ancient craft of the Devanga master artisans who dressed the Royal Palace of Kochi.
          </p>
        </div>
      </section>

      {/* Village & Master Handloom Spotlight Banner */}
      <section className="py-12 bg-[#000000] text-[#FFFFFF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-[#C5A15A]/20">
            
            <div className="p-4 space-y-1">
              <span className="font-serif text-3xl font-bold text-[#C5A15A]">500+</span>
              <p className="text-xs text-[#E5E7EB]">Years of Handloom Heritage</p>
            </div>

            <div className="p-4 space-y-1">
              <span className="font-serif text-3xl font-bold text-[#C5A15A]">100%</span>
              <p className="text-xs text-[#E5E7EB]">Authentic Pit-Loom Handloom Weave</p>
            </div>

            <div className="p-4 space-y-1">
              <span className="font-serif text-3xl font-bold text-[#C5A15A]">Devanga</span>
              <p className="text-xs text-[#E5E7EB]">Master Artisan Weaving Guilds</p>
            </div>

            <div className="p-4 space-y-1">
              <span className="font-serif text-3xl font-bold text-[#C5A15A]">24k Gold</span>
              <p className="text-xs text-[#E5E7EB]">Electroplated Tarnish-Free Kasavu</p>
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
              <div className="aspect-[4/3] bg-white border border-[#C5A15A]/40 p-3 shadow-xl rounded-3xl overflow-hidden">
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
              <span className="text-xs uppercase tracking-[0.2em] text-[#C5A15A] font-bold block">
                Chapter 0{idx + 1}
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#111111]">
                {story.title}
              </h2>
              <p className="text-xs text-[#C5A15A] font-bold uppercase tracking-wider">{story.subtitle}</p>
              <p className="text-xs text-[#6B7280] leading-relaxed font-light">{story.description}</p>

              <div className="space-y-2.5 pt-2 border-t border-[#E5E7EB]">
                {story.details.map((det, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-xs text-[#111111]">
                    <ShieldCheck className="w-4 h-4 text-[#C5A15A] shrink-0" />
                    <span>{det}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Kuthampully Master Artisans Feature */}
      <section className="bg-white py-16 border-t border-[#E5E7EB]">
        <div className="max-w-4xl mx-auto text-center px-4 space-y-4">
          <Award className="w-12 h-12 text-[#C5A15A] mx-auto" />
          <h2 className="font-serif text-3xl font-bold text-[#111111]">Sustaining Kuthampully's Weaver Guilds</h2>
          <p className="text-xs text-[#6B7280] leading-relaxed max-w-2xl mx-auto font-light">
            Every Kavish order directly supports master weaving families in Kuthampully, Thiruvilwamala. By ensuring fair wages, healthcare support, and raw material access, we keep this ancient Kerala art form thriving for future generations.
          </p>
          <div className="pt-4">
            <button
              onClick={() => onNavigate('shop')}
              className="inline-flex items-center gap-2 bg-[#111111] text-[#FFFFFF] px-8 py-3.5 text-xs font-bold uppercase tracking-widest hover:bg-[#C5A15A] hover:text-[#111111] transition-all rounded-full shadow-md"
            >
              <span>Explore Kuthampully Masterpieces</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* CTA Footer Banner */}
      <section className="bg-[#111111] text-[#FFFFFF] py-16 text-center">
        <div className="max-w-2xl mx-auto px-4 space-y-4">
          <Heart className="w-10 h-10 text-[#C5A15A] mx-auto" />
          <h2 className="font-serif text-3xl font-bold">Experience Royal Kuthampully Luxury</h2>
          <p className="text-xs text-[#E5E7EB]">Discover our hand-woven tissue Kasavu sarees, set mundus, and linen shirts.</p>
          <button
            onClick={() => onNavigate('shop')}
            className="inline-flex items-center gap-2 bg-[#C5A15A] text-[#111111] px-8 py-3.5 text-xs font-bold uppercase tracking-widest hover:bg-[#FFFFFF] rounded-full transition-all shadow-lg"
          >
            <span>Browse Atelier Collection</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

    </div>
  );
};
