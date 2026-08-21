import React from 'react';
import { Quote, Star } from 'lucide-react';
import { REVIEWS } from '../../data/reviews';

export const EditorialQuotes: React.FC = () => {
  return (
    <section className="py-20 bg-[#FAF8F1] border-b border-[#E8DDC7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.25em] text-[#D4AF37] font-bold block mb-1">
            Client Voices
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#12372A]">
            Worn Across the Globe
          </h2>
          <div className="w-12 h-0.5 bg-[#D4AF37] mx-auto mt-4 rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {REVIEWS.slice(0, 3).map(rev => (
            <div
              key={rev.id}
              className="bg-white p-8 border border-[#E8DDC7] rounded-2xl shadow-xs hover:shadow-xl flex flex-col justify-between relative group hover:border-[#D4AF37] transition-all duration-400 transform hover:-translate-y-1"
            >
              <Quote className="w-8 h-8 text-[#D4AF37]/30 absolute top-6 right-6" />
              
              <div className="space-y-3">
                <div className="flex gap-1 text-[#D4AF37]">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#D4AF37]" />
                  ))}
                </div>
                <h3 className="font-serif text-lg font-bold text-[#12372A]">
                  "{rev.title}"
                </h3>
                <p className="text-xs text-[#6B5846] leading-relaxed italic font-serif">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-[#FAF8F1] flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-[#12372A]">{rev.author}</h4>
                  <span className="text-[10px] text-[#6B5846]">{rev.location}</span>
                </div>
                <span className="text-[10px] bg-[#E8DDC7]/40 text-[#12372A] px-2.5 py-1 rounded-full font-semibold">
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
