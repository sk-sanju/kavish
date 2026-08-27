import type { Product } from '../types';

// Curated seed catalog displayed immediately on frame 1 while Supabase syncs in the background
export const PRODUCTS: Product[] = [
  {
    id: 'kav-w-01',
    name: 'Kuthampully Royal 24k Gold Kasavu Saree',
    subtitle: '100% Pure Cotton with Temple Border Zari',
    category: 'women',
    subcategory: 'Kasavu Sarees',
    collection: 'kasavu-masterpieces',
    price: 4999,
    originalPrice: 6499,
    discountPercentage: 23,
    rating: 4.9,
    reviewCount: 48,
    inStock: true,
    stockCount: 15,
    isNew: true,
    isBestSeller: true,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=75',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=75'
    ],
    sizes: ['Free Size (6.25m with Blouse)'],
    colors: [
      { name: 'Pure Kasavu Gold', hex: '#D4AF37' },
      { name: 'Temple Red & Gold', hex: '#8B0000' }
    ],
    fabric: '100% Organic Handloom Cotton & Gold Zari',
    details: [
      'Authentic Kuthampully GI Certified Weave',
      'Woven by master Devanga heritage weavers',
      'Unbleached eco-friendly soft combed cotton',
      'Matching running blouse piece included'
    ],
    careInstructions: ['Dry Clean recommended for first wash', 'Gentle cold hand wash afterwards', 'Iron on reverse side at moderate heat'],
    fitInformation: 'Classic traditional drape, 6.25 meters length with matching blouse',
    sku: 'KV-KUT-001',
    tags: ['Kuthampully', 'Kasavu', 'GI Tag', 'Handloom', 'Wedding', 'Onam']
  },
  {
    id: 'kav-m-01',
    name: "Men's Royal Kasavu Double Mundu & Angavastram",
    subtitle: 'Classic Kuthampully Double Mundu Set',
    category: 'men',
    subcategory: 'Mundu & Dhoti',
    collection: 'mens-regal-edit',
    price: 2499,
    originalPrice: 3199,
    discountPercentage: 22,
    rating: 5.0,
    reviewCount: 32,
    inStock: true,
    stockCount: 20,
    isNew: true,
    isBestSeller: true,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=75'
    ],
    sizes: ['Double (4.0m Mundu + 2.5m Melmundu)'],
    colors: [
      { name: 'Off-White Gold Border', hex: '#D4AF37' }
    ],
    fabric: '100% High Count Kerala Combed Cotton',
    details: [
      'Traditional 3-inch gold zari woven border (Kara)',
      'Featherlight breathable weave for ceremonies and weddings',
      'Pre-washed for instant comfort'
    ],
    careInstructions: ['Hand wash in cold water with mild detergent', 'Do not wring tightly', 'Line dry in shade'],
    fitInformation: 'Standard double mundu fit with matching shoulder wrap (Melmundu)',
    sku: 'KV-MND-002',
    tags: ['Mundu', 'Men', 'Kasavu', 'Traditional', 'Kerala Wedding']
  },
  {
    id: 'kav-w-02',
    name: 'Heirloom Tissue Silk Bridal Kasavu Saree',
    subtitle: 'Full Gold Tissue Weave with Peacock Motif Pallu',
    category: 'women',
    subcategory: 'Bridal Heritage',
    collection: 'festive-heritage',
    price: 8999,
    originalPrice: 11999,
    discountPercentage: 25,
    rating: 5.0,
    reviewCount: 19,
    inStock: true,
    stockCount: 8,
    isNew: true,
    isBestSeller: false,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=75',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=75'
    ],
    sizes: ['Free Size (6.25m)'],
    colors: [
      { name: 'Imperial Gold', hex: '#FFD700' }
    ],
    fabric: 'Pure Tissue Silk & 24k Tested Zari',
    details: [
      'Intricate Mayil (Peacock) and Lotus jacquard motifs',
      'Handcrafted for bridal ceremonies & royal occasions',
      'Certified authentic Kerala handloom stamp'
    ],
    careInstructions: ['Dry Clean Only', 'Store in cotton saree bag'],
    fitInformation: 'Structured luxury drape with heavy embellished pallu',
    sku: 'KV-BRD-003',
    tags: ['Bridal', 'Tissue Silk', 'Kasavu', 'Gold Zari']
  },
  {
    id: 'kav-m-02',
    name: 'European Tailored Unbleached Linen Shirt',
    subtitle: 'Mandarin Collar Long Sleeve Ceremonial Shirt',
    category: 'men',
    subcategory: 'Linen Shirts',
    collection: 'mens-regal-edit',
    price: 3299,
    originalPrice: 3999,
    discountPercentage: 17,
    rating: 4.8,
    reviewCount: 27,
    inStock: true,
    stockCount: 14,
    isNew: false,
    isBestSeller: true,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=75'
    ],
    sizes: ['38 (M)', '40 (L)', '42 (XL)', '44 (XXL)'],
    colors: [
      { name: 'Natural Ecru', hex: '#F5EFEB' },
      { name: 'Kuthampully Sand', hex: '#E8DDC7' }
    ],
    fabric: '100% European Organic Linen (60 Lea Count)',
    details: [
      'Naturally cooling and breathable texture',
      'Mother-of-pearl buttons with reinforced stitching',
      'Tailored regular fit paired seamlessly with Kasavu mundu'
    ],
    careInstructions: ['Machine wash gentle in cold water', 'Warm steam iron while damp'],
    fitInformation: 'Relaxed modern tailored fit',
    sku: 'KV-LIN-004',
    tags: ['Linen', 'Shirt', 'Men', 'Luxury']
  },
  {
    id: 'kav-k-01',
    name: 'Kids Royal Pattu Pavada & Kasavu Blouse Set',
    subtitle: 'Traditional Festive Ethnic Skirt & Top',
    category: 'kids',
    subcategory: 'Kids Ethnic Wear',
    collection: 'kids-festive',
    price: 2199,
    originalPrice: 2799,
    discountPercentage: 21,
    rating: 4.9,
    reviewCount: 16,
    inStock: true,
    stockCount: 12,
    isNew: true,
    isBestSeller: true,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=800&q=75'
    ],
    sizes: ['2-3Y', '4-5Y', '6-7Y', '8-9Y', '10-12Y'],
    colors: [
      { name: 'Rani Pink & Gold', hex: '#FF1493' },
      { name: 'Emerald & Gold', hex: '#006400' }
    ],
    fabric: 'Pure Cotton Silk with Gold Zari Border',
    details: [
      'Ultra soft inner lining for delicate skin',
      'Elasticated waistband with traditional tie-up drawstring',
      'Lightweight festive wear for Onam, Vishu & weddings'
    ],
    careInstructions: ['Dry Clean or gentle hand wash in cold water'],
    fitInformation: 'Comfort fit with adjustable waist',
    sku: 'KV-KID-005',
    tags: ['Kids', 'Pattu Pavada', 'Festive', 'Kerala']
  },
  {
    id: 'kav-w-03',
    name: 'Handloom Kasavu Cotton Stole with Zari Ends',
    subtitle: 'Featherlight Accessory with Kerala Heritage Tassels',
    category: 'women',
    subcategory: 'Stoles & Dupattas',
    collection: 'kasavu-masterpieces',
    price: 1299,
    originalPrice: 1599,
    discountPercentage: 18,
    rating: 4.8,
    reviewCount: 14,
    inStock: true,
    stockCount: 25,
    isNew: false,
    isBestSeller: false,
    isFeatured: false,
    images: [
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=75'
    ],
    sizes: ['Free Size (2.2m x 0.8m)'],
    colors: [
      { name: 'Ivory Gold', hex: '#FFFFF0' }
    ],
    fabric: '100% Superfine Combed Handloom Cotton',
    details: [
      'Subtle 1.5-inch Kasavu gold borders',
      'Hand-knotted tassel fringes',
      'Versatile styling with ethnic and western outfits'
    ],
    careInstructions: ['Gentle hand wash in cold water'],
    fitInformation: '2.2 meters length standard stole',
    sku: 'KV-STL-006',
    tags: ['Stole', 'Dupatta', 'Accessories', 'Kasavu']
  }
];
