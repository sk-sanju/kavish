'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Star, ShoppingBag, Heart, Ruler, ChevronDown, ChevronUp, ZoomIn, Check, ShieldCheck, Truck, RefreshCw, MapPin, Sparkles, Send } from 'lucide-react';
import type { Product, ProductColor } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useModal } from '../context/ModalContext';
import { useCurrency } from '../context/CurrencyContext';
import { useProducts } from '../context/ProductContext';
import { ProductCard } from '../components/product/ProductCard';
import { OptimizedImage } from '../components/common/OptimizedImage';

interface ProductDetailProps {
  product?: Product | null;
  onSelectProduct?: (product: Product) => void;
  onProceedToCheckout?: () => void;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ product: propProduct, onSelectProduct, onProceedToCheckout }) => {
  const params = useParams() as { id?: string };
  const router = useRouter();
  const { products, reviews, addReview } = useProducts();

  const targetId = params.id || propProduct?.id;
  const product = propProduct || (targetId ? products.find(p => p.id === targetId) : null) || (targetId ? undefined : products[0]);

  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewTitle, setNewReviewTitle] = useState('');
  const [newReviewComment, setNewReviewComment] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Pincode Check
  const [pincode, setPincode] = useState('');
  const [deliveryStatus, setDeliveryStatus] = useState<string | null>(null);

  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { openSizeGuide } = useModal();
  const { formatPrice } = useCurrency();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || 'Free Size');
  const [selectedColor, setSelectedColor] = useState<ProductColor>(product?.colors?.[0] || { name: 'Kasavu Gold', hex: '#B99A61' });
  const [quantity, setQuantity] = useState(1);
  const [openAccordion, setOpenAccordion] = useState<string | null>('details');

  if (!product) {
    return (
      <div className="py-28 bg-[#F8F5EF] text-center px-4 animate-fadeIn">
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#641E2B]">Garment Not Found</h2>
        <p className="text-xs text-[#6E685D] mt-2 mb-6">The requested handloom garment is currently not available or catalog is syncing.</p>
        <button
          onClick={() => router.push('/shop')}
          className="bg-[#641E2B] text-[#F8F5EF] px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-[#B99A61] hover:text-[#46141D] transition-all cursor-pointer"
        >
          Explore Atelier Collection
        </button>
      </div>
    );
  }

  const isFavorite = isInWishlist(product.id);
  const isOutOfStock = !product.inStock && !product.allowBackorders;
  const maxStock = product.allowBackorders ? 99 : (product.stockCount ?? 10);
  const isLowStock = !isOutOfStock && product.stockCount != null && product.stockCount > 0 && product.stockCount <= (product.lowStockThreshold || 5);

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, selectedSize, selectedColor, quantity);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addToCart(product, selectedSize, selectedColor, quantity);
    if (onProceedToCheckout) {
      onProceedToCheckout();
    }
    router.push('/checkout');
  };

  const toggleAccordion = (sec: string) => {
    setOpenAccordion(openAccordion === sec ? null : sec);
  };

  const handlePincodeCheck = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = pincode.replace(/\D/g, '');
    if (clean.length === 6) {
      setDeliveryStatus(`Express Delivery available to ${clean} within 4-7 business days.`);
    } else {
      setDeliveryStatus('Please enter a valid 6-digit Indian PIN code.');
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewComment.trim() || !newReviewAuthor.trim()) return;

    addReview({
      id: `rev-${Date.now()}`,
      productId: product.id,
      productName: product.name,
      author: newReviewAuthor,
      location: 'India',
      rating: newReviewRating,
      title: newReviewTitle || 'Exquisite Kerala Weave',
      comment: newReviewComment,
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      verifiedPurchase: true,
      verified: true,
      helpfulCount: 0,
      status: 'Approved'
    });

    setReviewSubmitted(true);
    setNewReviewAuthor('');
    setNewReviewTitle('');
    setNewReviewComment('');
    setShowReviewForm(false);
  };

  const relatedProducts = products.filter(p => p.id !== product.id && p.category === product.category).slice(0, 4);

  const handleRelatedSelect = (rel: Product) => {
    if (onSelectProduct) {
      onSelectProduct(rel);
    }
    router.push(`/product/${rel.id}`);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPosition({ x, y });
  };

  const productReviews = reviews.filter(r => !r.productId || r.productId === product.id);

  return (
    <div className="py-8 sm:py-12 bg-[#F8F5EF] animate-fadeIn pb-28 lg:pb-16">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <div className="text-[10px] sm:text-xs text-[#6E685D] uppercase tracking-wider mb-6 sm:mb-8 font-medium">
          <span className="cursor-pointer hover:underline text-[#292522]" onClick={() => router.push('/')}>Home</span> <span className="mx-1.5">•</span>
          <span className="cursor-pointer hover:underline text-[#292522]" onClick={() => router.push(`/shop/category/${product.category}`)}>{product.category}</span> <span className="mx-1.5">•</span>
          <span className="text-[#641E2B] font-bold">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-12 sm:mb-16">
          
          {/* LEFT: Product Images with Zoom */}
          <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-3 sm:gap-4">
            {/* Thumbnails column */}
            <div className="flex md:flex-col gap-2.5 sm:gap-3 overflow-x-auto md:overflow-y-auto shrink-0 max-h-[600px] pb-2 md:pb-0">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-16 sm:w-20 aspect-[3/4] border rounded-xl overflow-hidden shrink-0 transition-all cursor-pointer ${
                    selectedImage === idx ? 'border-[#641E2B] ring-2 ring-[#B99A61]' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <OptimizedImage
                    src={img}
                    alt={`${product.name} thumbnail view ${idx + 1}`}
                    preset="thumbnail"
                    aspectRatio="3/4"
                    containerClassName="w-full h-full rounded-xl"
                  />
                </button>
              ))}
            </div>

            {/* Main Stage with Zoom Lens */}
            <div
              className="flex-1 aspect-[3/4] bg-white border border-[#E8DFD0] rounded-3xl overflow-hidden relative group shadow-sm cursor-crosshair"
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
              onMouseMove={handleMouseMove}
            >
              <OptimizedImage
                src={product.images[selectedImage] || product.images[0]}
                alt={`${product.name} - ${product.fabric} Atelier Weave`}
                preset="detail"
                priority={true}
                aspectRatio="3/4"
                containerClassName="w-full h-full rounded-3xl"
                imageClassName={`transition-transform duration-200 ${isZoomed ? 'scale-150' : 'scale-100'}`}
                style={isZoomed ? { transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%` } : undefined}
              />

              <span className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-[#641E2B] text-[#F8F5EF] text-[8px] sm:text-[9px] uppercase tracking-widest font-bold px-3 py-1 rounded-full border border-[#B99A61] shadow-xs z-10">
                100% Kuthampully Handloom GI Tag
              </span>

              <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-xs text-[#641E2B] px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 shadow-xs border border-black/5 opacity-80 group-hover:opacity-100 transition-opacity">
                <ZoomIn className="w-3.5 h-3.5 text-[#B99A61]" />
                <span>Hover to Zoom</span>
              </div>
            </div>
          </div>

          {/* RIGHT: Product Details & Purchase Controls */}
          <div className="lg:col-span-5 space-y-5 sm:space-y-6 bg-white p-5 sm:p-8 border border-[#E8DFD0] rounded-3xl shadow-xs self-start">
            
            <div>
              <div className="flex items-center justify-between text-[11px] sm:text-xs text-[#6E685D] font-semibold uppercase tracking-wider mb-2">
                <span>{product.subcategory} • {product.collection.replace('-', ' ')}</span>
                <div className="flex items-center gap-1 text-[#B99A61]">
                  <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-[#B99A61]" />
                  <span className="font-bold text-[#641E2B]">{product.rating}</span>
                  <span className="text-gray-400">({product.reviewCount || productReviews.length})</span>
                </div>
              </div>

              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#641E2B] leading-tight">
                {product.name}
              </h1>
              <p className="text-xs text-[#6E685D] mt-1 font-light leading-relaxed">{product.subtitle}</p>

              {/* Pricing Line */}
              <div className="mt-4 flex items-baseline gap-3 pt-3 border-t border-[#F8F5EF]">
                <span className="font-sans text-2xl sm:text-3xl font-bold text-[#641E2B]">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-sm text-gray-400 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
                {product.discountPercentage && (
                  <span className="bg-[#B99A61] text-[#46141D] text-[10px] sm:text-xs font-bold uppercase px-2.5 py-0.5 rounded-full">
                    Save {product.discountPercentage}%
                  </span>
                )}
              </div>
              <p className="text-[10px] sm:text-[11px] text-[#6E685D] mt-1">Inclusive of GST taxes. Complimentary express delivery above {formatPrice(2000)}.</p>
            </div>

            {/* Colors Selection */}
            <div className="space-y-2 pt-2 border-t border-[#E8DFD0]/60">
              <span className="text-xs uppercase font-semibold text-[#292522] tracking-wider block">
                Zari &amp; Color Accent: <strong className="text-[#641E2B]">{selectedColor.name}</strong>
              </span>
              <div className="flex gap-2">
                {product.colors.map(c => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c)}
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 transition-transform cursor-pointer ${
                      selectedColor.name === c.name ? 'border-[#641E2B] ring-2 ring-[#B99A61] scale-110' : 'border-gray-300 hover:scale-105'
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  />
                ))}
              </div>
            </div>

            {/* Sizes Selection */}
            <div className="space-y-2 pt-2 border-t border-[#E8DFD0]/60">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-semibold text-[#292522] tracking-wider">Select Size</span>
                <button
                  onClick={() => openSizeGuide(product)}
                  className="text-xs text-[#B99A61] hover:underline flex items-center gap-1 font-semibold cursor-pointer"
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
                    className={`px-3.5 py-2 text-xs border rounded-xl transition-all cursor-pointer ${
                      selectedSize === sz
                        ? 'bg-[#641E2B] text-[#F8F5EF] border-[#641E2B] font-bold shadow-xs'
                        : 'bg-white text-[#292522] border-[#E8DFD0] hover:border-[#B99A61]'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Stock Status Indicator */}
            {isOutOfStock ? (
              <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs font-semibold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-600 inline-block animate-ping" />
                <span>Currently Sold Out. Crafting more on traditional Kuthampully handlooms.</span>
              </div>
            ) : isLowStock ? (
              <div className="p-2.5 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-xs font-semibold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-600 inline-block" />
                <span>Only {product.stockCount} left in atelier stock — order soon!</span>
              </div>
            ) : (
              <div className="p-2 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-700" />
                <span>In Stock &amp; Ready for Express Dispatch</span>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="pt-2 border-t border-[#E8DFD0]/60 flex items-center gap-4">
              <span className="text-xs uppercase font-semibold text-[#292522] tracking-wider">Quantity:</span>
              <div className="flex items-center border border-[#E8DFD0] bg-[#F8F5EF] rounded-xl overflow-hidden">
                <button
                  type="button"
                  disabled={isOutOfStock || quantity <= 1}
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1.5 text-xs font-bold hover:bg-[#E8DFD0] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  -
                </button>
                <span className="px-4 py-1.5 text-xs font-bold text-[#641E2B]">{isOutOfStock ? 0 : quantity}</span>
                <button
                  type="button"
                  disabled={isOutOfStock || (!product.allowBackorders && quantity >= maxStock)}
                  onClick={() => setQuantity(Math.min(!product.allowBackorders ? maxStock : 99, quantity + 1))}
                  className="px-3 py-1.5 text-xs font-bold hover:bg-[#E8DFD0] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

            {/* Cart & Buy Buttons */}
            <div className="space-y-3 pt-4 border-t border-[#E8DFD0]">
              <div className="flex gap-2 sm:gap-3">
                <button
                  type="button"
                  disabled={isOutOfStock}
                  onClick={handleAddToCart}
                  className={`flex-1 py-3.5 sm:py-4 text-xs font-bold uppercase tracking-widest transition-all rounded-xl flex items-center justify-center gap-2 border shadow-md cursor-pointer ${
                    isOutOfStock
                      ? 'bg-gray-200 text-gray-500 border-gray-300 cursor-not-allowed shadow-none'
                      : 'bg-[#641E2B] text-[#F8F5EF] hover:bg-[#B99A61] hover:text-[#46141D] border-[#B99A61]'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{isOutOfStock ? 'Sold Out' : 'Add to Shopping Bag'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => toggleWishlist(product)}
                  className={`p-3.5 sm:p-4 border border-[#E8DFD0] hover:border-[#641E2B] transition-all rounded-xl cursor-pointer ${
                    isFavorite ? 'bg-[#641E2B] text-[#B99A61]' : 'bg-white text-[#292522]'
                  }`}
                  title="Wishlist"
                >
                  <Heart className={`w-4 h-4 ${isFavorite ? 'fill-[#B99A61]' : ''}`} />
                </button>
              </div>

              <button
                type="button"
                disabled={isOutOfStock}
                onClick={handleBuyNow}
                className={`w-full py-3.5 text-xs font-bold uppercase tracking-widest transition-all rounded-xl border cursor-pointer ${
                  isOutOfStock
                    ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                    : 'bg-[#B99A61] text-[#46141D] hover:bg-[#F8F5EF] border-[#641E2B] shadow-sm'
                }`}
              >
                {isOutOfStock ? 'Unavailable' : 'Buy Now (Instant Checkout)'}
              </button>
            </div>

            {/* Pincode Estimator */}
            <div className="pt-3 border-t border-[#E8DFD0]">
              <form onSubmit={handlePincodeCheck} className="flex gap-2">
                <div className="relative flex-1">
                  <MapPin className="w-3.5 h-3.5 text-[#B99A61] absolute left-3 top-3" />
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="Enter 6-digit PIN code"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-[#F8F5EF] border border-[#E8DFD0] rounded-xl text-xs text-[#292522] focus:outline-none focus:border-[#B99A61]"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#641E2B] text-[#F8F5EF] hover:bg-[#B99A61] hover:text-[#46141D] text-xs font-bold uppercase rounded-xl transition-all cursor-pointer"
                >
                  Check
                </button>
              </form>
              {deliveryStatus && (
                <p className="text-[11px] text-[#641E2B] font-medium mt-1.5 flex items-center gap-1">
                  <Truck className="w-3 h-3 text-[#B99A61]" /> {deliveryStatus}
                </p>
              )}
            </div>

            {/* Guarantee Badges */}
            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[#E8DFD0] text-center text-[10px] text-[#6E685D]">
              <div className="p-2 rounded-xl bg-[#F8F5EF]">
                <ShieldCheck className="w-4 h-4 mx-auto mb-1 text-[#B99A61]" />
                <span>GI Tag Certified</span>
              </div>
              <div className="p-2 rounded-xl bg-[#F8F5EF]">
                <Truck className="w-4 h-4 mx-auto mb-1 text-[#B99A61]" />
                <span>4-10 Days Express</span>
              </div>
              <div className="p-2 rounded-xl bg-[#F8F5EF]">
                <RefreshCw className="w-4 h-4 mx-auto mb-1 text-[#B99A61]" />
                <span>Easy Exchange</span>
              </div>
            </div>

            {/* Accordion Tabs */}
            <div className="pt-4 border-t border-[#E8DFD0] space-y-2 text-xs">
              
              <div className="border border-[#E8DFD0] rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleAccordion('details')}
                  className="w-full p-3 bg-[#F8F5EF] flex justify-between items-center font-bold text-[#641E2B] cursor-pointer"
                >
                  <span>Product Details &amp; Specifications</span>
                  {openAccordion === 'details' ? <ChevronUp className="w-4 h-4 text-[#B99A61]" /> : <ChevronDown className="w-4 h-4 text-[#B99A61]" />}
                </button>
                {openAccordion === 'details' && (
                  <div className="p-4 space-y-2 text-[#6E685D] bg-white border-t border-[#E8DFD0]">
                    <p><strong>Fabric:</strong> {product.fabric}</p>
                    <p><strong>Brand / Atelier:</strong> {product.brand || 'Kavish Kuthampully Atelier'}</p>
                    <p><strong>Weave Type:</strong> Traditional Non-Motorized Pit Loom</p>
                    <p><strong>Certification:</strong> Geographical Indication (GI Tag 2011)</p>
                    <p><strong>Fit:</strong> {product.fitInformation || 'Standard Traditional Fit'}</p>
                    <ul className="list-disc pl-4 space-y-1 mt-2">
                      {product.details.map((d, i) => (
                        <li key={i}>{d}</li>
                      ))}
                    </ul>
                    <p className="pt-2 text-[11px] font-semibold text-[#641E2B]">SKU: {product.sku}</p>
                  </div>
                )}
              </div>

              <div className="border border-[#E8DFD0] rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleAccordion('care')}
                  className="w-full p-3 bg-[#F8F5EF] flex justify-between items-center font-bold text-[#641E2B] cursor-pointer"
                >
                  <span>Care Instructions &amp; Zari Preservation</span>
                  {openAccordion === 'care' ? <ChevronUp className="w-4 h-4 text-[#B99A61]" /> : <ChevronDown className="w-4 h-4 text-[#B99A61]" />}
                </button>
                {openAccordion === 'care' && (
                  <div className="p-4 space-y-2 text-[#6E685D] bg-white border-t border-[#E8DFD0]">
                    <ul className="list-disc pl-4 space-y-1">
                      {product.careInstructions.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                    <p className="text-[11px] italic mt-2">Store folded in muslin cloth. Avoid spraying perfume directly onto metallic zari borders.</p>
                  </div>
                )}
              </div>

              <div className="border border-[#E8DFD0] rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleAccordion('shipping')}
                  className="w-full p-3 bg-[#F8F5EF] flex justify-between items-center font-bold text-[#641E2B] cursor-pointer"
                >
                  <span>Complimentary Shipping &amp; 7-Day Exchange</span>
                  {openAccordion === 'shipping' ? <ChevronUp className="w-4 h-4 text-[#B99A61]" /> : <ChevronDown className="w-4 h-4 text-[#B99A61]" />}
                </button>
                {openAccordion === 'shipping' && (
                  <div className="p-4 space-y-2 text-[#6E685D] bg-white border-t border-[#E8DFD0] text-[11px]">
                    <p>• Complimentary express dispatch across India on orders above ₹2,000.</p>
                    <p>• Carefully packed in Kavish gold-embossed keepsake garment boxes.</p>
                    <p>• Hassle-free 7-day doorstep size exchange concierge.</p>
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>

        {/* Customer Reviews Section */}
        <div className="mt-16 bg-white p-6 sm:p-10 border border-[#E8DFD0] rounded-3xl shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#E8DFD0] gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#641E2B]">Patron Reviews</h3>
                <span className="text-sm font-semibold bg-[#B99A61]/20 text-[#641E2B] px-2.5 py-0.5 rounded-full">
                  {productReviews.length}
                </span>
              </div>
              <p className="text-xs text-[#6E685D] mt-1">Verified experiences from lovers of authentic Kerala handlooms.</p>
            </div>

            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="px-5 py-2.5 bg-[#641E2B] text-[#F8F5EF] hover:bg-[#B99A61] hover:text-[#46141D] text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer self-start sm:self-auto"
            >
              {showReviewForm ? 'Cancel Review' : 'Write a Review'}
            </button>
          </div>

          {/* Review Submission Form */}
          {showReviewForm && (
            <form onSubmit={handleReviewSubmit} className="my-6 p-6 bg-[#F8F5EF] border border-[#B99A61]/30 rounded-2xl space-y-4 animate-fadeIn">
              <h4 className="font-serif font-bold text-lg text-[#641E2B]">Share Your Experience</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#292522] mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Parvathy Nair"
                    value={newReviewAuthor}
                    onChange={(e) => setNewReviewAuthor(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#E8DFD0] rounded-xl text-xs text-[#292522] focus:outline-none focus:border-[#B99A61]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#292522] mb-1">Review Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Exquisite Kasavu Zari & Draping"
                    value={newReviewTitle}
                    onChange={(e) => setNewReviewTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#E8DFD0] rounded-xl text-xs text-[#292522] focus:outline-none focus:border-[#B99A61]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#292522] mb-1">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setNewReviewRating(star)}
                      className="cursor-pointer"
                    >
                      <Star className={`w-5 h-5 ${star <= newReviewRating ? 'fill-[#B99A61] text-[#B99A61]' : 'text-gray-300'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#292522] mb-1">Your Thoughts *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe the fabric quality, weave feel, and drape..."
                  value={newReviewComment}
                  onChange={(e) => setNewReviewComment(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#E8DFD0] rounded-xl text-xs text-[#292522] focus:outline-none focus:border-[#B99A61]"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 bg-[#641E2B] text-[#F8F5EF] font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[#B99A61] hover:text-[#46141D] transition-all flex items-center gap-2 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Verified Review</span>
              </button>
            </form>
          )}

          {reviewSubmitted && (
            <div className="my-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-medium">
              Thank you for sharing your experience. Your review has been submitted to the atelier.
            </div>
          )}

          {/* Reviews List */}
          <div className="divide-y divide-[#E8DFD0]/60 mt-6">
            {productReviews.length === 0 ? (
              <p className="text-xs text-[#6E685D] py-6 italic text-center">Be the first to review this artisanal handloom creation.</p>
            ) : (
              productReviews.map(r => (
                <div key={r.id} className="py-4 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-[#641E2B]">{r.author}</span>
                    <span className="text-[10px] text-[#6E685D]">{r.date}</span>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(r.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-[#B99A61] text-[#B99A61]" />
                    ))}
                  </div>
                  {r.title && <h5 className="font-semibold text-xs text-[#292522]">{r.title}</h5>}
                  <p className="text-xs text-[#6E685D] leading-relaxed">{r.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Related Products Recommendation */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <div className="mb-6">
              <span className="text-xs uppercase tracking-widest text-[#B99A61] font-bold block">
                Atelier Recommendations
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#641E2B] mt-1">
                You May Also Admire
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map(rel => (
                <ProductCard
                  key={rel.id}
                  product={rel}
                  onSelect={handleRelatedSelect}
                />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
