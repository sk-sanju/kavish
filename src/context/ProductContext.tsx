import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Product, PromoOffer, Review, CategoryItem } from '../types';
import { PRODUCTS as INITIAL_PRODUCTS } from '../data/products';
import { INITIAL_OFFERS } from '../data/offers';
import { COLLECTIONS as INITIAL_COLLECTIONS } from '../data/collections';
import type { CollectionItem } from '../data/collections';
import { INITIAL_CATEGORIES } from '../data/categories';
import { REVIEWS as INITIAL_REVIEWS } from '../data/reviews';
import {
  fetchSupabaseProducts, upsertSupabaseProduct, removeSupabaseProduct,
  fetchSupabaseOffers, upsertSupabaseOffer,
  fetchSupabaseReviews, upsertSupabaseReview,
  fetchSupabaseCategories, upsertSupabaseCategory, removeSupabaseCategory,
  fetchSupabaseStoreContent, upsertSupabaseStoreContent
} from '../lib/supabase';

interface ProductContextType {
  products: Product[];
  categories: CategoryItem[];
  offers: PromoOffer[];
  collections: CollectionItem[];
  reviews: Review[];
  announcementText: string;
  setAnnouncementText: (text: string) => void;

  addProduct: (productForm: Partial<Product>) => Product;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  toggleStockStatus: (id: string) => void;

  addCategory: (catForm: Partial<CategoryItem>) => CategoryItem;
  updateCategory: (cat: CategoryItem) => void;
  deleteCategory: (id: string) => void;
  toggleCategoryStatus: (id: string) => void;

  addOffer: (offerForm: Partial<PromoOffer>) => PromoOffer;
  updateOffer: (offer: PromoOffer) => void;
  toggleOfferStatus: (id: string) => void;
  deleteOffer: (id: string) => void;

  addCollection: (collectionForm: Partial<CollectionItem>) => CollectionItem;
  updateCollection: (col: CollectionItem) => void;
  deleteCollection: (id: string) => void;

  addReview: (reviewForm: Partial<Review>) => Review;
  updateReview: (rev: Review) => void;
  deleteReview: (id: string) => void;

