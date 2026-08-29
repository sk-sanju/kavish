import { safeStorage } from '../utils/storage';
import React, { createContext, useContext, useState, useEffect } from 'react';
import type {
  AuditLog,
  ReturnRequest,
  AdminUser,
  StoreNotification,
  StoreContentConfig,
  GSTConfig,
  ReturnStatus,
  HeroBanner
} from '../types';
import {
  fetchSupabaseAuditLogs, insertSupabaseAuditLog,
  fetchSupabaseReturnRequests, upsertSupabaseReturnRequest,
  fetchSupabaseStoreContent, upsertSupabaseStoreContent
} from '../lib/supabase';

export const DEFAULT_HERO_BANNERS: HeroBanner[] = [
  {
    id: 'banner-01',
    tag: 'Atelier Signature Edit',
    title: '500 Years of\nKuthampully Handloom\nMastery',
    subtitle: 'Royal Kasavu Sarees & Unbleached European Linen Woven for Modern Royalty',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1400&q=80',
    primaryCtaText: 'Shop Collection',
    primaryCtaLink: 'shop',
    secondaryCtaText: 'Explore Our Story',
    secondaryCtaLink: 'heritage',
    collectionSlug: 'kasavu-masterpieces',
    isActive: true,
    order: 1
  },
  {
    id: 'banner-02',
    tag: 'Festive Campaign',
    title: 'The Royal Kasavu\nGold Zari Legacy.',
    subtitle: 'Woven with 24k electroplated gold threads in Kuthampully for grand celebrations and heirloom memories.',
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1400&q=80',
    primaryCtaText: 'Shop Festive Edit',
    primaryCtaLink: 'shop',
    secondaryCtaText: 'GI Tag Heritage',
    secondaryCtaLink: 'heritage',
    collectionSlug: 'festive-edit',
    isActive: true,
    order: 2
  },
  {
    id: 'banner-03',
    tag: 'Pure European Linen',
    title: 'Bespoke Kerala\nLinen Shirts & Mundus',
    subtitle: 'Breathable, unbleached handloom weaves tailored with subtle gold borders for discerning gentlemen.',
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1400&q=80',
    primaryCtaText: 'Shop Men\'s Edit',
    primaryCtaLink: 'shop',
    secondaryCtaText: 'Craftsmanship',
    secondaryCtaLink: 'heritage',
    collectionSlug: 'col-everyday',
    isActive: true,
    order: 3
  }
];

interface AdminContextType {
  auditLogs: AuditLog[];
  returnRequests: ReturnRequest[];
  adminUsers: AdminUser[];
  notifications: StoreNotification[];
  gstConfig: GSTConfig;
  storeContent: StoreContentConfig;
  heroBanners: HeroBanner[];

  addAuditLog: (log: Omit<AuditLog, 'id' | 'timestamp'>) => void;
  updateReturnStatus: (id: string, status: ReturnStatus, notes?: string) => void;
  addReturnRequest: (req: Omit<ReturnRequest, 'id' | 'requestedDate'>) => ReturnRequest;
  
  addAdminUser: (user: Omit<AdminUser, 'id'>) => AdminUser;
  updateAdminUser: (user: AdminUser) => void;
  deleteAdminUser: (id: string) => void;

  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;
  addNotification: (notif: Omit<StoreNotification, 'id' | 'timestamp' | 'read'>) => void;

  updateGSTConfig: (config: Partial<GSTConfig>) => void;
  updateStoreContent: (content: Partial<StoreContentConfig>) => void;

  addHeroBanner: (bannerForm: Partial<HeroBanner>) => HeroBanner;
  updateHeroBanner: (banner: HeroBanner) => void;
  deleteHeroBanner: (id: string) => void;
  toggleHeroBannerStatus: (id: string) => void;
  reorderHeroBanners: (banners: HeroBanner[]) => void;
  resetHeroBannersToDefault: () => void;
}

const INITIAL_AUDIT_LOGS: AuditLog[] = [];

const INITIAL_RETURNS: ReturnRequest[] = [];

