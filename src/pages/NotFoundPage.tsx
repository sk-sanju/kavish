import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Home } from 'lucide-react';
import logoImg from '../assets/logo.png';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="py-16 sm:py-24 bg-[#FAF8F1] min-h-[75vh] flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white p-8 sm:p-12 border border-[#E8DDC7] rounded-3xl shadow-xl max-w-lg w-full text-center space-y-6">
        
        <img
          src={logoImg}
          alt="KAVISH - Kerala Ethnic Wear"
          className="h-12 w-auto object-contain mx-auto cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() => navigate('/')}
        />

        <div className="space-y-2">
          <span className="text-[10px] uppercase font-bold text-[#D4AF37] tracking-widest block">
            404 • Page Not Found
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#12372A]">
            Lost in the Weaves?
          </h1>
          <p className="text-xs sm:text-sm text-[#6B5846] leading-relaxed">
            The page you are looking for might have been moved or does not exist. Let us guide you back to our curated handlooms.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={() => navigate('/')}
            className="flex-1 bg-[#12372A] text-[#FAF8F1] hover:bg-[#D4AF37] hover:text-[#12372A] py-3.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all border border-[#D4AF37] shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <Home className="w-4 h-4 text-[#D4AF37]" />
            <span>Return Home</span>
          </button>

          <button
            onClick={() => navigate('/shop')}
            className="flex-1 bg-white text-[#12372A] border border-[#12372A] hover:bg-[#FAF8F1] py-3.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Shop Collection</span>
          </button>
        </div>

        <div className="pt-4 border-t border-[#E8DDC7] text-xs text-[#6B5846]">
          <span className="block mb-2 font-semibold text-[#12372A]">Popular Pages:</span>
          <div className="flex flex-wrap justify-center gap-3 text-[11px]">
            <button onClick={() => navigate('/shop/category/women')} className="hover:text-[#D4AF37] underline cursor-pointer">Kasavu Sarees</button>
            <span>•</span>
            <button onClick={() => navigate('/shop/category/men')} className="hover:text-[#D4AF37] underline cursor-pointer">Men's Mundu</button>
            <span>•</span>
            <button onClick={() => navigate('/track-order')} className="hover:text-[#D4AF37] underline cursor-pointer">Track Order</button>
            <span>•</span>
            <button onClick={() => navigate('/heritage')} className="hover:text-[#D4AF37] underline cursor-pointer">Our Story</button>
          </div>
        </div>

      </div>
    </div>
  );
};
