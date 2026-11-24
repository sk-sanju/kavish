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
  onSelect?: (product: Product) => void;
  onSelectProduct?: (product: Product) => void;
  priority?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect, onSelectProduct, priority = false }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { openQuickView } = useModal();
  const { formatPrice } = useCurrency();

  const handleSelect = () => {
    if (onSelect) onSelect(product);
    else if (onSelectProduct) onSelectProduct(product);
  };

  const isFavorite = isInWishlist(product.id);
  const isOutOfStock = !product.inStock && !product.allowBackorders;
  const isLowStock = !isOutOfStock && product.stockCount != null && product.stockCount > 0 && product.stockCount <= (product.lowStockThreshold || 5);
  const defaultSize = (product.sizes && product.sizes.length > 0) ? product.sizes[0] : 'Free Size';
  const defaultColor = (product.colors && product.colors.length > 0) ? product.colors[0] : { name: 'Kasavu Gold', hex: '#C5A15A' };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    addToCart(product, defaultSize, defaultColor, 1);
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
  const altText = `${product.name} - ${product.fabric} - Kavish Kerala Handlooms`;

  return (
    <div
      onClick={handleSelect}
      className="group cursor-pointer bg-white border border-[#E5E7EB] hover:border-[#C5A15A] rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-400 flex flex-col justify-between relative transform hover:-translate-y-1.5"
    >
      {/* Image Stage Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-[#FFFFFF] rounded-t-2xl">
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
              alt={`${altText} - Alternate Angle`}
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
          className={`absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm cursor-pointer ${
            isFavorite
              ? 'bg-[#111111] text-[#C5A15A] scale-105'
              : 'bg-white/90 text-[#1A1A1A] hover:bg-[#111111] hover:text-[#C5A15A]'
          }`}
          title={isFavorite ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart className={`w-4 h-4 transition-transform ${isFavorite ? 'fill-[#C5A15A]' : ''}`} />
        </button>

        {/* Floating Rating Pill (Bottom Left of Image) */}
        <div className="absolute bottom-2.5 left-2.5 z-10 bg-white/95 backdrop-blur-xs text-[#1A1A1A] px-2 py-0.5 rounded-md text-[10px] font-bold flex items-center gap-1 shadow-xs border border-[#E5E7EB]">
          <span>{product.rating}</span>
          <Star className="w-2.5 h-2.5 fill-[#C5A15A] text-[#C5A15A]" />
          <span className="text-gray-400 font-normal">| {product.reviewCount || 8}</span>
        </div>

        {/* Quick View & Quick Add Floating Bottom Bar - Desktop & Hover */}
        <div className="hidden sm:flex absolute inset-x-0 bottom-0 p-2.5 bg-gradient-to-t from-[#000000]/90 via-[#000000]/50 to-transparent items-center gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={handleQuickViewClick}
            className="flex-1 bg-[#FFFFFF] text-[#111111] hover:bg-[#C5A15A] hover:text-[#000000] active:scale-95 text-[10px] font-bold uppercase tracking-wider py-2 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View</span>
          </button>

          <button
            onClick={handleQuickAdd}
            disabled={isOutOfStock}
            className={`text-[10px] font-bold uppercase tracking-wider p-2 rounded-xl transition-all border shadow-sm ${
              isOutOfStock
                ? 'bg-neutral-200 text-neutral-400 border-neutral-300 cursor-not-allowed opacity-60'
                : 'bg-[#111111] text-[#C5A15A] hover:bg-[#C5A15A] hover:text-[#000000] active:scale-95 border-[#C5A15A] cursor-pointer'
            }`}
            title={isOutOfStock ? "Out of Stock" : "Quick Add to Bag"}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Card Content Details */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between bg-white rounded-b-2xl">
        <div>
          {/* Brand and Badge */}
          <div className="flex items-center gap-1.5 mb-1.5">
            <span className="bg-[#111111]/10 text-[#111111] text-[8px] sm:text-[9px] font-bold px-2 py-0.5 rounded-full tracking-wide uppercase">
              {product.isBestSeller ? 'BESTSELLER' : product.isNew ? 'NEW ARRIVAL' : 'KAVISH LUXE'}
            </span>
            <span className="font-bold text-[10px] sm:text-[11px] uppercase tracking-wider text-[#C5A15A]">
              KAVISH
            </span>
          </div>

          {/* Product Name */}
          <h3 className="text-xs sm:text-sm text-[#1A1A1A] font-semibold group-hover:text-[#111111] transition-colors line-clamp-1">
            {product.name}
          </h3>

          {/* Price Line with Savings */}
          <div className="flex flex-wrap items-baseline gap-1.5 sm:gap-2 mt-1.5">
            <span className="text-sm sm:text-base font-bold text-[#111111]">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-gray-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
            {product.discountPercentage ? (
              <span className="text-[10px] sm:text-xs font-bold text-[#C5A15A]">
                ({product.discountPercentage}% OFF)
              </span>
            ) : null}
          </div>
        </div>

        {/* Stock Status Indicator */}
        <div className="mt-2.5 pt-2 border-t border-[#E5E7EB]/60 flex items-center justify-between text-[10px]">
          {isOutOfStock ? (
            <span className="text-red-700 font-bold">Out of Stock</span>
          ) : isLowStock ? (
            <span className="text-amber-700 font-bold">Only {product.stockCount} Left</span>
          ) : (
            <span className="text-emerald-700 font-medium">In Stock</span>
          )}
          <span className="text-[#6B7280] truncate max-w-[110px]">{product.fabric || '100% Handloom'}</span>
        </div>
      </div>
    </div>
  );
};
