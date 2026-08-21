import type { Product } from '../types';

export const PRODUCTS: Product[] = [
  {
    id: 'kav-w-01',
    name: 'Kuthampully Royal 24k Gold Kasavu Saree',
    subtitle: '100% Handloom Organic Cotton with Electroplated Gold Zari',
    category: 'women',
    subcategory: 'Kasavu Sarees',
    collection: 'kasavu-masterpieces',
    price: 8499,
    originalPrice: 10999,
    costPrice: 4200,
    discountPercentage: 23,
    rating: 4.9,
    reviewCount: 28,
    inStock: true,
    stockCount: 15,
    lowStockThreshold: 4,
    allowBackorders: false,
    brand: 'Kavish Kuthampully Atelier',
    isNew: true,
    isBestSeller: true,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=85'
    ],
    sizes: ['Free Size (5.5M + 0.8M Blouse)'],
    colors: [
      { name: 'Kasavu Gold', hex: '#D4AF37' },
      { name: 'Royal Ivory', hex: '#FAF8F1' }
    ],
    fabric: '100% Organic Combed Cotton & 24k Gold Electroplated Zari',
    details: [
      'Hand-woven on traditional pit looms in Kuthampully village, Thrissur',
      'Certified authentic with Government of India GI Tag (Reg 2011)',
      'Includes unstitched running blouse piece with matching Kasavu border',
      '3-inch wide pure gold-tone electroplated non-tarnish Kasavu border'
    ],
    careInstructions: [
      'Dry Clean Only for preserving gold lustre',
      'Store wrapped in breathable cotton cloth',
      'Do not expose directly to perfume sprays or iron directly on gold zari'
    ],
    fitInformation: 'Standard 5.5 Meter traditional Kerala Kasavu saree drape with 80cm unstitched blouse.',
    sku: 'KV-KUT-SAR-001',
    tags: ['Kuthampully', 'GI Tag', 'Kasavu Saree', 'Royal Collection', 'Wedding Wear'],
    sizeChart: {
      title: 'Kasavu Saree Dimensions',
      rows: [
        { size: 'Free Size', length: '5.5 Meters', dimensions: '1.2 M Width + 0.8 M Blouse' }
      ]
    }
  },
  {
    id: 'kav-m-01',
    name: 'Devanga Signature Double Kasavu Mundu',
    subtitle: 'Classic 4-Meter Fine Cotton Ceremonial Dhoti',
    category: 'men',
    subcategory: 'Double Mundu',
    collection: 'ceremonial-classics',
    price: 3499,
    originalPrice: 4299,
    costPrice: 1600,
    discountPercentage: 19,
    rating: 4.8,
    reviewCount: 19,
    inStock: true,
    stockCount: 22,
    lowStockThreshold: 5,
    allowBackorders: false,
    brand: 'Kavish Kuthampully Atelier',
    isNew: false,
    isBestSeller: true,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=1000&q=85'
    ],
    sizes: ['4.0 Meters (Single / Double Drape)'],
    colors: [
      { name: 'Pure Gold Kasavu', hex: '#D4AF37' },
      { name: 'Unbleached Cream', hex: '#F7F4EB' }
    ],
    fabric: 'Unbleached Organic Kerala Cotton',
    details: [
      '4.0 Meters traditional double length for formal Kerala drape',
      'Woven by hereditary Devanga artisan weavers in Thrissur',
      'Pure Kasavu temple border with reinforced selvedge edge'
    ],
    careInstructions: [
      'Hand wash gently in cold water with mild liquid detergent',
      'Dry flat in shade',
      'Warm iron on reverse side'
    ],
    fitInformation: 'Length: 4.0M (155 Inches) x 50 Inches width. Fits waist sizes 28" to 44".',
    sku: 'KV-KUT-MND-001',
    tags: ['Double Mundu', 'Kerala Dhoti', 'Kuthampully', 'Onam Special']
  },
  {
    id: 'kav-m-02',
    name: 'Unbleached European Linen Kerala Shirt',
    subtitle: 'Breathable Pure Flax Handloom Shirt for Ceremonies & Leisure',
    category: 'men',
    subcategory: 'Linen Shirts',
    collection: 'flax-linen',
    price: 4299,
    originalPrice: 5499,
    costPrice: 2100,
    discountPercentage: 22,
    rating: 5.0,
    reviewCount: 14,
    inStock: true,
    stockCount: 18,
    lowStockThreshold: 4,
    allowBackorders: false,
    brand: 'Kavish Kuthampully Atelier',
    isNew: true,
    isBestSeller: false,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1000&q=85'
    ],
    sizes: ['38 (S)', '40 (M)', '42 (L)', '44 (XL)'],
    colors: [
      { name: 'Natural Sand', hex: '#E6D7C3' },
      { name: 'Ivory White', hex: '#FFFFF0' }
    ],
    fabric: '100% Premium European Flax Linen',
    details: [
      'Relaxed luxury tailored fit designed to pair with Kasavu Mundu',
      'Mother of pearl buttons with handcrafted contrast stitch',
      'Softened finish for skin comfort in humid climates'
    ],
    careInstructions: [
      'Machine wash cold on gentle cycle',
      'Hang dry, iron while slightly damp for crisp look'
    ],
    fitInformation: 'Relaxed modern fit. Fits true to size.',
    sku: 'KV-KUT-SHT-002',
    tags: ['European Linen', 'Kerala Shirt', 'Men Fashion']
  },
  {
    id: 'kav-k-01',
    name: 'Little Princess Kuthampully Pattu Pavada Set',
    subtitle: 'Traditional Hand-Woven Kasavu Lehenga for Girls',
    category: 'kids',
    subcategory: 'Pattu Pavada',
    collection: 'legacy-kids',
    price: 3899,
    originalPrice: 4799,
    costPrice: 1800,
    discountPercentage: 19,
    rating: 4.9,
    reviewCount: 11,
    inStock: true,
    stockCount: 12,
    lowStockThreshold: 3,
    allowBackorders: false,
    brand: 'Kavish Kuthampully Atelier',
    isNew: true,
    isBestSeller: false,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=1000&q=85'
    ],
    sizes: ['2-4 Yrs', '4-6 Yrs', '6-8 Yrs', '8-10 Yrs'],
    colors: [
      { name: 'Kasavu Gold & Temple Red', hex: '#800020' },
      { name: 'Ivory Gold', hex: '#FAF8F1' }
    ],
    fabric: 'Pure Cotton Silk with Gold Kasavu Motif',
    details: [
      'Includes stitched blouse and pleated skirt with inner pure cotton lining',
      'Soft inner lining ensures zero itchiness for children',
      'Adjustable waistband drawstrings with hand-made tassels'
    ],
    careInstructions: [
      'Dry clean recommended',
      'Mild hand wash in cold water'
    ],
    fitInformation: 'Custom kid waist-to-ankle ratio with extra margin inside blouse for growth.',
    sku: 'KV-KUT-KID-001',
    tags: ['Kids Ethnic', 'Pattu Pavada', 'Festive Kids', 'Kasavu']
  }
];
