import React, { createContext, useContext, useState, useEffect } from 'react';
import type {
  AuditLog,
  ReturnRequest,
  AdminUser,
  StoreNotification,
  StoreContentConfig,
  GSTConfig,
  ReturnStatus
} from '../types';
import {
  fetchSupabaseAuditLogs, insertSupabaseAuditLog,
  fetchSupabaseReturnRequests, upsertSupabaseReturnRequest
} from '../lib/supabase';

interface AdminContextType {
  auditLogs: AuditLog[];
  returnRequests: ReturnRequest[];
  adminUsers: AdminUser[];
  notifications: StoreNotification[];
  gstConfig: GSTConfig;
  storeContent: StoreContentConfig;

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
    addressLine2: 'Thrissur District, Kerala - 679121, India',
    visitingHoursLine1: 'Monday – Saturday: 9:30 AM – 7:00 PM IST',
    visitingHoursLine2: 'Sunday: 10:00 AM – 5:00 PM (By Appointment)',
    phone: '+91 4884 282 100 / +91 98470 55111',
    email: 'concierge@kavishhandlooms.com',
    whatsappNumber: '919847055111',
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
      const saved = localStorage.getItem(AUDIT_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_AUDIT_LOGS;
  });

  const [returnRequests, setReturnRequests] = useState<ReturnRequest[]>(() => {
    try {
      const saved = localStorage.getItem(RETURNS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_RETURNS;
  });

  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(() => {
    try {
      const saved = localStorage.getItem(ADMIN_USERS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_ADMIN_USERS;
  });

  const [notifications, setNotifications] = useState<StoreNotification[]>(() => {
    try {
      const saved = localStorage.getItem(NOTIF_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_NOTIFICATIONS;
  });

  const [gstConfig, setGstConfig] = useState<GSTConfig>(() => {
    try {
      const saved = localStorage.getItem(GST_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_GST_CONFIG;
  });

  const [storeContent, setStoreContent] = useState<StoreContentConfig>(() => {
    try {
      const saved = localStorage.getItem(CONTENT_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_STORE_CONTENT;
  });

  useEffect(() => {
    async function loadSupabaseAdminData() {
      const dbLogs = await fetchSupabaseAuditLogs();
      if (dbLogs && dbLogs.length > 0) setAuditLogs(dbLogs);

      const dbReturns = await fetchSupabaseReturnRequests();
      if (dbReturns && dbReturns.length > 0) setReturnRequests(dbReturns);
    }
    loadSupabaseAdminData();
  }, []);

  const saveAuditLogs = (newLogs: AuditLog[]) => {
    setAuditLogs(newLogs);
    localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(newLogs));
  };

  const saveReturnRequests = (newReturns: ReturnRequest[]) => {
    setReturnRequests(newReturns);
    localStorage.setItem(RETURNS_STORAGE_KEY, JSON.stringify(newReturns));
  };

  const saveAdminUsers = (users: AdminUser[]) => {
    setAdminUsers(users);
    localStorage.setItem(ADMIN_USERS_STORAGE_KEY, JSON.stringify(users));
  };

  const saveNotifications = (notifs: StoreNotification[]) => {
    setNotifications(notifs);
    localStorage.setItem(NOTIF_STORAGE_KEY, JSON.stringify(notifs));
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
    localStorage.setItem(GST_STORAGE_KEY, JSON.stringify(updated));
  };

  const updateStoreContent = (content: Partial<StoreContentConfig>) => {
    const updated = { ...storeContent, ...content };
    setStoreContent(updated);
    localStorage.setItem(CONTENT_STORAGE_KEY, JSON.stringify(updated));
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
        updateStoreContent
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
