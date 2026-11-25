import type { CategoryItem } from '../types';

// Verified live categories from Supabase Database (4 categories)
export const INITIAL_CATEGORIES: CategoryItem[] = [
  {
    "id": "cat-men-mundu",
    "name": "Men's Mundu & Linen Shirts",
    "parentCategory": "men",
    "slug": "mens-mundu-shirts",
    "image": "/assets/categories/men_mundu.jpg",
    "description": "Traditional double mundu, royal kasavu border dhotis, and breathable European unbleached linen shirts.",
    "seoTitle": "Men's Traditional Mundu & Linen Shirts | Kavish",
    "seoDescription": "Premium ceremonial and daily wear Kuthampully handloom double mundu and shirts.",
    "status": "Active",
    "productCount": 6
  },
  {
    "id": "cat-kids-ethnic",
    "name": "Kids Ethnic Wear",
    "parentCategory": "kids",
    "slug": "kids-ethnic-wear",
    "image": "/assets/categories/kids_ethnic.jpg",
    "description": "Handcrafted traditional Pattu Pavada, festive dhotis, and miniature Kasavu sets for young royalty.",
    "seoTitle": "Traditional Kerala Kids Ethnic Wear | Kavish",
    "seoDescription": "Soft, skin-safe pure cotton and silk ethnic ensembles for boys and girls.",
    "status": "Active",
    "productCount": 4
  },
  {
    "id": "cat-women-kasavu",
    "name": "Women's Kasavu Sarees",
    "parentCategory": "women",
    "slug": "kasavu-sarees",
    "image": "/assets/categories/women_kasavu.jpg",
    "description": "Authentic Kuthampully handloom pure cotton and tissue Kasavu sarees with 24k gold zari borders.",
    "seoTitle": "Authentic Kuthampully Kasavu Sarees | Kavish",
    "seoDescription": "Shop authentic handcrafted Kerala Kasavu Sarees woven by master Devanga weavers.",
    "status": "Active",
    "productCount": 8
  },
  {
    "id": "cat-festive-bridal",
    "name": "Bridal & Festive Heritage",
    "parentCategory": "women",
    "slug": "festive-heritage",
    "image": "/assets/categories/bridal_festive.jpg",
    "description": "Opulent wedding weaves with real zari temple motifs and heritage gold pallu masterworks.",
    "seoTitle": "Kerala Bridal Kasavu Sarees & Wedding Collection",
    "seoDescription": "Heirloom bridal wedding sarees crafted with 500-year-old weaving traditions.",
    "status": "Active",
    "productCount": 5
  }
];
