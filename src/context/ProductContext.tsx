import { safeStorage } from '../utils/storage';
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
  fetchSupabaseCategories, upsertSupabaseCategory, removeSupabaseCategory, syncAllSupabaseCategories,
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

  deductInventoryForOrder: (items: { product: Product; quantity: number }[]) => void;
  incrementPromoUsage: (code: string) => void;

  resetToDefaults: () => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

const PRODUCTS_STORAGE_KEY = 'kavish_db_products_v2';
const CATEGORIES_STORAGE_KEY = 'kavish_db_categories_v2';
const OFFERS_STORAGE_KEY = 'kavish_db_offers_v2';
const COLLECTIONS_STORAGE_KEY = 'kavish_db_collections_v2';
const REVIEWS_STORAGE_KEY = 'kavish_db_reviews_v2';
const ANNOUNCEMENT_STORAGE_KEY = 'kavish_db_announcement_v2';

function safeStoreProducts(productsToStore: Product[]) {
  try {
    safeStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(productsToStore));
  } catch (err) {
    try {
      // If full multi-megabyte base64 images exceed browser localStorage 5MB quota,
      // store lightweight version with 1 image so local boot is preserved without crashing
      const lightweight = productsToStore.map(p => ({
        ...p,
        images: p.images && p.images.length > 0 ? [p.images[0]] : []
      }));
      safeStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(lightweight));
    } catch (innerErr) {
      console.warn('LocalStorage full, in-memory state will be used.');
    }
  }
}

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = safeStorage.getItem(PRODUCTS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const genuine = parsed.filter(p => !p.id.startsWith('kav-'));
          if (genuine.length > 0) return genuine;
        }
      }
    } catch (e) {
      console.error('Failed to parse saved products:', e);
    }
    return INITIAL_PRODUCTS;
  });

  const [categories, setCategories] = useState<CategoryItem[]>(() => {
    try {
      const saved = safeStorage.getItem(CATEGORIES_STORAGE_KEY);
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
      const saved = safeStorage.getItem(OFFERS_STORAGE_KEY);
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
      const saved = safeStorage.getItem(COLLECTIONS_STORAGE_KEY);
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
      const saved = safeStorage.getItem(REVIEWS_STORAGE_KEY);
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
    return safeStorage.getItem(ANNOUNCEMENT_STORAGE_KEY) || 'Complimentary Express Delivery across India on orders over ₹2,000 | 100% Authentic Kuthampully GI Tag Certified';
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
    let isMounted = true;

    // 1. Fetch products independently
    fetchSupabaseProducts().then((dbProducts) => {
      if (!isMounted || dbProducts === null) return;
      setProducts(dbProducts);
      safeStoreProducts(dbProducts);
    }).catch(err => console.warn('Products sync error:', err));

    // 2. Fetch categories independently
    fetchSupabaseCategories().then((dbCategories) => {
      if (!isMounted) return;
      const localSavedCategories = (() => {
        try {
          const saved = safeStorage.getItem(CATEGORIES_STORAGE_KEY);
          if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length > 0) return parsed;
          }
        } catch (e) {
          console.error(e);
        }
        return null;
      })();

      if (dbCategories && dbCategories.length > 0) {
        setCategories(dbCategories);
        try {
          safeStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(dbCategories));
        } catch (e) {
          console.error(e);
        }
      } else if (localSavedCategories && localSavedCategories.length > 0) {
        setCategories(localSavedCategories);
      }
    }).catch(err => console.warn('Categories sync error:', err));

    // 3. Fetch offers independently
    fetchSupabaseOffers().then((dbOffers) => {
      if (!isMounted || dbOffers === null) return;
      setOffers(dbOffers);
      try {
        safeStorage.setItem(OFFERS_STORAGE_KEY, JSON.stringify(dbOffers));
      } catch (e) {
        console.error(e);
      }
    }).catch(err => console.warn('Offers sync error:', err));

    // 4. Fetch reviews independently
    fetchSupabaseReviews().then((dbReviews) => {
      if (!isMounted || dbReviews === null) return;
      setReviews(dbReviews);
      try {
        safeStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(dbReviews));
      } catch (e) {
        console.error(e);
      }
    }).catch(err => console.warn('Reviews sync error:', err));

    // 5. Fetch store content & announcement text independently
    fetchSupabaseStoreContent().then((dbStoreContent) => {
      if (!isMounted || !dbStoreContent) return;
      if (dbStoreContent.announcementText) {
        setAnnouncementTextState(dbStoreContent.announcementText);
        try {
          safeStorage.setItem(ANNOUNCEMENT_STORAGE_KEY, dbStoreContent.announcementText);
        } catch (e) {
          console.error(e);
        }
      }
      if (dbStoreContent.categories && Array.isArray(dbStoreContent.categories) && dbStoreContent.categories.length > 0) {
        setCategories(dbStoreContent.categories);
        try {
          safeStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(dbStoreContent.categories));
        } catch (e) {
          console.error(e);
        }
      }
    }).catch(err => console.warn('Store content sync error:', err));

    return () => {
      isMounted = false;
    };
  }, []);

  const saveProducts = useCallback((newProducts: Product[]) => {
    setProducts(newProducts);
    safeStoreProducts(newProducts);
  }, []);

  const saveCategories = useCallback((newCategories: CategoryItem[]) => {
    setCategories(newCategories);
    try {
      safeStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(newCategories));
    } catch (e) {
      console.error('Failed to save categories:', e);
    }
  }, []);

  const saveOffers = useCallback((newOffers: PromoOffer[]) => {
    setOffers(newOffers);
    try {
      safeStorage.setItem(OFFERS_STORAGE_KEY, JSON.stringify(newOffers));
    } catch (e) {
      console.error('Failed to save offers:', e);
    }
  }, []);

  const saveCollections = useCallback((newCollections: CollectionItem[]) => {
    setCollections(newCollections);
    try {
      safeStorage.setItem(COLLECTIONS_STORAGE_KEY, JSON.stringify(newCollections));
    } catch (e) {
      console.error('Failed to save collections:', e);
    }
  }, []);

  const saveReviews = useCallback((newReviews: Review[]) => {
    setReviews(newReviews);
    try {
      safeStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(newReviews));
    } catch (e) {
      console.error('Failed to save reviews:', e);
    }
  }, []);

  const setAnnouncementText = (text: string) => {
    setAnnouncementTextState(text);
    safeStorage.setItem(ANNOUNCEMENT_STORAGE_KEY, text);
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
    syncAllSupabaseCategories(updated);
    return newCat;
  };

  const updateCategory = (updatedCat: CategoryItem): void => {
    const updated = categories.map((c) => (c.id === updatedCat.id ? { ...updatedCat } : c));
    saveCategories(updated);
    upsertSupabaseCategory(updatedCat);
    syncAllSupabaseCategories(updated);
  };

  const deleteCategory = (id: string): void => {
    const updated = categories.filter((c) => c.id !== id);
    saveCategories(updated);
    removeSupabaseCategory(id);
    syncAllSupabaseCategories(updated);
  };

  const toggleCategoryStatus = (id: string): void => {
    const updated = categories.map((c) => (c.id === id ? { ...c, status: c.status === 'Active' ? 'Disabled' : 'Active' } as CategoryItem : c));
    saveCategories(updated);
    const toggled = updated.find(c => c.id === id);
    if (toggled) upsertSupabaseCategory(toggled);
    syncAllSupabaseCategories(updated);
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

  const deductInventoryForOrder = (items: { product: Product; quantity: number }[]) => {
    setProducts(prevProducts => {
      let updatedProducts = [...prevProducts];
      items.forEach(it => {
        updatedProducts = updatedProducts.map(p => {
          if (p.id === it.product.id || (it.product.sku && p.sku === it.product.sku)) {
            const currentQty = p.stockCount != null ? p.stockCount : 10;
            const newQty = Math.max(0, currentQty - it.quantity);
            const updatedProd: Product = {
              ...p,
              stockCount: newQty,
              inStock: newQty > 0
            };
            upsertSupabaseProduct(updatedProd);
            return updatedProd;
          }
          return p;
        });
      });
      safeStoreProducts(updatedProducts);
      return updatedProducts;
    });
  };

  const incrementPromoUsage = (code: string) => {
    if (!code) return;
    const cleanCode = code.trim().toUpperCase();
    setOffers(prevOffers => {
      const updatedOffers = prevOffers.map(o => {
        if (o.code.toUpperCase() === cleanCode) {
          const updated = { ...o, usageCount: (o.usageCount || 0) + 1 };
          upsertSupabaseOffer(updated);
          return updated;
        }
        return o;
      });
      try {
        safeStorage.setItem(OFFERS_STORAGE_KEY, JSON.stringify(updatedOffers));
      } catch (e) {
        console.error(e);
      }
      return updatedOffers;
    });
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
        deductInventoryForOrder,
        incrementPromoUsage,
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
