import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, ShoppingBag, Heart, Ruler, ChevronDown, ChevronUp } from 'lucide-react';
import type { Product, ProductColor } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useModal } from '../context/ModalContext';
import { useCurrency } from '../context/CurrencyContext';
import { useProducts } from '../context/ProductContext';
import { ProductCard } from '../components/product/ProductCard';
import { getOptimizedImageUrl, handleImageError } from '../utils/imageOptimizer';

interface ProductDetailProps {
  product?: Product | null;
  onSelectProduct?: (product: Product) => void;
  onProceedToCheckout?: () => void;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ product: propProduct, onSelectProduct, onProceedToCheckout }) => {
  const params = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { products, reviews, addReview } = useProducts();

  const targetId = params.id || propProduct?.id;
  const product = (targetId ? products.find(p => p.id === targetId) : null) || propProduct || products[0];

  const [newReviewTitle, setNewReviewTitle] = useState('');
  const [newReviewComment, setNewReviewComment] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [showReviewForm, setShowReviewForm] = useState(false);

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { openSizeGuide } = useModal();
  const { formatPrice } = useCurrency();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || 'Free Size');
  const [selectedColor, setSelectedColor] = useState<ProductColor>(product?.colors?.[0] || { name: 'Kasavu Gold', hex: '#D4AF37' });
  const [quantity, setQuantity] = useState(1);
  const [openAccordion, setOpenAccordion] = useState<string | null>('details');

  if (!product) {
    return (
      <div className="py-28 bg-[#FAF8F1] text-center px-4 animate-fadeIn">
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#12372A]">Garment Not Found</h2>
        <p className="text-xs text-[#6B5846] mt-2 mb-6">The requested handloom garment is currently not available or catalog is syncing.</p>
        <button
          onClick={() => navigate('/shop')}
          className="bg-[#12372A] text-[#FAF8F1] px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-[#D4AF37] hover:text-[#12372A] transition-all"
        >
          Explore Atelier Collection
        </button>
      </div>
    );
  }

  const isFavorite = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
    if (onProceedToCheckout) {
      onProceedToCheckout();
    }
    navigate('/checkout');
  };

  const toggleAccordion = (sec: string) => {
    setOpenAccordion(openAccordion === sec ? null : sec);
  };

  const relatedProducts = products.filter(p => p.id !== product.id && p.category === product.category).slice(0, 4);

  const handleRelatedSelect = (rel: Product) => {
    if (onSelectProduct) {
      onSelectProduct(rel);
    }
    navigate(`/product/${rel.id}`);
  };

  return (
    <div className="py-8 sm:py-12 bg-[#FAF8F1] animate-fadeIn pb-28 lg:pb-12">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        <div className="text-[10px] sm:text-xs text-[#6B5846] uppercase tracking-wider mb-6 sm:mb-8">
          <span className="cursor-pointer hover:underline" onClick={() => navigate('/')}>Home</span> <span className="mx-1">•</span>
          <span className="cursor-pointer hover:underline" onClick={() => navigate(`/shop/category/${product.category}`)}>{product.category}</span> <span className="mx-1">•</span>
          <span className="text-[#12372A] font-bold">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-12 sm:mb-16">
          
          <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-3 sm:gap-4">
            <div className="flex md:flex-col gap-2.5 sm:gap-3 overflow-x-auto md:overflow-y-auto shrink-0 max-h-[600px] pb-2 md:pb-0">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-16 sm:w-20 aspect-[3/4] border rounded-xl overflow-hidden shrink-0 transition-all ${
                    selectedImage === idx ? 'border-[#12372A] ring-2 ring-[#12372A]' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={getOptimizedImageUrl(img, { width: 160, quality: 75 })}
                    alt="Product view thumbnail"
                    className="w-full h-full object-cover rounded-xl"
                    loading="lazy"
                    decoding="async"
                    onError={handleImageError}
                  />
                </button>
              ))}
            </div>

            <div className="flex-1 aspect-[3/4] bg-[#FAF8F1] border border-[#E8DDC7] rounded-3xl overflow-hidden relative group shadow-sm">
              <img
                src={getOptimizedImageUrl(product.images[selectedImage] || product.images[0], { width: 900, quality: 80 })}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 rounded-3xl"
                loading="eager"
                decoding="async"
                onError={handleImageError}
              />
              <span className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-[#12372A] text-[#FAF8F1] text-[8px] sm:text-[9px] uppercase tracking-widest font-bold px-3 py-1 rounded-full border border-[#D4AF37] shadow-xs">
                Kuthampully GI Handloom Tag
              </span>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-5 sm:space-y-6 bg-white p-5 sm:p-8 border border-[#E8DDC7] rounded-3xl shadow-xs self-start">
            
            <div>
              <div className="flex items-center justify-between text-[11px] sm:text-xs text-[#6B5846] font-semibold uppercase tracking-wider mb-2">
                <span>{product.subcategory} • {product.collection.replace('-', ' ')}</span>
                <div className="flex items-center gap-1 text-[#D4AF37]">
                  <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-[#D4AF37]" />
                  <span className="font-bold">{product.rating}</span>
                  <span className="text-gray-400">({product.reviewCount})</span>
                </div>
              </div>

              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#12372A] leading-tight">
                {product.name}
              </h1>
              <p className="text-xs text-[#6B5846] mt-1">{product.subtitle}</p>

              <div className="mt-4 flex items-baseline gap-3 pt-3 border-t border-[#FAF8F1]">
                <span className="font-sans text-2xl sm:text-3xl font-bold text-[#12372A]">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-gray-400 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
                {product.discountPercentage && (
                  <span className="bg-[#D4AF37] text-[#12372A] text-[10px] sm:text-xs font-bold uppercase px-2.5 py-0.5 rounded-full">
                    Save {product.discountPercentage}%
                  </span>
                )}
              </div>
              <p className="text-[10px] sm:text-[11px] text-[#6B5846] mt-1">Inclusive of all taxes. Free shipping over {formatPrice(2000)}.</p>
            </div>

            <div className="space-y-2 pt-2 border-t border-[#E8DDC7]/60">
              <span className="text-xs uppercase font-semibold text-[#171717] tracking-wider block">
                Color Accent: <strong className="text-[#12372A]">{selectedColor.name}</strong>
              </span>
              <div className="flex gap-2">
                {product.colors.map(c => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c)}
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 transition-transform ${
                      selectedColor.name === c.name ? 'border-[#12372A] scale-110' : 'border-gray-300 hover:scale-105'
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-[#E8DDC7]/60">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-semibold text-[#171717] tracking-wider">Select Size</span>
                <button
                  onClick={() => openSizeGuide(product)}
                  className="text-xs text-[#D4AF37] hover:underline flex items-center gap-1 font-semibold"
                >
                  <Ruler className="w-3.5 h-3.5" />
                  <span>Size &amp; Measurement Guide</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {product.sizes.map(sz => (
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

            <div className="pt-2 border-t border-[#E8DDC7]/60 flex items-center gap-4">
              <span className="text-xs uppercase font-semibold text-[#171717] tracking-wider">Quantity:</span>
              <div className="flex items-center border border-[#E8DDC7] bg-[#FAF8F1] rounded-xl overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1.5 text-xs font-bold hover:bg-[#E8DDC7]"
                >
                  -
                </button>
                <span className="px-4 py-1.5 text-xs font-bold text-[#12372A]">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1.5 text-xs font-bold hover:bg-[#E8DDC7]"
                >
                  +
                </button>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-[#E8DDC7]">
              <div className="flex gap-2 sm:gap-3">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-[#12372A] text-[#FAF8F1] hover:bg-[#D4AF37] hover:text-[#12372A] py-3.5 sm:py-4 text-xs font-bold uppercase tracking-widest transition-all rounded-xl flex items-center justify-center gap-2 border border-[#D4AF37] shadow-md"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Shopping Bag</span>
                </button>

                <button
                  onClick={() => toggleWishlist(product)}
                  className={`p-3.5 sm:p-4 border border-[#E8DDC7] hover:border-[#12372A] transition-all rounded-xl ${
                    isFavorite ? 'bg-[#12372A] text-[#D4AF37]' : 'bg-white text-[#171717]'
                  }`}
                  title="Wishlist"
                >
                  <Heart className={`w-4 h-4 ${isFavorite ? 'fill-[#D4AF37]' : ''}`} />
                </button>
              </div>

              <button
                onClick={handleBuyNow}
                className="w-full bg-[#D4AF37] text-[#12372A] hover:bg-[#FAF8F1] py-3.5 text-xs font-bold uppercase tracking-widest transition-all rounded-xl border border-[#12372A]"
              >
                Buy Now (Express Checkout)
              </button>
            </div>

            <div className="pt-4 border-t border-[#E8DDC7] space-y-2 text-xs">
              
              <div className="border border-[#E8DDC7] rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleAccordion('details')}
                  className="w-full p-3 bg-[#FAF8F1] flex justify-between items-center font-bold text-[#12372A]"
                >
                  <span>Product Details &amp; Craftsmanship</span>
                  {openAccordion === 'details' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openAccordion === 'details' && (
                  <div className="p-4 space-y-2 text-[#6B5846] bg-white border-t border-[#E8DDC7]">
                    <ul className="list-disc pl-4 space-y-1">
                      {product.details.map((d, i) => (
                        <li key={i}>{d}</li>
                      ))}
                    </ul>
                    <p className="pt-2 text-[11px] font-semibold text-[#12372A]">SKU: {product.sku}</p>
                  </div>
                )}
              </div>

              <div className="border border-[#E8DDC7] rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleAccordion('care')}
                  className="w-full p-3 bg-[#FAF8F1] flex justify-between items-center font-bold text-[#12372A]"
                >
                  <span>Fabric Composition &amp; Care Instructions</span>
                  {openAccordion === 'care' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openAccordion === 'care' && (
                  <div className="p-4 space-y-2 text-[#6B5846] bg-white border-t border-[#E8DDC7]">
                    <p><strong>Fabric:</strong> {product.fabric}</p>
                    <ul className="list-disc pl-4 space-y-1 mt-1">
                      {product.careInstructions.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="border border-[#E8DDC7] rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleAccordion('shipping')}
                  className="w-full p-3 bg-[#FAF8F1] flex justify-between items-center font-bold text-[#12372A]"
                >
                  <span>Shipping, Delivery &amp; Returns</span>
                  {openAccordion === 'shipping' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openAccordion === 'shipping' && (
                  <div className="p-4 space-y-2 text-[#6B5846] bg-white border-t border-[#E8DDC7]">
                    <p>• Complimentary shipping on orders above {formatPrice(2000)}.</p>
                    <p>• Dispatch within 24-48 hours from Kuthampully via BlueDart Air Express.</p>
                    <p>• 7-day hassle-free size exchange concierge service.</p>
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>

        <div className="border-t border-[#E8DDC7] pt-8 sm:pt-12 mb-12 sm:mb-16">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-3">
            <div>
              <span className="text-[10px] sm:text-xs uppercase tracking-widest text-[#D4AF37] font-bold block mb-1">
                Patron Feedback
              </span>
              <h2 className="font-serif text-xl sm:text-3xl font-bold text-[#12372A]">
                Customer Reviews ({reviews.length})
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-[#D4AF37] text-base sm:text-lg font-bold">
                <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-[#D4AF37]" />
                <span>{product.rating} / 5.0</span>
              </div>
              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="bg-[#12372A] text-[#FAF8F1] hover:bg-[#D4AF37] hover:text-[#12372A] px-4 py-2 text-xs font-bold uppercase rounded-xl transition-all border border-[#D4AF37]"
              >
                {showReviewForm ? 'Cancel' : '✍️ Write a Review'}
              </button>
            </div>
          </div>

          {showReviewForm && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (newReviewTitle && newReviewComment) {
                  addReview({
                    productId: product.id,
                    title: newReviewTitle,
                    comment: newReviewComment,
                    rating: newReviewRating,
                    author: 'Verified Buyer',
                    location: 'Kerala, India'
                  });
                  setNewReviewTitle('');
                  setNewReviewComment('');
                  setShowReviewForm(false);
                  alert('Thank you! Your review has been submitted successfully.');
                }
              }}
              className="bg-white p-5 border border-[#D4AF37] rounded-2xl mb-6 space-y-3 text-xs shadow-md"
            >
              <h4 className="font-serif font-bold text-sm text-[#12372A]">Write Your Garment Review</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#6B5846] mb-1">Review Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Stunning Zari & Breathable Fabric"
                    value={newReviewTitle}
                    onChange={(e) => setNewReviewTitle(e.target.value)}
                    className="w-full border border-[#E8DDC7] p-2.5 rounded-xl bg-[#FAF8F1]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#6B5846] mb-1">Rating (1 to 5 Stars)</label>
                  <select
                    value={newReviewRating}
                    onChange={(e) => setNewReviewRating(Number(e.target.value))}
                    className="w-full border border-[#E8DDC7] p-2.5 rounded-xl bg-[#FAF8F1] font-bold"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ 5 Stars - Excellent</option>
                    <option value={4}>⭐⭐⭐⭐ 4 Stars - Very Good</option>
                    <option value={3}>⭐⭐⭐ 3 Stars - Average</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block font-semibold text-[#6B5846] mb-1">Detailed Review Comment</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Share details about fit, feel, texture, and occasion..."
                  value={newReviewComment}
                  onChange={(e) => setNewReviewComment(e.target.value)}
                  className="w-full border border-[#E8DDC7] p-2.5 rounded-xl bg-[#FAF8F1]"
                />
              </div>
              <button
                type="submit"
                className="bg-[#12372A] text-[#FAF8F1] px-6 py-2.5 font-bold uppercase text-xs rounded-xl hover:bg-[#D4AF37] hover:text-[#12372A] transition-all"
              >
                Submit Verified Review
              </button>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {reviews.map(rev => (
              <div key={rev.id} className="bg-white p-5 border border-[#E8DDC7] rounded-2xl shadow-xs">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-serif font-bold text-[#12372A] text-sm">{rev.title}</h4>
                    <span className="text-[10px] text-[#6B5846]">{rev.author} • {rev.location}</span>
                  </div>
                  <div className="flex text-[#D4AF37]">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#D4AF37]" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-[#6B5846] leading-relaxed italic">{rev.comment}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-[#E8DDC7] pt-8 sm:pt-12">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#12372A] mb-6">You May Also Admire</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map(rel => (
              <ProductCard key={rel.id} product={rel} onSelectProduct={handleRelatedSelect} />
            ))}
          </div>
        </div>

      </div>

      <div className="lg:hidden fixed bottom-[50px] left-0 right-0 z-30 bg-[#12372A] text-[#FAF8F1] p-3 flex items-center justify-between shadow-2xl">
        <div>
          <span className="text-[9px] text-[#D4AF37] block font-bold uppercase line-clamp-1">{product.name}</span>
          <span className="font-bold text-xs">{formatPrice(product.price)}</span>
        </div>
        <button
          onClick={handleAddToCart}
          className="bg-[#D4AF37] text-[#12372A] px-4 py-2 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 border border-[#12372A] rounded-xl"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Add to Bag</span>
        </button>
      </div>

    </div>
  );
};
