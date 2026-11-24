'use client';

import React from 'react';
import { ArrowRight, ShieldCheck, Heart, Sparkles, MapPin, Award, Users, CheckCircle2 } from 'lucide-react';

interface AboutPageProps {
  onNavigate: (view: string, categoryFilter?: string, collectionFilter?: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="bg-[#FFFFFF] animate-fadeIn">
      {/* Hero Header */}
      <section className="relative bg-[#0A0A0A] text-[#FFFFFF] py-20 sm:py-28 overflow-hidden border-b border-[#C5A15A]/30">
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A] via-[#111111]/90 to-transparent z-10" />
        <img
          src="/assets/categories/women_kasavu.jpg"
          alt="Kavish Atelier Handlooms"
          className="absolute inset-0 w-full h-full object-cover opacity-25"
        />
        <div className="max-w-4xl mx-auto text-center px-4 space-y-6 relative z-20">
          <div className="inline-flex items-center gap-2 bg-[#C5A15A]/20 border border-[#C5A15A]/50 px-4 py-1.5 rounded-full text-xs uppercase font-bold text-[#C5A15A] tracking-[0.2em]">
            <Sparkles className="w-4 h-4" />
            <span>Kavish Atelier • Founded in Kuthampully</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl font-bold leading-tight">
            Weaving Royal Tradition into Modern Luxury
          </h1>

          <p className="text-sm sm:text-base text-[#E5E7EB]/90 leading-relaxed max-w-2xl mx-auto font-light">
            Kavish was founded with a singular conviction: to preserve the 500-year-old pit-loom handloom traditions of Kuthampully while reimagining ceremonial silhouettes for contemporary celebrations.
          </p>
        </div>
      </section>

      {/* Brand Story & Philosophy */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs uppercase tracking-[0.2em] text-[#C5A15A] font-bold block">
              Our Origin &amp; Purpose
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#111111] leading-snug">
              From Sacred Looms by the Nila to Global Celebrations
            </h2>
            <p className="text-xs sm:text-sm text-[#6B7280] leading-relaxed font-light">
              In a world flooded by synthetic, machine-printed textiles, Kavish stands as a sanctuary of authentic handloom craftsmanship. Our atelier operates directly in Kuthampully, a secluded artisan village in Thrissur along the banks of the river Bharathapuzha.
            </p>
            <p className="text-xs sm:text-sm text-[#6B7280] leading-relaxed font-light">
              Here, third and fourth-generation master weavers rhythmically guide shuttle through warp, translating pure combed cotton, electroplated gold zari, and European flax linen into heirlooms that drape with effortless majesty.
            </p>

            <div className="space-y-3 pt-2 border-t border-[#E5E7EB]">
              <div className="flex items-center gap-3 text-xs text-[#111111] font-medium">
                <CheckCircle2 className="w-4 h-4 text-[#C5A15A] shrink-0" />
                <span>Zero Power-Loom Imitations • 100% Traditional Pit-Loom Weaving</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-[#111111] font-medium">
                <CheckCircle2 className="w-4 h-4 text-[#C5A15A] shrink-0" />
                <span>Direct-from-Loom Fair Trade • Supporting Over 60 Artisan Families</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-[#111111] font-medium">
                <CheckCircle2 className="w-4 h-4 text-[#C5A15A] shrink-0" />
                <span>Certified Pure Cotton &amp; Tarnish-Resistant 24k Electroplated Zari</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <img
                  src="/assets/categories/men_mundu.jpg"
                  alt="Traditional Men Double Mundu"
                  className="rounded-3xl shadow-lg w-full aspect-[4/5] object-cover border border-[#C5A15A]/30"
                />
                <div className="p-5 rounded-2xl bg-[#0A0A0A] text-[#FFFFFF] space-y-1">
                  <span className="font-serif text-2xl font-bold text-[#C5A15A]">500+</span>
                  <p className="text-[11px] text-[#E5E7EB]/80">Years of Royal Devanga Weaving Tradition</p>
                </div>
              </div>

              <div className="space-y-4 pt-8">
                <div className="p-5 rounded-2xl bg-[#C5A15A]/15 border border-[#C5A15A]/40 text-[#111111] space-y-1">
                  <span className="font-serif text-2xl font-bold text-[#111111]">100%</span>
                  <p className="text-[11px] text-[#6B7280]">Handcrafted &amp; Quality Inspected</p>
                </div>
                <img
                  src="/assets/categories/bridal_festive.jpg"
                  alt="Bridal and Festive Handloom Saree"
                  className="rounded-3xl shadow-lg w-full aspect-[4/5] object-cover border border-[#C5A15A]/30"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Kavish Pillars */}
      <section className="py-16 bg-[#111111] text-[#FFFFFF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase tracking-[0.2em] text-[#C5A15A] font-bold block mb-2">
              Our Commitments
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold">The Pillars of Kavish</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-[#1A1A1A] border border-[#C5A15A]/30 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#0A0A0A] border border-[#C5A15A]/40 flex items-center justify-center text-[#C5A15A]">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#FFFFFF]">Authentic Master Weaves</h3>
              <p className="text-xs text-[#E5E7EB]/70 leading-relaxed font-light">
                Every thread is spun from premium combed cotton yarn and electroplated zari. No synthetic blends, no shortcuts, just pure handloom integrity.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-[#1A1A1A] border border-[#C5A15A]/30 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#0A0A0A] border border-[#C5A15A]/40 flex items-center justify-center text-[#C5A15A]">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#FFFFFF]">Artisan Empowerment</h3>
              <p className="text-xs text-[#E5E7EB]/70 leading-relaxed font-light">
                By maintaining direct partnerships with master weavers in Kuthampully, we ensure sustainable fair wages and preserve heritage pit-loom crafts for generations.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-[#1A1A1A] border border-[#C5A15A]/30 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#0A0A0A] border border-[#C5A15A]/40 flex items-center justify-center text-[#C5A15A]">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#FFFFFF]">Modern Elegance</h3>
              <p className="text-xs text-[#E5E7EB]/70 leading-relaxed font-light">
                We combine royal ceremonial Kasavu borders with lightweight tissue weaves and European linen shirts, delivering effortless comfort for weddings and Onam.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Invitation CTA */}
      <section className="py-20 text-center max-w-3xl mx-auto px-4 space-y-6">
        <MapPin className="w-10 h-10 text-[#C5A15A] mx-auto" />
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#111111]">
          Visit Our Atelier in Kuthampully
        </h2>
        <p className="text-xs sm:text-sm text-[#6B7280] leading-relaxed font-light">
          Experience the rhythm of our pit-looms firsthand. Our weaver concierge is pleased to welcome patrons by appointment for bespoke wedding trousseau consultations.
        </p>
        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <button
            onClick={() => onNavigate('shop')}
            className="px-8 py-3.5 bg-[#111111] text-[#FFFFFF] hover:bg-[#C5A15A] hover:text-[#111111] text-xs font-bold uppercase tracking-widest rounded-full transition-all shadow-md flex items-center gap-2 cursor-pointer"
          >
            <span>Explore Collections</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => onNavigate('contact')}
            className="px-8 py-3.5 bg-white text-[#111111] border border-[#111111] hover:border-[#C5A15A] hover:text-[#C5A15A] text-xs font-bold uppercase tracking-widest rounded-full transition-all cursor-pointer"
          >
            <span>Contact Atelier Concierge</span>
          </button>
        </div>
      </section>
    </div>
  );
};
