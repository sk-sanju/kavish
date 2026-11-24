'use client';

import React, { useState, useEffect } from 'react';
import { X, Star, ShoppingBag, Heart, ShieldCheck, Truck, Ruler } from 'lucide-react';
import { useModal } from '../../context/ModalContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useCurrency } from '../../context/CurrencyContext';
import type { ProductColor } from '../../types';
import { OptimizedImage } from '../common/OptimizedImage';

export const QuickViewModal: React.FC = () => {
  const { quickViewProduct, closeQuickView, openSizeGuide } = useModal();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { formatPrice } = useCurrency();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('Free Size');
  const [selectedColor, setSelectedColor] = useState<ProductColor>({ name: 'Kasavu Gold', hex: '#C5A15A' });
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (quickViewProduct) {
      setSelectedImage(0);
      setSelectedSize(quickViewProduct.sizes[0] || 'Free Size');
      setSelectedColor(quickViewProduct.colors[0] || { name: 'Kasavu Gold', hex: '#C5A15A' });
      setQuantity(1);
    }
  }, [quickViewProduct]);

  if (!quickViewProduct) return null;

  const isFavorite = isInWishlist(quickViewProduct.id);

  const handleAddToCart = () => {
    addToCart(quickViewProduct, selectedSize, selectedColor, quantity);
    closeQuickView();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fadeIn">
      <div className="bg-[#FFFFFF] w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-[#C5A15A]/60 shadow-2xl rounded-3xl relative flex flex-col md:flex-row">
        
        <button
          onClick={closeQuickView}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/95 text-[#111111] hover:bg-[#111111] hover:text-[#C5A15A] flex items-center justify-center transition-all shadow-md cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-full md:w-1/2 p-6 bg-white flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#E5E7EB] rounded-t-3xl md:rounded-l-3xl md:rounded-tr-none">
          <div className="aspect-[3/4] bg-[#FFFFFF] overflow-hidden relative rounded-2xl">
            <OptimizedImage
              src={quickViewProduct.images[selectedImage] || quickViewProduct.images[0]}
              alt={`${quickViewProduct.name} - Quick View`}
              preset="card"
              priority={true}
              aspectRatio="3/4"
              containerClassName="w-full h-full rounded-2xl"
              imageClassName="transition-all duration-500 rounded-2xl"
            />
          </div>

          {quickViewProduct.images.length > 1 && (
            <div className="flex gap-3 mt-4 overflow-x-auto pb-1">
              {quickViewProduct.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-16 h-20 border transition-all overflow-hidden shrink-0 rounded-xl cursor-pointer ${
                    selectedImage === idx ? 'border-[#111111] ring-2 ring-[#111111]' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <OptimizedImage
                    src={img}
                    alt={`${quickViewProduct.name} thumbnail ${idx + 1}`}
                    preset="thumbnail"
                    aspectRatio="3/4"
                    containerClassName="w-full h-full"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between text-xs text-[#6B7280] font-semibold uppercase tracking-wider mb-1">
              <span>{quickViewProduct.subcategory}</span>
              <div className="flex items-center gap-1 text-[#C5A15A]">
                <Star className="w-3.5 h-3.5 fill-[#C5A15A]" />
                <span className="font-bold text-[#111111]">{quickViewProduct.rating}</span>
                <span className="text-[#6B7280]">({quickViewProduct.reviewCount} reviews)</span>
              </div>
            </div>

            <h2 className="font-serif text-2xl font-bold text-[#111111]">
              {quickViewProduct.name}
            </h2>
            <p className="text-xs text-[#6B7280] mt-1">{quickViewProduct.subtitle}</p>

            <div className="mt-4 flex items-baseline gap-3">
              <span className="font-sans text-2xl font-bold text-[#111111]">
                {formatPrice(quickViewProduct.price)}
              </span>
              {quickViewProduct.originalPrice && (
                <span className="text-sm text-[#6B7280] line-through">
                  {formatPrice(quickViewProduct.originalPrice)}
                </span>
              )}
              {quickViewProduct.discountPercentage && (
                <span className="bg-[#C5A15A] text-[#111111] text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full">
                  Save {quickViewProduct.discountPercentage}%
                </span>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-semibold text-[#1A1A1A] tracking-wider">Select Size</span>
              <button
                onClick={() => openSizeGuide(quickViewProduct)}
                className="text-xs text-[#C5A15A] hover:underline flex items-center gap-1 font-semibold cursor-pointer"
              >
                <Ruler className="w-3.5 h-3.5" />
                <span>Size Guide</span>
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {quickViewProduct.sizes.map(sz => (
                <button
                  key={sz}
                  onClick={() => setSelectedSize(sz)}
                  className={`px-3.5 py-2 text-xs border rounded-xl transition-all cursor-pointer ${
                    selectedSize === sz
                      ? 'bg-[#111111] text-[#FFFFFF] border-[#111111] font-bold shadow-xs'
                      : 'bg-white text-[#1A1A1A] border-[#E5E7EB] hover:border-[#C5A15A]'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-xs uppercase font-semibold text-[#1A1A1A] tracking-wider block">
              Zari / Color: <span className="font-normal text-[#6B7280]">{selectedColor.name}</span>
            </span>
            <div className="flex gap-2">
              {quickViewProduct.colors.map(c => (
                <button
                  key={c.name}
                  onClick={() => setSelectedColor(c)}
                  className={`w-7 h-7 rounded-full border-2 transition-transform cursor-pointer ${
                    selectedColor.name === c.name ? 'border-[#111111] scale-110 shadow-sm' : 'border-gray-300 hover:scale-105'
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-[#E5E7EB]">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="flex items-center border border-[#E5E7EB] bg-white rounded-xl overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 text-xs hover:bg-[#E5E7EB]/30 text-[#1A1A1A] cursor-pointer"
                >
                  -
                </button>
                <span className="px-4 py-2 text-xs font-bold text-[#111111]">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 text-xs hover:bg-[#E5E7EB]/30 text-[#1A1A1A] cursor-pointer"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="flex-1 bg-[#111111] text-[#FFFFFF] hover:bg-[#C5A15A] hover:text-[#111111] py-3.5 px-4 text-xs font-bold uppercase tracking-widest transition-all rounded-xl flex items-center justify-center gap-2 border border-[#C5A15A] shadow-md cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Shopping Bag</span>
              </button>

              <button
                onClick={() => toggleWishlist(quickViewProduct)}
                className={`p-3 border border-[#E5E7EB] hover:border-[#111111] transition-all rounded-xl cursor-pointer ${
                  isFavorite ? 'bg-[#111111] text-[#C5A15A]' : 'bg-white text-[#1A1A1A]'
                }`}
                title="Wishlist"
              >
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-[#C5A15A]' : ''}`} />
              </button>
            </div>

            <div className="flex items-center justify-around text-[11px] text-[#6B7280] pt-2">
              <span className="flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-[#C5A15A]" /> Free Express Shipping
              </span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C5A15A]" /> Pure Handloom Authenticity
              </span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