const INITIAL_ADMIN_USERS: AdminUser[] = [
  {
    id: 'adm-01',
    name: 'Sanjay Suresh',
    email: 'admin@kavishhandlooms.com',
    role: 'Super Admin',
    status: 'Active',
    permissions: ['all'],
    lastLogin: 'Just now'
  }
];

const INITIAL_NOTIFICATIONS: StoreNotification[] = [];

const DEFAULT_GST_CONFIG: GSTConfig = {
  gstRate: 5,
  cgstRate: 2.5,
  sgstRate: 2.5,
  igstRate: 5,
  hsnCode: '5208',
  includeTaxInPrice: true
};

const DEFAULT_STORE_CONTENT: StoreContentConfig = {
  announcementText: 'Complimentary Express Air Delivery across India on orders over ₹2,000 | 100% Authentic Kuthampully GI Tag Certified',
  heroTitle: '500 Years of Kuthampully Handloom Mastery',
  heroSubtitle: 'Royal Kasavu Sarees & Unbleached European Linen Woven for Modern Royalty',
  bannerImage: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1600&q=90',
  featuredCollectionIds: ['col-kasavu', 'col-festive', 'col-everyday'],
  faqItems: [
    { question: 'Are all Kavish garments certified authentic handloom?', answer: 'Yes, every Kavish product carries the official Government GI Tag (Reg 2011) woven in Kuthampully, Thrissur.' },
    { question: 'What is your size exchange policy?', answer: 'We offer a complimentary 7-day doorstep size exchange concierge across India.' }
  ],
  policyText: 'Kavish Handlooms Pvt. Ltd. guarantees 100% authentic Devanga artisan craftsmanship.',
  contactInfo: {
    atelierTitle: 'Kavish Kuthampully Atelier',
    atelierSubtitle: 'Headquarters & Loom House',
    addressLine1: 'Kuthampully Handloom Village, Near Thiruvilwamala',
    addressLine2: 'Thrissur District, Kerala - 680594, India.',
    visitingHoursLine1: 'Monday – Saturday: 9:30 AM – 7:00 PM IST',
    visitingHoursLine2: 'Sunday: 10:00 AM – 5:00 PM (By Appointment)',
    phone: '+91 9539251789',
    email: 'kavishlooms@gmail.com',
    whatsappNumber: '919539251789',
    badgeText: 'Authentic Kuthampully GI Tag Unit'
  }
};

