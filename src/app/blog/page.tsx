'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Calendar, Clock, ArrowRight, BookOpen } from 'lucide-react';

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  image: string;
  category: string;
}

const BLOG_POSTS: BlogPost[] = [
  {
    id: 'post-1',
    slug: '500-years-kuthampully-history',
    title: '500 Years of Royal Weaving: How Devanga Master Weavers Shaped Kuthampully',
    excerpt: 'Trace the remarkable journey of the Devanga master artisans who were invited by the Kochi Royal Court in the 16th century to establish Kerala’s most renowned handloom village.',
    date: 'October 15, 2026',
    readTime: '6 min read',
    image: '/assets/heritage/handloom_weaver.jpg',
    category: 'Heritage & Legacy'
  },
  {
    id: 'post-2',
    slug: 'kasavu-saree-care-guide',
    title: 'The Connoisseur’s Guide to Caring for 24k Gold Zari Kasavu Sarees',
    excerpt: 'Authentic Kasavu requires gentle care. Discover traditional storage methods, starching techniques with organic rice sizing, and how to keep electroplated gold zari radiant for decades.',
    date: 'October 28, 2026',
    readTime: '4 min read',
    image: '/assets/heritage/pitloom_craftsmanship.jpg',
    category: 'Textile Care'
  },
  {
    id: 'post-3',
    slug: 'onam-vishu-saree-styling',
    title: 'From Temple Sanctum to Contemporary Soirées: Styling Kerala Kasavu in 2026',
    excerpt: 'Explore modern draping silhouettes, pairing European flax linen blouses with traditional tissue set mundus, and accessorizing with antique temple jewelry.',
    date: 'November 05, 2026',
    readTime: '5 min read',
    image: '/assets/heritage/royal_kasavu_weaver.jpg',
    category: 'Style & Draping'
  }
];

export default function BlogJournalPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#FFFFFF] pb-24 animate-fadeIn">
      {/* Editorial Header Banner */}
      <div className="relative bg-[#000000] text-[#FFFFFF] py-16 sm:py-24 border-b border-[#C5A15A]/30 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#000000] via-[#111111]/85 to-transparent z-10" />
        <img
          src="/assets/banners/hero_kavish.jpg"
          alt="Kavish Handloom Craft Journal"
          className="absolute inset-0 w-full h-full object-cover opacity-35"
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
          <div className="inline-flex items-center gap-2 bg-[#C5A15A]/20 border border-[#C5A15A]/50 px-3 py-1 rounded-full text-[10px] sm:text-xs uppercase font-bold text-[#C5A15A] tracking-[0.2em] mb-3">
            <BookOpen className="w-3.5 h-3.5" />
            <span>The Kavish Journal</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
            Handloom Heritage &amp; Craft Journal
          </h1>
          <p className="text-xs sm:text-sm text-[#FFFFFF]/85 mt-3 max-w-2xl leading-relaxed font-light">
            Insights into the ancient pit-loom techniques of Thrissur, seasonal Kasavu styling inspirations, and artisan stories from the banks of the Bharathapuzha river.
          </p>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {BLOG_POSTS.map(post => (
            <article
              key={post.id}
              className="bg-white border border-[#E5E7EB] hover:border-[#C5A15A] rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-400 flex flex-col justify-between group transform hover:-translate-y-1"
            >
              <div>
                <div className="aspect-[16/10] overflow-hidden bg-[#FFFFFF] relative">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-[#111111]/90 backdrop-blur-md text-[#FFFFFF] text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full border border-[#C5A15A]/40">
                      {post.category}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-4 text-[11px] text-[#6B7280] mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#C5A15A]" />
                      <span>{post.date}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#C5A15A]" />
                      <span>{post.readTime}</span>
                    </span>
                  </div>

                  <h3 className="font-serif text-xl font-bold text-[#111111] group-hover:text-[#C5A15A] transition-colors leading-snug">
                    {post.title}
                  </h3>

                  <p className="text-xs text-[#1A1A1A]/75 mt-3 leading-relaxed font-light line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-2 border-t border-[#E5E7EB]/60 flex items-center justify-between text-xs font-bold text-[#111111]">
                <span className="group-hover:text-[#C5A15A] transition-colors">Read Craft Story</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-[#C5A15A]" />
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
