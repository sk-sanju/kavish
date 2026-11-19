'use client';

import React from 'react';
import { Quote, Star, Sparkles } from 'lucide-react';
import { REVIEWS } from '../../data/reviews';

export const EditorialQuotes: React.FC = () => {
  return (
    <section className="py-20 bg-[#F8F5EF] border-b border-[#E8DFD0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-[#B99A61]/15 border border-[#B99A61]/40 px-3 py-1 rounded-full text-[10px] sm:text-xs uppercase font-bold text-[#641E2B] tracking-[0.2em] mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#B99A61]" />
            <span>Patron Testimonials</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#641E2B]">
            Worn Across The Globe
          </h2>
          <div className="w-16 h-0.5 bg-[#B99A61] mx-auto mt-4 rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {REVIEWS.slice(0, 3).map(rev => (
            <div
              key={rev.id}
              className="bg-white p-8 border border-[#E8DFD0] rounded-3xl shadow-xs hover:shadow-xl flex flex-col justify-between relative group hover:border-[#B99A61] transition-all duration-400 transform hover:-translate-y-1"
            >
              <Quote className="w-8 h-8 text-[#B99A61]/25 absolute top-6 right-6" />
              
              <div className="space-y-3">
                <div className="flex gap-1 text-[#B99A61]">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#B99A61]" />
                  ))}
                </div>
                <h3 className="font-serif text-lg font-bold text-[#641E2B]">
                  "{rev.title}"
                </h3>
                <p className="text-xs text-[#6E685D] leading-relaxed italic font-serif">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-[#E8DFD0]/60 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-[#641E2B]">{rev.author}</h4>
                  <span className="text-[10px] text-[#6E685D]">{rev.location}</span>
                </div>
                <span className="text-[10px] bg-[#B99A61]/15 text-[#641E2B] border border-[#B99A61]/30 px-2.5 py-1 rounded-full font-semibold">
                  Verified Patron
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
