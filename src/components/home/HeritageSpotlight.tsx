import React from 'react';
import { Award, Feather, ShieldCheck, Compass } from 'lucide-react';
import { HERITAGE_STORIES } from '../../data/heritage';

interface HeritageSpotlightProps {
  onNavigate: (view: string) => void;
}

export const HeritageSpotlight: React.FC<HeritageSpotlightProps> = ({ onNavigate }) => {
  const story = HERITAGE_STORIES[0];

  return (
    <section className="py-24 bg-[#12372A] text-[#FAF8F1] relative overflow-hidden">
      
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Visual Card */}
          <div className="relative">
            <div className="aspect-[4/5] border border-[#D4AF37]/40 p-3 bg-[#0B241B] shadow-2xl relative rounded-3xl overflow-hidden">
              <img
                src={story.image}
                alt="Kasavu Handloom Weaving Heritage"
                className="w-full h-full object-cover rounded-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#12372A]/80 via-transparent to-transparent" />
            </div>

            {/* Floating Heritage Badge */}
            <div className="absolute -bottom-6 -right-6 bg-[#D4AF37] text-[#12372A] p-6 shadow-2xl rounded-2xl max-w-xs border border-[#12372A] hidden sm:block">
              <div className="flex items-center gap-2 mb-1">
                <Award className="w-5 h-5 shrink-0" />
                <span className="font-serif font-bold text-sm uppercase tracking-wider">GI Tag Certified</span>
              </div>
              <p className="text-[11px] leading-tight text-[#12372A]/90">
                Authentic Chendamangalam &amp; Balaramapuram artisan looms verified by Government of India.
              </p>
            </div>
          </div>

          {/* Right Narrative */}
          <div className="space-y-6">
            <span className="text-xs uppercase tracking-[0.25em] text-[#D4AF37] font-semibold block">
              Handloom Artistry
            </span>

            <h2 className="font-serif text-3xl sm:text-5xl font-bold leading-tight text-[#FAF8F1]">
              Where Kerala Heritage Meets Modern Luxury
            </h2>

            <p className="text-sm text-[#E8DDC7]/90 leading-relaxed font-light">
              At Kavish, we preserve the traditional weaving guilds of Kerala. Every Kasavu thread is woven on non-motorized pit looms, using 24k electroplated gold zari intertwined with unbleached organic combed cotton.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4 border-y border-[#D4AF37]/20 text-xs">
              <div className="flex items-start gap-3 bg-[#0B241B] p-3 rounded-xl border border-[#D4AF37]/20">
                <Feather className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-[#FAF8F1]">Unbleached Organic Cotton</h4>
                  <p className="text-[#E8DDC7]/80 text-[11px] mt-0.5">Naturally breathable thermal balance for tropical climates.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-[#0B241B] p-3 rounded-xl border border-[#D4AF37]/20">
                <ShieldCheck className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-[#FAF8F1]">24k Electroplated Zari</h4>
                  <p className="text-[#E8DDC7]/80 text-[11px] mt-0.5">Guaranteed anti-tarnish gold finish lasting generations.</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigate('heritage')}
              className="bg-[#D4AF37] text-[#12372A] hover:bg-[#FAF8F1] hover:text-[#12372A] px-8 py-4 text-xs font-bold uppercase tracking-widest transition-all rounded-full flex items-center gap-3 border border-[#D4AF37] shadow-lg"
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