const AUDIT_STORAGE_KEY = 'kavish_audit_logs_v1';
const RETURNS_STORAGE_KEY = 'kavish_return_requests_v1';
const ADMIN_USERS_STORAGE_KEY = 'kavish_admin_users_v1';
const NOTIF_STORAGE_KEY = 'kavish_notifications_v1';
const GST_STORAGE_KEY = 'kavish_gst_config_v1';
const CONTENT_STORAGE_KEY = 'kavish_store_content_v1';

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    try {
      const saved = safeStorage.getItem(AUDIT_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_AUDIT_LOGS;
  });

  const [returnRequests, setReturnRequests] = useState<ReturnRequest[]>(() => {
    try {
      const saved = safeStorage.getItem(RETURNS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_RETURNS;
  });

  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(() => {
    try {
      const saved = safeStorage.getItem(ADMIN_USERS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_ADMIN_USERS;
  });

  const [notifications, setNotifications] = useState<StoreNotification[]>(() => {
    try {
      const saved = safeStorage.getItem(NOTIF_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_NOTIFICATIONS;
  });

  const [gstConfig, setGstConfig] = useState<GSTConfig>(() => {
    try {
      const saved = safeStorage.getItem(GST_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_GST_CONFIG;
  });

  const [heroBanners, setHeroBanners] = useState<HeroBanner[]>(() => {
    try {
      const saved = safeStorage.getItem('kavish_hero_banners_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_HERO_BANNERS;
  });

  const [storeContent, setStoreContent] = useState<StoreContentConfig>(() => {
    try {
      const saved = safeStorage.getItem(CONTENT_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return { ...DEFAULT_STORE_CONTENT, heroBanners: DEFAULT_HERO_BANNERS };
  });

  useEffect(() => {
    const isAdmin = Boolean(safeStorage.getItem('kavish_admin_auth'));
    // Only load internal audit logs and return requests if an admin is logged in
    if (isAdmin) {
      fetchSupabaseAuditLogs().then(dbLogs => {
        if (dbLogs && dbLogs.length > 0) setAuditLogs(dbLogs);
      }).catch(err => console.warn('Audit logs load error:', err));

      fetchSupabaseReturnRequests().then(dbReturns => {
        if (dbReturns && dbReturns.length > 0) setReturnRequests(dbReturns);
      }).catch(err => console.warn('Return requests load error:', err));
    }

    // Hero banners & store content are loaded for storefront display
    fetchSupabaseStoreContent().then(dbContent => {
      if (dbContent) {
        setStoreContent(prev => ({ ...prev, ...dbContent }));
        if (dbContent.heroBanners && Array.isArray(dbContent.heroBanners) && dbContent.heroBanners.length > 0) {
          setHeroBanners(dbContent.heroBanners);
          try {
            safeStorage.setItem('kavish_hero_banners_v1', JSON.stringify(dbContent.heroBanners));
          } catch (e) {
            console.error(e);
          }
        } else if (dbContent.bannerImage || dbContent.heroTitle) {
          const liveBanner: HeroBanner = {
            id: 'banner-live-01',
            tag: 'Atelier Signature Edit',
            title: dbContent.heroTitle || DEFAULT_HERO_BANNERS[0].title,
            subtitle: dbContent.heroSubtitle || DEFAULT_HERO_BANNERS[0].subtitle,
            image: dbContent.bannerImage || DEFAULT_HERO_BANNERS[0].image,
            primaryCtaText: 'Shop Collection',
            primaryCtaLink: 'shop',
            secondaryCtaText: 'Explore Our Story',
            secondaryCtaLink: 'heritage',
            collectionSlug: 'kasavu-masterpieces',
            isActive: true,
            order: 1
          };
          setHeroBanners([liveBanner]);
          try {
            safeStorage.setItem('kavish_hero_banners_v1', JSON.stringify([liveBanner]));
          } catch (e) {
            console.error(e);
          }
        }
      }
    }).catch(err => console.warn('Store content fetch error:', err));
  }, []);

  const saveAuditLogs = (newLogs: AuditLog[]) => {
    setAuditLogs(newLogs);
    safeStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(newLogs));
  };

  const saveReturnRequests = (newReturns: ReturnRequest[]) => {
    setReturnRequests(newReturns);
    safeStorage.setItem(RETURNS_STORAGE_KEY, JSON.stringify(newReturns));
  };

  const saveAdminUsers = (users: AdminUser[]) => {
    setAdminUsers(users);
    safeStorage.setItem(ADMIN_USERS_STORAGE_KEY, JSON.stringify(users));
  };

  const saveNotifications = (notifs: StoreNotification[]) => {
    setNotifications(notifs);
    safeStorage.setItem(NOTIF_STORAGE_KEY, JSON.stringify(notifs));
  };

  const saveHeroBanners = (newBanners: HeroBanner[]) => {
    setHeroBanners(newBanners);
    try {
      safeStorage.setItem('kavish_hero_banners_v1', JSON.stringify(newBanners));
    } catch (e) {
      console.error('Error saving hero banners to localStorage:', e);
    }
    const firstActive = newBanners.find(b => b.isActive !== false) || newBanners[0];
    const updatedContent: StoreContentConfig = {
      ...storeContent,
      heroBanners: newBanners,
      heroTitle: firstActive?.title || storeContent.heroTitle,
      heroSubtitle: firstActive?.subtitle || storeContent.heroSubtitle,
      bannerImage: firstActive?.image || storeContent.bannerImage
    };
    setStoreContent(updatedContent);
    try {
      safeStorage.setItem(CONTENT_STORAGE_KEY, JSON.stringify(updatedContent));
    } catch (e) {
      console.error('Error saving store content to localStorage:', e);
    }
    upsertSupabaseStoreContent(updatedContent);
  };

  const addHeroBanner = (bannerForm: Partial<HeroBanner>): HeroBanner => {
    const newBanner: HeroBanner = {
      id: bannerForm.id || `banner-${Date.now()}`,
      tag: bannerForm.tag?.trim() || 'Atelier Edit',
      title: bannerForm.title?.trim() || '500 Years of Handloom Mastery',
      subtitle: bannerForm.subtitle?.trim() || 'Royal Kasavu Sarees & Handloom Weaves',
      image: bannerForm.image || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1800&q=90',
      primaryCtaText: bannerForm.primaryCtaText || 'Shop Collection',
      primaryCtaLink: bannerForm.primaryCtaLink || 'shop',
      secondaryCtaText: bannerForm.secondaryCtaText || 'Explore Our Story',
      secondaryCtaLink: bannerForm.secondaryCtaLink || 'heritage',
      collectionSlug: bannerForm.collectionSlug || 'kasavu-masterpieces',
      isActive: bannerForm.isActive ?? true,
      order: bannerForm.order || heroBanners.length + 1
    };
    const updated = [...heroBanners, newBanner];
    saveHeroBanners(updated);
    addAuditLog({
      adminName: 'Sanjay Suresh (Super Admin)',
      adminRole: 'Super Admin',
      action: `Created new Hero Banner: "${newBanner.tag}"`,
      entity: 'StoreContent',
      entityId: newBanner.id,
      newValue: newBanner.title
    });
    return newBanner;
  };

  const updateHeroBanner = (banner: HeroBanner) => {
    const exists = heroBanners.some(b => b.id === banner.id);
    const updated = exists
      ? heroBanners.map(b => (b.id === banner.id ? banner : b))
      : [banner, ...heroBanners];
    saveHeroBanners(updated);
    addAuditLog({
      adminName: 'Sanjay Suresh (Super Admin)',
      adminRole: 'Super Admin',
      action: `Updated Hero Banner: "${banner.tag}"`,
      entity: 'StoreContent',
      entityId: banner.id,
      newValue: banner.title
    });
  };

  const deleteHeroBanner = (id: string) => {
    const bannerToDelete = heroBanners.find(b => b.id === id);
    const updated = heroBanners.filter(b => b.id !== id);
    saveHeroBanners(updated);
    addAuditLog({
      adminName: 'Sanjay Suresh (Super Admin)',
      adminRole: 'Super Admin',
      action: `Deleted Hero Banner: "${bannerToDelete?.tag || id}"`,
      entity: 'StoreContent',
      entityId: id
    });
  };

  const toggleHeroBannerStatus = (id: string) => {
    const updated = heroBanners.map(b => b.id === id ? { ...b, isActive: !b.isActive } : b);
    saveHeroBanners(updated);
  };

  const reorderHeroBanners = (banners: HeroBanner[]) => {
    saveHeroBanners(banners);
  };

  const resetHeroBannersToDefault = () => {
    saveHeroBanners(DEFAULT_HERO_BANNERS);
  };

  const addAuditLog = (logData: Omit<AuditLog, 'id' | 'timestamp'>) => {
    const newLog: AuditLog = {
      ...logData,
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
    };
    saveAuditLogs([newLog, ...auditLogs]);
    insertSupabaseAuditLog(newLog);
  };

  const updateReturnStatus = (id: string, status: ReturnStatus, notes?: string) => {
    const updated = returnRequests.map(r => {
      if (r.id === id) {
        const updatedReq = { ...r, status, adminNotes: notes || r.adminNotes };
        upsertSupabaseReturnRequest(updatedReq);
        return updatedReq;
      }
      return r;
    });
    saveReturnRequests(updated);
    addAuditLog({
      adminName: 'Sanjay Suresh (Super Admin)',
      adminRole: 'Super Admin',
      action: `Updated Return Request status to ${status}`,
      entity: 'ReturnRequest',
      entityId: id,
      newValue: status
    });
  };

  const addReturnRequest = (req: Omit<ReturnRequest, 'id' | 'requestedDate'>): ReturnRequest => {
    const newReq: ReturnRequest = {
      ...req,
      id: `ret-${Date.now()}`,
      requestedDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    };
    saveReturnRequests([newReq, ...returnRequests]);
    return newReq;
  };

  const addAdminUser = (userData: Omit<AdminUser, 'id'>): AdminUser => {
    const newUser: AdminUser = {
      ...userData,
      id: `adm-${Date.now()}`
    };
    saveAdminUsers([...adminUsers, newUser]);
    addAuditLog({
      adminName: 'Super Admin',
      adminRole: 'Super Admin',
      action: `Created new Admin User: ${userData.name} (${userData.role})`,
      entity: 'AdminUser',
      entityId: newUser.id,
      newValue: userData.role
    });
    return newUser;
  };

  const updateAdminUser = (user: AdminUser) => {
    const updated = adminUsers.map(u => u.id === user.id ? user : u);
    saveAdminUsers(updated);
  };

  const deleteAdminUser = (id: string) => {
    const updated = adminUsers.filter(u => u.id !== id);
    saveAdminUsers(updated);
  };

  const markNotificationAsRead = (id: string) => {
    const updated = notifications.map(n => n.id === id ? { ...n, read: true } : n);
    saveNotifications(updated);
  };

  const clearAllNotifications = () => {
    saveNotifications([]);
  };

  const addNotification = (notifData: Omit<StoreNotification, 'id' | 'timestamp' | 'read'>) => {
    const newNotif: StoreNotification = {
      ...notifData,
      id: `notif-${Date.now()}`,
      timestamp: 'Just now',
      read: false
    };
    saveNotifications([newNotif, ...notifications]);
  };

  const updateGSTConfig = (config: Partial<GSTConfig>) => {
    const updated = { ...gstConfig, ...config };
    setGstConfig(updated);
    safeStorage.setItem(GST_STORAGE_KEY, JSON.stringify(updated));
  };

  const updateStoreContent = (content: Partial<StoreContentConfig>) => {
    let updatedHeroBanners = heroBanners;

    if (content.heroBanners && Array.isArray(content.heroBanners) && content.heroBanners.length > 0) {
      updatedHeroBanners = content.heroBanners;
      setHeroBanners(updatedHeroBanners);
      safeStorage.setItem('kavish_hero_banners_v1', JSON.stringify(updatedHeroBanners));
    } else if (content.heroTitle !== undefined || content.heroSubtitle !== undefined || content.bannerImage !== undefined) {
      const activeIdx = heroBanners.findIndex(b => b.isActive !== false);
      const targetIdx = activeIdx >= 0 ? activeIdx : 0;

      if (heroBanners.length > 0) {
        updatedHeroBanners = heroBanners.map((b, idx) => {
          if (idx === targetIdx) {
            return {
              ...b,
              ...(content.heroTitle !== undefined ? { title: content.heroTitle } : {}),
              ...(content.heroSubtitle !== undefined ? { subtitle: content.heroSubtitle } : {}),
              ...(content.bannerImage !== undefined ? { image: content.bannerImage } : {})
            };
          }
          return b;
        });
      } else {
        updatedHeroBanners = [{
          ...DEFAULT_HERO_BANNERS[0],
          title: content.heroTitle || DEFAULT_HERO_BANNERS[0].title,
          subtitle: content.heroSubtitle || DEFAULT_HERO_BANNERS[0].subtitle,
          image: content.bannerImage || DEFAULT_HERO_BANNERS[0].image
        }];
      }
      setHeroBanners(updatedHeroBanners);
      safeStorage.setItem('kavish_hero_banners_v1', JSON.stringify(updatedHeroBanners));
    }

    const updated = { ...storeContent, ...content, heroBanners: updatedHeroBanners };
    setStoreContent(updated);
    safeStorage.setItem(CONTENT_STORAGE_KEY, JSON.stringify(updated));
    upsertSupabaseStoreContent(updated);
  };

  return (
    <AdminContext.Provider
      value={{
        auditLogs,
        returnRequests,
        adminUsers,
        notifications,
        gstConfig,
        storeContent,
        heroBanners,
        addAuditLog,
        updateReturnStatus,
        addReturnRequest,
        addAdminUser,
        updateAdminUser,
        deleteAdminUser,
        markNotificationAsRead,
        clearAllNotifications,
        addNotification,
        updateGSTConfig,
        updateStoreContent,
        addHeroBanner,
        updateHeroBanner,
        deleteHeroBanner,
        toggleHeroBannerStatus,
        reorderHeroBanners,
        resetHeroBannersToDefault
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
