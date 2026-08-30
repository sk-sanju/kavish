'use client';

import React from 'react';
import { Heart, Star, Eye, ShoppingBag } from 'lucide-react';
import type { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useModal } from '../../context/ModalContext';
import { useCurrency } from '../../context/CurrencyContext';
import { OptimizedImage } from '../common/OptimizedImage';

interface ProductCardProps {
  product: Product;
  onSelectProduct?: (product: Product) => void;
  priority?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelectProduct, priority = false }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { openQuickView } = useModal();
  const { formatPrice } = useCurrency();

  const isFavorite = isInWishlist(product.id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, product.sizes[0], product.colors[0], 1);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleQuickViewClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    openQuickView(product);
  };

  const primaryImg = product.images?.[0] || '';
  const secondaryImg = product.images?.[1];
  const altText = `${product.name} - ${product.fabric} - Kavish Kuthampully`;

  return (
    <div
      onClick={() => onSelectProduct && onSelectProduct(product)}
      className="group cursor-pointer bg-white border border-[#E8DDC7]/60 hover:border-[#D4AF37] rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative transform hover:-translate-y-1"
    >
      {/* Image Stage Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-[#FAF8F1] rounded-t-2xl">
        {/* Primary Product Image */}
        <OptimizedImage
          src={primaryImg}
          alt={altText}
          preset="card"
          priority={priority}
          aspectRatio="3/4"
          containerClassName="w-full h-full rounded-t-2xl"
          imageClassName="transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Secondary Product Image on Hover */}
        {secondaryImg && (
          <div className="absolute inset-0 w-full h-full rounded-t-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out z-[1]">
            <OptimizedImage
              src={secondaryImg}
              alt={`${altText} - Alternate View`}
              preset="card"
              priority={true}
              aspectRatio="3/4"
              containerClassName="w-full h-full rounded-t-2xl"
              imageClassName="transition-transform duration-700 ease-out group-hover:scale-105"
              showSkeleton={false}
            />
          </div>
        )}

        {/* Floating Wishlist Heart Button (Top Right) */}
        <button
          onClick={handleWishlistClick}
          className={`absolute top-2 right-2 sm:top-2.5 sm:right-2.5 z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm ${
            isFavorite
              ? 'bg-[#12372A] text-[#D4AF37] scale-105'
              : 'bg-white/90 text-gray-700 hover:bg-[#12372A] hover:text-[#D4AF37]'
          }`}
          title={isFavorite ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform ${isFavorite ? 'fill-[#D4AF37]' : ''}`} />
        </button>

        {/* Floating Rating Pill (Bottom Left of Image) */}
        <div className="absolute bottom-2 left-2 z-10 bg-white/95 backdrop-blur-xs text-[#171717] px-1.5 py-0.5 rounded-md text-[10px] font-bold flex items-center gap-1 shadow-xs border border-black/5">
          <span>{product.rating}</span>
          <Star className="w-2.5 h-2.5 fill-[#0F766E] text-[#0F766E]" />
          <span className="text-gray-400 font-normal">| {product.reviewCount || 12}</span>
        </div>

        {/* Quick View & Quick Add Floating Bottom Bar - Desktop & Hover */}
        <div className="hidden sm:flex absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-[#12372A]/90 via-[#12372A]/50 to-transparent items-center gap-1.5 z-10">
          <button
            onClick={handleQuickViewClick}
            className="flex-1 bg-[#FAF8F1] text-[#12372A] hover:bg-[#D4AF37] hover:text-[#12372A] active:scale-95 text-[10px] font-bold uppercase tracking-wider py-1.5 rounded-lg transition-all shadow-sm flex items-center justify-center gap-1 cursor-pointer"
          >
            <Eye className="w-3 h-3" />
            <span>Quick View</span>
          </button>

          <button
            onClick={handleQuickAdd}
            className="bg-[#12372A] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#12372A] active:scale-95 text-[10px] font-bold uppercase tracking-wider p-1.5 rounded-lg transition-all border border-[#D4AF37] shadow-sm cursor-pointer"
            title="Quick Add to Bag"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Card Content Details */}
      <div className="p-2.5 sm:p-3.5 flex-1 flex flex-col justify-between bg-white rounded-b-2xl">
        <div>
          {/* Brand and Tag */}
          <div className="flex items-center gap-1.5 mb-1">
            <span className="bg-purple-100 text-purple-800 text-[8px] sm:text-[9px] font-bold px-1.5 py-0.5 rounded tracking-wide uppercase">
              {product.isNew ? 'TRENDY' : product.isBestSeller ? 'BESTSELLER' : 'HANDLOOM'}
            </span>
            <span className="font-bold text-[10px] sm:text-[11px] uppercase tracking-wider text-[#12372A]">
              KAVISH
            </span>
          </div>

          {/* Product Name */}
          <h3 className="text-[11px] sm:text-xs text-neutral-700 font-normal group-hover:text-[#12372A] transition-colors line-clamp-1">
            {product.name}
          </h3>

          {/* Price Line with Green % Off */}
          <div className="flex flex-wrap items-baseline gap-1 sm:gap-1.5 mt-1">
            {product.discountPercentage ? (
              <span className="text-[10px] sm:text-xs font-bold text-emerald-700 flex items-center">
                ↓{product.discountPercentage}%
              </span>
            ) : null}
            {product.originalPrice && (
              <span className="text-[10px] sm:text-[11px] text-gray-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
            <span className="text-xs sm:text-sm font-bold text-[#12372A]">
              {formatPrice(product.price)}
            </span>
          </div>

          {/* Stock / Urgency Tag */}
          <p className="text-[9px] sm:text-[10px] text-red-600 font-semibold mt-0.5">
            Only few left
          </p>

          {/* Delivery estimate */}
          <p className="text-[9px] sm:text-[10px] text-gray-500 font-light mt-0.5">
            Get it by <span className="font-medium text-gray-700">2-3 Days</span>
          </p>

          {/* Hashtag */}
          <p className="text-[9px] sm:text-[10px] text-gray-400 font-medium mt-0.5">
            #{product.subcategory ? product.subcategory.replace(/\s+/g, '') : 'Kasavu'}
          </p>
        </div>

        {/* Mobile Quick Add Button */}
        <div className="sm:hidden mt-2 pt-2 border-t border-gray-100 flex items-center justify-between gap-1">
          <button
            onClick={handleQuickViewClick}
            className="flex-1 bg-[#FAF8F1] text-[#12372A] hover:bg-[#D4AF37] text-[9px] font-bold uppercase tracking-wider py-1.5 rounded-lg text-center"
          >
            Quick View
          </button>
          <button
            onClick={handleQuickAdd}
            className="bg-[#12372A] text-[#FAF8F1] p-1.5 rounded-lg flex items-center justify-center border border-[#D4AF37]"
            title="Add to Bag"
          >
            <ShoppingBag className="w-3 h-3 text-[#D4AF37]" />
          </button>
        </div>
      </div>

    </div>
  );
};
