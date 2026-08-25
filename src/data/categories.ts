import type { CategoryItem } from '../types';

export const INITIAL_CATEGORIES: CategoryItem[] = [
  {
    id: 'cat-women-kasavu',
    name: "Women's Kasavu Sarees",
    parentCategory: 'women',
    slug: 'kasavu-sarees',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
    description: 'Authentic Kuthampully handloom pure cotton and tissue Kasavu sarees with 24k gold zari borders.',
    seoTitle: 'Authentic Kuthampully Kasavu Sarees | Kavish',
    seoDescription: 'Shop certified GI Tagged Kerala Kasavu Sarees woven by master Devanga weavers.',
    status: 'Active',
    productCount: 8
  },
  {
    id: 'cat-men-mundu',
    name: "Men's Mundu & Linen Shirts",
    parentCategory: 'men',
    slug: 'mens-mundu-shirts',
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
    description: 'Traditional double mundu, royal kasavu border dhotis, and breathable European unbleached linen shirts.',
    seoTitle: "Men's Traditional Mundu & Linen Shirts | Kavish",
    seoDescription: 'Premium ceremonial and daily wear Kuthampully handloom double mundu and shirts.',
    status: 'Active',
    productCount: 6
  },
  {
    id: 'cat-kids-ethnic',
    name: 'Kids Ethnic Wear',
    parentCategory: 'kids',
    slug: 'kids-ethnic-wear',
    image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=800&q=80',
    description: 'Handcrafted traditional Pattu Pavada, festive dhotis, and miniature Kasavu sets for young royalty.',
    seoTitle: 'Traditional Kerala Kids Ethnic Wear | Kavish',
    seoDescription: 'Soft, skin-safe pure cotton and silk ethnic ensembles for boys and girls.',
    status: 'Active',
    productCount: 4
  },
  {
    id: 'cat-festive-bridal',
    name: 'Bridal & Festive Heritage',
    parentCategory: 'women',
    slug: 'festive-heritage',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
    description: 'Opulent wedding weaves with real zari temple motifs and heritage gold pallu masterworks.',
    seoTitle: 'Kerala Bridal Kasavu Sarees & Wedding Collection',
    seoDescription: 'Heirloom bridal wedding sarees crafted with 500-year-old weaving traditions.',
    status: 'Active',
    productCount: 5
  },
  {
    id: 'cat-pure-linen',
    name: 'Pure European Linen',
    parentCategory: 'men',
    slug: 'pure-linen',
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80',
    description: 'Tailored organic linen shirts and kurtas spun with ultra-breathable unbleached European yarn.',
    seoTitle: 'Pure European Linen Shirts & Kurtas | Kavish',
    seoDescription: 'Breathable, sustainable luxury linen tailored for gentlemen.',
    status: 'Active',
    productCount: 4
  },
  {
    id: 'cat-stoles-dupattas',
    name: 'Handloom Stoles & Sets',
    parentCategory: 'women',
    slug: 'stoles-dupattas',
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80',
    description: 'Featherlight Kasavu stoles, temple border dupattas, and ceremonial matching sets.',
    seoTitle: 'Handloom Kasavu Dupattas & Stoles | Kavish',
    seoDescription: 'Exquisite lightweight handloom accessories with gold zari accents.',
    status: 'Active',
    productCount: 3
  }
];
