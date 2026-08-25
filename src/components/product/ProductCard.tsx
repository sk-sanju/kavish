import React, { useState } from 'react';
import { Heart, Star, Eye, ShoppingBag } from 'lucide-react';
import type { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useModal } from '../../context/ModalContext';
import { useCurrency } from '../../context/CurrencyContext';
import { getOptimizedImageUrl, handleImageError } from '../../utils/imageOptimizer';

interface ProductCardProps {
  product: Product;
  onSelectProduct?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelectProduct }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { openQuickView } = useModal();
  const { formatPrice } = useCurrency();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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

  const rawImg = product.images[currentImageIndex] || product.images[0];
  const displayImg = getOptimizedImageUrl(rawImg, { width: 500, quality: 75 });

  return (
    <div
      onClick={() => onSelectProduct && onSelectProduct(product)}
      className="group cursor-pointer bg-white border border-[#E8DDC7]/70 hover:border-[#D4AF37] rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col justify-between relative transform hover:-translate-y-1.5"
    >
      {/* Image Stage Container */}
      <div
        className="relative aspect-[3/4] overflow-hidden bg-[#FAF8F1] rounded-t-2xl"
        onMouseEnter={() => product.images[1] && setCurrentImageIndex(1)}
        onMouseLeave={() => setCurrentImageIndex(0)}
      >
        <img
          src={displayImg}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-106"
          loading="lazy"
          decoding="async"
          onError={handleImageError}
        />

        {/* Floating Badges with Smooth Rounded Pill shape */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.isNew && (
            <span className="bg-[#12372A] text-[#FAF8F1] text-[9px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-full border border-[#D4AF37]/40 shadow-sm">
              New Arrival
            </span>
          )}
          {product.isBestSeller && (
            <span className="bg-[#D4AF37] text-[#12372A] text-[9px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-full shadow-sm">
              Bestseller
            </span>
          )}
          {product.discountPercentage && (
            <span className="bg-red-900/90 text-white text-[9px] font-bold px-2.5 py-1 rounded-full shadow-sm">
              {product.discountPercentage}% OFF
            </span>
          )}
        </div>

        {/* Rounded Wishlist Heart Button */}
        <button
          onClick={handleWishlistClick}
          className={`absolute top-3 right-3 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 shadow-md ${
            isFavorite
              ? 'bg-[#12372A] text-[#D4AF37] scale-105'
              : 'bg-white/90 text-[#171717] hover:bg-[#12372A] hover:text-[#D4AF37]'
          }`}
          title={isFavorite ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart className={`w-4 h-4 transition-transform ${isFavorite ? 'fill-[#D4AF37]' : ''}`} />
        </button>

        {/* Quick View & Quick Add Floating Bottom Bar */}
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-[#12372A]/85 via-[#12372A]/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center gap-2">
          <button
            onClick={handleQuickViewClick}
            className="flex-1 bg-[#FAF8F1] text-[#12372A] hover:bg-[#D4AF37] hover:text-[#12372A] text-[11px] font-bold uppercase tracking-wider py-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View</span>
          </button>

          <button
            onClick={handleQuickAdd}
            className="bg-[#12372A] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#12372A] text-[11px] font-bold uppercase tracking-wider p-2.5 rounded-xl transition-all border border-[#D4AF37] shadow-sm"
            title="Quick Add to Bag"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Card Content Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between bg-white rounded-b-2xl">
        <div>
          <div className="flex items-center justify-between text-[10px] uppercase font-semibold text-[#6B5846] mb-1.5">
            <span>{product.subcategory}</span>
            <div className="flex items-center gap-1 text-[#D4AF37]">
              <Star className="w-3.5 h-3.5 fill-[#D4AF37]" />
              <span>{product.rating}</span>
              <span className="text-gray-400">({product.reviewCount})</span>
            </div>
          </div>

          <h3 className="font-serif text-base font-bold text-[#171717] group-hover:text-[#12372A] transition-colors line-clamp-1">
            {product.name}
          </h3>
          <p className="text-[11px] text-[#6B5846] line-clamp-1 mt-0.5 font-light">
            {product.subtitle}
          </p>
        </div>

        <div className="mt-3 pt-3 border-t border-[#E8DDC7]/40 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-bold text-[#12372A]">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-gray-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          <span className="text-[10px] text-[#D4AF37] font-semibold uppercase tracking-wider bg-[#FAF8F1] px-2 py-0.5 rounded-full border border-[#D4AF37]/30">
            {product.fabric.split(' ')[0]}
          </span>
        </div>
      </div>

    </div>
  );
};
