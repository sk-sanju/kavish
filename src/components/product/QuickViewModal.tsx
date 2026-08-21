import React, { useState, useEffect } from 'react';
import { X, Star, ShoppingBag, Heart, ShieldCheck, Truck, Ruler } from 'lucide-react';
import { useModal } from '../../context/ModalContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useCurrency } from '../../context/CurrencyContext';
import type { ProductColor } from '../../types';

export const QuickViewModal: React.FC = () => {
  const { quickViewProduct, closeQuickView, openSizeGuide } = useModal();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { formatPrice } = useCurrency();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('Free Size');
  const [selectedColor, setSelectedColor] = useState<ProductColor>({ name: 'Kasavu Gold', hex: '#D4AF37' });
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (quickViewProduct) {
      setSelectedImage(0);
      setSelectedSize(quickViewProduct.sizes[0] || 'Free Size');
      setSelectedColor(quickViewProduct.colors[0] || { name: 'Kasavu Gold', hex: '#D4AF37' });
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
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fadeIn">
      <div className="bg-[#FAF8F1] w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-[#D4AF37]/50 shadow-2xl rounded-3xl relative flex flex-col md:flex-row">
        
        <button
          onClick={closeQuickView}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/90 text-[#12372A] hover:bg-[#12372A] hover:text-[#D4AF37] flex items-center justify-center transition-all shadow-md"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-full md:w-1/2 p-6 bg-white flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#E8DDC7] rounded-t-3xl md:rounded-l-3xl md:rounded-tr-none">
          <div className="aspect-[3/4] bg-[#FAF8F1] overflow-hidden relative rounded-2xl">
            <img
              src={quickViewProduct.images[selectedImage] || quickViewProduct.images[0]}
              alt={quickViewProduct.name}
              className="w-full h-full object-cover transition-all duration-500 rounded-2xl"
            />
          </div>

          {quickViewProduct.images.length > 1 && (
            <div className="flex gap-3 mt-4 overflow-x-auto pb-1">
              {quickViewProduct.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-16 h-20 border transition-all overflow-hidden shrink-0 rounded-xl ${
                    selectedImage === idx ? 'border-[#12372A] ring-2 ring-[#12372A]' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between text-xs text-[#6B5846] font-semibold uppercase tracking-wider mb-1">
              <span>{quickViewProduct.subcategory}</span>
              <div className="flex items-center gap-1 text-[#D4AF37]">
                <Star className="w-3.5 h-3.5 fill-[#D4AF37]" />
                <span>{quickViewProduct.rating}</span>
                <span className="text-gray-400">({quickViewProduct.reviewCount} reviews)</span>
              </div>
            </div>

            <h2 className="font-serif text-2xl font-bold text-[#12372A]">
              {quickViewProduct.name}
            </h2>
            <p className="text-xs text-[#6B5846] mt-1">{quickViewProduct.subtitle}</p>

            <div className="mt-4 flex items-baseline gap-3">
              <span className="font-sans text-2xl font-bold text-[#12372A]">
                {formatPrice(quickViewProduct.price)}
              </span>
              {quickViewProduct.originalPrice && (
                <span className="text-sm text-gray-400 line-through">
                  {formatPrice(quickViewProduct.originalPrice)}
                </span>
              )}
              {quickViewProduct.discountPercentage && (
                <span className="bg-[#D4AF37] text-[#12372A] text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full">
                  Save {quickViewProduct.discountPercentage}%
                </span>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-semibold text-[#171717] tracking-wider">Select Size</span>
              <button
                onClick={() => openSizeGuide(quickViewProduct)}
                className="text-xs text-[#D4AF37] hover:underline flex items-center gap-1 font-medium"
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
                  className={`px-3.5 py-2 text-xs border rounded-xl transition-all ${
                    selectedSize === sz
                      ? 'bg-[#12372A] text-[#FAF8F1] border-[#12372A] font-bold shadow-xs'
                      : 'bg-white text-[#171717] border-[#E8DDC7] hover:border-[#D4AF37]'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-xs uppercase font-semibold text-[#171717] tracking-wider block">
              Color Accent: <span className="font-normal text-[#6B5846]">{selectedColor.name}</span>
            </span>
            <div className="flex gap-2">
              {quickViewProduct.colors.map(c => (
                <button
                  key={c.name}
                  onClick={() => setSelectedColor(c)}
                  className={`w-7 h-7 rounded-full border-2 transition-transform ${
                    selectedColor.name === c.name ? 'border-[#12372A] scale-110' : 'border-gray-300 hover:scale-105'
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-[#E8DDC7]">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="flex items-center border border-[#E8DDC7] bg-white rounded-xl overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 text-xs hover:bg-[#E8DDC7]/30 text-[#171717]"
                >
                  -
                </button>
                <span className="px-4 py-2 text-xs font-bold text-[#12372A]">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 text-xs hover:bg-[#E8DDC7]/30 text-[#171717]"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="flex-1 bg-[#12372A] text-[#FAF8F1] hover:bg-[#D4AF37] hover:text-[#12372A] py-3 px-4 text-xs font-bold uppercase tracking-widest transition-all rounded-xl flex items-center justify-center gap-2 border border-[#D4AF37] shadow-md"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Shopping Bag</span>
              </button>

              <button
                onClick={() => toggleWishlist(quickViewProduct)}
                className={`p-3 border border-[#E8DDC7] hover:border-[#12372A] transition-all rounded-xl ${
                  isFavorite ? 'bg-[#12372A] text-[#D4AF37]' : 'bg-white text-[#171717]'
                }`}
                title="Wishlist"
              >
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-[#D4AF37]' : ''}`} />
              </button>
            </div>

            <div className="flex items-center justify-around text-[11px] text-[#6B5846] pt-2">
              <span className="flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-[#D4AF37]" /> Free Shipping &gt; {formatPrice(2000)}
              </span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" /> Authentic Handloom
              </span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
