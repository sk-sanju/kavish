'use client';

import React from 'react';
import { Feather, ShieldCheck, Compass, Sparkles } from 'lucide-react';
import { HERITAGE_STORIES } from '../../data/heritage';
import { OptimizedImage } from '../common/OptimizedImage';

interface HeritageSpotlightProps {
  onNavigate: (view: string) => void;
}

export const HeritageSpotlight: React.FC<HeritageSpotlightProps> = ({ onNavigate }) => {
  const story = HERITAGE_STORIES[0];

  return (
    <section className="py-24 bg-[#46141D] text-[#F8F5EF] relative overflow-hidden border-b border-[#B99A61]/25">
      
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#B99A61]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Visual Card */}
          <div className="relative">
            <div className="aspect-[4/3] sm:aspect-[5/4] lg:aspect-[4/3] border border-[#B99A61]/40 p-2 sm:p-3 bg-[#641E2B] shadow-2xl relative rounded-3xl overflow-hidden">
              <OptimizedImage
                src={story.image}
                alt="Kasavu Handloom Weaving Heritage"
                preset="card"
                aspectRatio="4/3"
                containerClassName="w-full h-full rounded-2xl overflow-hidden"
                imageClassName="rounded-2xl object-cover object-center w-full h-full"
              />
            </div>
          </div>

          {/* Right Narrative */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-[#B99A61]/20 border border-[#B99A61]/50 px-3 py-1 rounded-full text-[10px] sm:text-xs uppercase font-bold text-[#B99A61] tracking-[0.2em]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>500 Years of Living Artistry</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-5xl font-bold leading-tight text-[#F8F5EF]">
              Where Kerala Heritage Meets Modern Luxury
            </h2>

            <p className="text-sm text-[#F8F5EF]/90 leading-relaxed font-light">
              At Kavish, we preserve the traditional weaving guilds of Kerala. Every Kasavu thread is woven on non-motorized pit looms in Kuthampully, using 24k electroplated gold zari intertwined with unbleached organic combed cotton.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4 border-y border-[#B99A61]/25 text-xs">
              <div className="flex items-start gap-3 bg-[#641E2B]/80 p-3.5 rounded-xl border border-[#B99A61]/20">
                <Feather className="w-5 h-5 text-[#B99A61] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-[#F8F5EF]">Unbleached Organic Cotton</h4>
                  <p className="text-[#F8F5EF]/80 text-[11px] mt-0.5">Naturally breathable thermal balance for tropical climates.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-[#641E2B]/80 p-3.5 rounded-xl border border-[#B99A61]/20">
                <ShieldCheck className="w-5 h-5 text-[#B99A61] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-[#F8F5EF]">24k Electroplated Zari</h4>
                  <p className="text-[#F8F5EF]/80 text-[11px] mt-0.5">Guaranteed anti-tarnish gold finish lasting heirloom generations.</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigate('heritage')}
              className="bg-[#B99A61] text-[#46141D] hover:bg-[#F8F5EF] hover:text-[#46141D] px-8 py-4 text-xs font-bold uppercase tracking-widest transition-all rounded-full flex items-center gap-3 border border-[#B99A61] shadow-lg cursor-pointer"
            >
              <Compass className="w-4 h-4" />
              <span>Read The Full Heritage Craft Story</span>
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};