  resetToDefaults: () => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

const PRODUCTS_STORAGE_KEY = 'kavish_live_products_v1';
const CATEGORIES_STORAGE_KEY = 'kavish_live_categories_v1';
const OFFERS_STORAGE_KEY = 'kavish_live_offers_v1';
const COLLECTIONS_STORAGE_KEY = 'kavish_live_collections_v1';
const REVIEWS_STORAGE_KEY = 'kavish_live_reviews_v1';
const ANNOUNCEMENT_STORAGE_KEY = 'kavish_live_announcement_v1';

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(PRODUCTS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to parse saved products:', e);
    }
    return INITIAL_PRODUCTS;
  });

  const [categories, setCategories] = useState<CategoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(CATEGORIES_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to parse saved categories:', e);
    }
    return INITIAL_CATEGORIES;
  });

  const [offers, setOffers] = useState<PromoOffer[]>(() => {
    try {
      const saved = localStorage.getItem(OFFERS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to parse saved offers:', e);
    }
    return INITIAL_OFFERS;
  });

  const [collections, setCollections] = useState<CollectionItem[]>(() => {
    try {
      const saved = localStorage.getItem(COLLECTIONS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to parse saved collections:', e);
    }
    return INITIAL_COLLECTIONS;
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    try {
      const saved = localStorage.getItem(REVIEWS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to parse saved reviews:', e);
    }
    return INITIAL_REVIEWS;
  });

  const [announcementText, setAnnouncementTextState] = useState<string>(() => {
    return localStorage.getItem(ANNOUNCEMENT_STORAGE_KEY) || 'Complimentary Express Delivery across India on orders over ₹2,000 | 100% Authentic Kuthampully GI Tag Certified';
  });

  // Cross-tab and window sync listener
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      try {
        if (e.key === PRODUCTS_STORAGE_KEY && e.newValue) {
          setProducts(JSON.parse(e.newValue));
        } else if (e.key === CATEGORIES_STORAGE_KEY && e.newValue) {
          setCategories(JSON.parse(e.newValue));
        } else if (e.key === OFFERS_STORAGE_KEY && e.newValue) {
          setOffers(JSON.parse(e.newValue));
        } else if (e.key === COLLECTIONS_STORAGE_KEY && e.newValue) {
          setCollections(JSON.parse(e.newValue));
        } else if (e.key === ANNOUNCEMENT_STORAGE_KEY && e.newValue) {
          setAnnouncementTextState(e.newValue);
        }
      } catch (err) {
        console.error('Storage sync parse error:', err);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    async function loadSupabaseData() {
      try {
        const [dbProducts, dbCategories, dbOffers, dbReviews, dbStoreContent] = await Promise.all([
          fetchSupabaseProducts(),
          fetchSupabaseCategories(),
          fetchSupabaseOffers(),
          fetchSupabaseReviews(),
          fetchSupabaseStoreContent()
        ]);

        if (dbProducts !== null) {
          setProducts(dbProducts);
          localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(dbProducts));
        }

        if (dbCategories !== null && dbCategories.length > 0) {
          setCategories(dbCategories);
          localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(dbCategories));
        } else if (dbCategories !== null && dbCategories.length === 0) {
          const existingLocal = (() => {
            try {
              const saved = localStorage.getItem(CATEGORIES_STORAGE_KEY);
              if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length > 0) return parsed;
              }
            } catch (e) {
              console.error(e);
            }
            return INITIAL_CATEGORIES;
          })();
          if (existingLocal.length > 0) {
            setCategories(existingLocal);
            localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(existingLocal));
            existingLocal.forEach(c => upsertSupabaseCategory(c));
          }
        }

        if (dbOffers !== null) {
          setOffers(dbOffers);
          localStorage.setItem(OFFERS_STORAGE_KEY, JSON.stringify(dbOffers));
        }

        if (dbReviews !== null) {
          setReviews(dbReviews);
          localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(dbReviews));
        }

        if (dbStoreContent && dbStoreContent.announcementText) {
          setAnnouncementTextState(dbStoreContent.announcementText);
          localStorage.setItem(ANNOUNCEMENT_STORAGE_KEY, dbStoreContent.announcementText);
        }
      } catch (err) {
        console.warn('Error loading live data from Supabase database:', err);
      }
    }
    loadSupabaseData();
  }, []);

  const saveProducts = useCallback((newProducts: Product[]) => {
    setProducts(newProducts);
    try {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(newProducts));
    } catch (e) {
      console.error('Failed to save products:', e);
    }
  }, []);

  const saveCategories = useCallback((newCategories: CategoryItem[]) => {
    setCategories(newCategories);
    try {
      localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(newCategories));
    } catch (e) {
      console.error('Failed to save categories:', e);
    }
  }, []);

  const saveOffers = useCallback((newOffers: PromoOffer[]) => {
    setOffers(newOffers);
    try {
      localStorage.setItem(OFFERS_STORAGE_KEY, JSON.stringify(newOffers));
    } catch (e) {
      console.error('Failed to save offers:', e);
    }
  }, []);

  const saveCollections = useCallback((newCollections: CollectionItem[]) => {
    setCollections(newCollections);
    try {
      localStorage.setItem(COLLECTIONS_STORAGE_KEY, JSON.stringify(newCollections));
    } catch (e) {
      console.error('Failed to save collections:', e);
    }
  }, []);

  const saveReviews = useCallback((newReviews: Review[]) => {
    setReviews(newReviews);
    try {
      localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(newReviews));
    } catch (e) {
      console.error('Failed to save reviews:', e);
    }
  }, []);

  const setAnnouncementText = (text: string) => {
    setAnnouncementTextState(text);
    localStorage.setItem(ANNOUNCEMENT_STORAGE_KEY, text);
    fetchSupabaseStoreContent().then(curr => {
      upsertSupabaseStoreContent({
        announcementText: text,
        heroTitle: curr?.heroTitle || '500 Years of Kuthampully Handloom Mastery',
        heroSubtitle: curr?.heroSubtitle || 'Royal Kasavu Sarees & Handloom Weaves',
        bannerImage: curr?.bannerImage || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1600&q=90',
        featuredCollectionIds: curr?.featuredCollectionIds || [],
        faqItems: curr?.faqItems || [],
        policyText: curr?.policyText || ''
      });
    });
  };

  const addCategory = (catForm: Partial<CategoryItem>): CategoryItem => {
    const newCat: CategoryItem = {
      id: catForm.id || `cat-${Date.now()}`,
      name: catForm.name?.trim() || 'New Category',
      parentCategory: catForm.parentCategory || 'women',
      slug: catForm.slug?.trim() || (catForm.name || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-') || `cat-${Date.now()}`,
      image: catForm.image || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
      description: catForm.description || '',
      seoTitle: catForm.seoTitle || catForm.name || '',
      seoDescription: catForm.seoDescription || '',
      status: catForm.status || 'Active',
      productCount: catForm.productCount || 0
    };
    const updated = [newCat, ...categories.filter(c => c.id !== newCat.id)];
    saveCategories(updated);
    upsertSupabaseCategory(newCat);
    return newCat;
  };

  const updateCategory = (updatedCat: CategoryItem): void => {
    const updated = categories.map((c) => (c.id === updatedCat.id ? { ...updatedCat } : c));
    saveCategories(updated);
    upsertSupabaseCategory(updatedCat);
  };

  const deleteCategory = (id: string): void => {
    const updated = categories.filter((c) => c.id !== id);
    saveCategories(updated);
    removeSupabaseCategory(id);
  };

  const toggleCategoryStatus = (id: string): void => {
    const updated = categories.map((c) => (c.id === id ? { ...c, status: c.status === 'Active' ? 'Disabled' : 'Active' } as CategoryItem : c));
    saveCategories(updated);
    const toggled = updated.find(c => c.id === id);
    if (toggled) upsertSupabaseCategory(toggled);
  };

  const addProduct = (productForm: Partial<Product>): Product => {
    const newProd: Product = {
      id: `prod-${Date.now()}`,
      name: productForm.name || 'New Handloom Product',
      subtitle: productForm.subtitle || 'Kuthampully Traditional Weave',
      category: productForm.category || 'women',
      subcategory: productForm.subcategory || 'Kasavu Sarees',
      collection: productForm.collection || 'kasavu-masterpieces',
      price: productForm.price || 2999,
      originalPrice: productForm.originalPrice || undefined,
      discountPercentage: productForm.originalPrice && productForm.price
        ? Math.round(((productForm.originalPrice - productForm.price) / productForm.originalPrice) * 100)
        : undefined,
      rating: 5.0,
      reviewCount: 1,
      inStock: productForm.inStock ?? true,
      stockCount: productForm.stockCount || 10,
      isNew: productForm.isNew ?? true,
      isBestSeller: productForm.isBestSeller ?? false,
      isFeatured: productForm.isFeatured ?? true,
      images: productForm.images?.length ? productForm.images : ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'],
      sizes: productForm.sizes?.length ? productForm.sizes : ['Free Size'],
      colors: productForm.colors?.length ? productForm.colors : [{ name: 'Kasavu Gold', hex: '#D4AF37' }],
      fabric: productForm.fabric || '100% Pure Organic Cotton',
      details: productForm.details?.length ? productForm.details : ['100% Authentic Handloom with Kerala Govt GI Tag'],
      careInstructions: productForm.careInstructions?.length ? productForm.careInstructions : ['Dry Clean Only'],
      fitInformation: productForm.fitInformation || 'Standard Traditional Fit',
      sku: productForm.sku || `KV-KUT-${Math.floor(1000 + Math.random() * 9000)}`,
      tags: productForm.tags || ['Kuthampully', 'GI Tag'],
      sizeChart: productForm.sizeChart
    };

    const updated = [newProd, ...products];
    saveProducts(updated);
    upsertSupabaseProduct(newProd);
    return newProd;
  };

  const updateProduct = (updatedProd: Product): void => {
    const updated = products.map((p) => (p.id === updatedProd.id ? { ...updatedProd } : p));
    saveProducts(updated);
    upsertSupabaseProduct(updatedProd);
  };

  const deleteProduct = (id: string): void => {
    const updated = products.filter((p) => p.id !== id);
    saveProducts(updated);
    removeSupabaseProduct(id);
  };

  const toggleStockStatus = (id: string): void => {
    const updated = products.map((p) => (p.id === id ? { ...p, inStock: !p.inStock } : p));
    saveProducts(updated);
  };

  const addOffer = (offerForm: Partial<PromoOffer>): PromoOffer => {
    const newOffer: PromoOffer = {
      id: `off-${Date.now()}`,
      code: (offerForm.code || 'SPECIAL10').toUpperCase(),
      discountType: offerForm.discountType || 'percentage',
      discountValue: offerForm.discountValue || 10,
      minOrderAmount: offerForm.minOrderAmount || 1000,
      maxDiscountAmount: offerForm.maxDiscountAmount,
      expiryDate: offerForm.expiryDate || '2026-12-31',
      isActive: offerForm.isActive ?? true,
      usageCount: offerForm.usageCount || 0,
      usageLimit: offerForm.usageLimit,
      description: offerForm.description || 'Special Atelier Discount Code',
    };

    const updated = [newOffer, ...offers];
    saveOffers(updated);
    upsertSupabaseOffer(newOffer);
    return newOffer;
  };

  const updateOffer = (updatedOffer: PromoOffer): void => {
    const updated = offers.map((o) => (o.id === updatedOffer.id ? { ...updatedOffer } : o));
    saveOffers(updated);
    upsertSupabaseOffer(updatedOffer);
  };

  const toggleOfferStatus = (id: string): void => {
    const updated = offers.map((o) => (o.id === id ? { ...o, isActive: !o.isActive } : o));
    saveOffers(updated);
  };

  const deleteOffer = (id: string): void => {
    const updated = offers.filter((o) => o.id !== id);
    saveOffers(updated);
  };

  const addCollection = (colForm: Partial<CollectionItem>): CollectionItem => {
    const newCol: CollectionItem = {
      id: `col-${Date.now()}`,
      title: colForm.title || 'New Royal Collection',
      subtitle: colForm.subtitle || 'Handcrafted Heritage Weaves',
      description: colForm.description || 'Exclusive traditional Kuthampully handloom curation.',
      image: colForm.image || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=85',
      tag: colForm.tag || 'Special Collection',
      slug: colForm.slug || `col-${Date.now()}`,
      itemCount: colForm.itemCount || 10,
    };
    const updated = [newCol, ...collections];
    saveCollections(updated);
    return newCol;
  };

  const updateCollection = (updatedCol: CollectionItem): void => {
    const updated = collections.map((c) => (c.id === updatedCol.id ? { ...updatedCol } : c));
    saveCollections(updated);
  };

  const deleteCollection = (id: string): void => {
    const updated = collections.filter((c) => c.id !== id);
    saveCollections(updated);
  };

  const addReview = (reviewForm: Partial<Review>): Review => {
    const newRev: Review = {
      id: `rev-${Date.now()}`,
      productId: reviewForm.productId || 'kav-w-01',
      author: reviewForm.author || 'Atelier Patron',
      location: reviewForm.location || 'Kerala, India',
      rating: reviewForm.rating || 5,
      title: reviewForm.title || 'Exceptional Quality',
      comment: reviewForm.comment || 'Authentic Kuthampully weave. Highly satisfied!',
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      verified: true,
      helpfulCount: 1,
    };
    const updated = [newRev, ...reviews];
    saveReviews(updated);
    upsertSupabaseReview(newRev);
    return newRev;
  };

  const updateReview = (rev: Review): void => {
    const updated = reviews.map((r) => (r.id === rev.id ? rev : r));
    saveReviews(updated);
    upsertSupabaseReview(rev);
  };

  const deleteReview = (id: string): void => {
    const updated = reviews.filter((r) => r.id !== id);
    saveReviews(updated);
  };

  const resetToDefaults = (): void => {
    saveProducts(INITIAL_PRODUCTS);
    saveOffers(INITIAL_OFFERS);
    saveCollections(INITIAL_COLLECTIONS);
    saveReviews(INITIAL_REVIEWS);
    saveCategories(INITIAL_CATEGORIES);
    setAnnouncementText('Complimentary Express Air Delivery across India on orders over ₹2,000 | 100% Authentic Kuthampully GI Tag Certified');
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        categories,
        offers,
        collections,
        reviews,
        announcementText,
        setAnnouncementText,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleStockStatus,
        addCategory,
        updateCategory,
        deleteCategory,
        toggleCategoryStatus,
        addOffer,
        updateOffer,
        toggleOfferStatus,
        deleteOffer,
        addCollection,
        updateCollection,
        deleteCollection,
        addReview,
        updateReview,
        deleteReview,
        resetToDefaults,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = (): ProductContextType => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};
