'use client';

import React from 'react';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { OptimizedImage } from '../common/OptimizedImage';

const INSTA_IMAGES = [
  '/assets/gallery/gallery_01.jpg',
  '/assets/gallery/gallery_02.jpg',
  '/assets/gallery/gallery_03.jpg',
  '/assets/gallery/gallery_04.jpg',
  '/assets/categories/women_kasavu.jpg',
  '/assets/categories/kids_ethnic.jpg',
];

const InstagramIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);

export const SocialGallery: React.FC = () => {
  return (
    <section className="py-20 bg-[#F8F5EF] border-b border-[#E8DFD0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#B99A61]/15 border border-[#B99A61]/40 px-3 py-1 rounded-full text-[10px] sm:text-xs uppercase font-bold text-[#641E2B] tracking-[0.2em] mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#B99A61]" />
              <span>Community &amp; Culture</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#641E2B]">
              Kavish, In Your World
            </h2>
          </div>

          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#641E2B] hover:text-[#B99A61] transition-colors mt-4 sm:mt-0 bg-white px-5 py-2.5 rounded-full border border-[#E8DFD0] shadow-xs cursor-pointer"
          >
            <InstagramIcon className="w-4 h-4 text-[#B99A61]" />
            <span>Follow @KavishOfficial</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {INSTA_IMAGES.map((img, idx) => (
            <a
              key={idx}
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="group aspect-square overflow-hidden bg-[#F8F5EF] relative border border-[#E8DFD0] rounded-2xl shadow-xs"
            >
              <OptimizedImage
                src={img}
                alt={`Kavish Instagram Community Style ${idx + 1}`}
                preset="thumbnail"
                aspectRatio="1/1"
                containerClassName="w-full h-full rounded-2xl"
                imageClassName="group-hover:scale-110 transition-transform duration-500 opacity-90 group-hover:opacity-100 rounded-2xl"
              />
              <div className="absolute inset-0 bg-[#46141D]/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[#B99A61] rounded-2xl z-10">
                <InstagramIcon className="w-6 h-6" />
              </div>
            </a>
          ))}
        </div>

      </div>
    </section>
  );
};
