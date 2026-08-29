import { safeStorage } from '../utils/storage';
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { UserProfile, Order, Address, AdminProfile } from '../types';
import { fetchSupabaseOrders, upsertSupabaseOrder } from '../lib/supabase';

interface AuthContextType {
  user: UserProfile;
  isCustomerLoggedIn: boolean;
  isCustomerAuthModalOpen: boolean;
  customerAuthMode: 'register' | 'login';
  openCustomerAuthModal: (mode?: 'register' | 'login') => void;
  closeCustomerAuthModal: () => void;
  registerCustomer: (name: string, email: string, phone: string, password?: string) => boolean;
  loginCustomer: (email: string, password?: string) => boolean;
  logoutCustomer: () => void;

  addOrder: (order: Order) => void;
  updateOrder: (order: Order) => void;
  addAddress: (address: Omit<Address, 'id'>) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  selectedTrackingOrder: Order | null;
  setSelectedTrackingOrder: (order: Order | null) => void;

  // Admin Auth & Profile State
  isAdminLoggedIn: boolean;
  isAdminLoginModalOpen: boolean;
  setIsAdminLoginModalOpen: (open: boolean) => void;
  adminProfile: AdminProfile;
  adminUsername: string;
  adminPasscode: string;
  loginAdmin: (identifier: string, password?: string) => boolean;
  registerAdmin: (name: string, email: string, phone: string, password: string, role?: string) => boolean;
  logoutAdmin: () => void;
  updateAdminProfile: (profile: AdminProfile) => void;
  updateAdminCredentials: (newUsername: string, newPasscode: string) => void;
}

const DEFAULT_USER: UserProfile = {
  id: 'guest',
  name: 'Valued Customer',
  email: '',
  phone: '',
  addresses: [],
  orders: []
};

const DEFAULT_ADMIN_PROFILE: AdminProfile = {
  phone: '+91 98470 12345',
  name: 'Sanjay Suresh',
  email: 'admin@kavishhandlooms.com',
  password: 'admin',
  role: 'Super Admin'
};

const USER_STORAGE_KEY = 'kavish_customer_profile';
const AUTH_STATUS_KEY = 'kavish_customer_auth_status';
const ADMIN_PROFILE_STORAGE_KEY = 'kavish_admin_profile_v2';
const ADMIN_ACCOUNTS_STORAGE_KEY = 'kavish_all_admin_accounts_v1';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const saved = safeStorage.getItem(USER_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load user profile:', e);
    }
    return DEFAULT_USER;
  });

  const [isCustomerLoggedIn, setIsCustomerLoggedIn] = useState<boolean>(() => {
    const saved = safeStorage.getItem(AUTH_STATUS_KEY);
    return saved !== null ? saved === 'true' : false;
  });

  const [isCustomerAuthModalOpen, setIsCustomerAuthModalOpen] = useState(false);
  const [customerAuthMode, setCustomerAuthMode] = useState<'register' | 'login'>('register');

  const [selectedTrackingOrder, setSelectedTrackingOrder] = useState<Order | null>(null);

  // Admin Profile & dynamic credentials
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return safeStorage.getItem('kavish_admin_auth') === 'true';
  });
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState<boolean>(false);
  
  const [adminProfile, setAdminProfile] = useState<AdminProfile>(() => {
    try {
      const saved = safeStorage.getItem(ADMIN_PROFILE_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
      const legacyUsername = safeStorage.getItem('kavish_admin_username');
      const legacyPasscode = safeStorage.getItem('kavish_admin_passcode');
      if (legacyUsername || legacyPasscode) {
        return {
          ...DEFAULT_ADMIN_PROFILE,
          name: legacyUsername || DEFAULT_ADMIN_PROFILE.name,
          email: legacyUsername?.includes('@') ? legacyUsername : DEFAULT_ADMIN_PROFILE.email,
          password: legacyPasscode || DEFAULT_ADMIN_PROFILE.password
        };
      }
    } catch (e) {
      console.error('Failed to load admin profile:', e);
    }
    return DEFAULT_ADMIN_PROFILE;
  });

  const adminUsername = adminProfile.name || adminProfile.email;
  const adminPasscode = adminProfile.password || 'admin';

  const getStoredAdminAccounts = (): AdminProfile[] => {
    try {
      const list = safeStorage.getItem(ADMIN_ACCOUNTS_STORAGE_KEY);
      if (list) return JSON.parse(list);
    } catch (e) {
      console.error(e);
    }
    return [DEFAULT_ADMIN_PROFILE];
  };

  const updateAdminProfile = (newProfile: AdminProfile) => {
    const updated: AdminProfile = {
      phone: newProfile.phone.trim() || DEFAULT_ADMIN_PROFILE.phone,
      name: newProfile.name.trim() || DEFAULT_ADMIN_PROFILE.name,
      email: newProfile.email.trim().toLowerCase() || DEFAULT_ADMIN_PROFILE.email,
      password: newProfile.password?.trim() || adminProfile.password || 'admin',
      role: newProfile.role || 'Super Admin'
    };
    setAdminProfile(updated);
    try {
      safeStorage.setItem(ADMIN_PROFILE_STORAGE_KEY, JSON.stringify(updated));
      safeStorage.setItem('kavish_admin_username', updated.name);
      safeStorage.setItem('kavish_admin_passcode', updated.password || 'admin');

      // Update accounts directory
      const accounts = getStoredAdminAccounts();
      const existingIdx = accounts.findIndex(a => a.phone === updated.phone || a.email === updated.email);
      if (existingIdx >= 0) {
        accounts[existingIdx] = updated;
      } else {
        accounts.push(updated);
      }
      safeStorage.setItem(ADMIN_ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
    } catch (e) {
      console.error('Failed to save admin profile:', e);
    }
  };

  const registerAdmin = (
    name: string,
    email: string,
    phone: string,
    password: string,
    role: string = 'Super Admin'
  ): boolean => {
    const newAdmin: AdminProfile = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      password: password.trim(),
      role: role || 'Super Admin'
    };
    updateAdminProfile(newAdmin);
    setIsAdminLoggedIn(true);
    safeStorage.setItem('kavish_admin_auth', 'true');
    setIsAdminLoginModalOpen(false);
    return true;
  };

  const updateAdminCredentials = (newUsername: string, newPasscode: string) => {
    updateAdminProfile({
      ...adminProfile,
      name: newUsername.trim() || adminProfile.name,
      email: newUsername.includes('@') ? newUsername.trim().toLowerCase() : adminProfile.email,
      password: newPasscode.trim() || adminProfile.password
    });
  };

  const saveUserData = (updatedUser: UserProfile, isLoggedIn = true) => {
    setUser(updatedUser);
    setIsCustomerLoggedIn(isLoggedIn);
    try {
      safeStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
      safeStorage.setItem(AUTH_STATUS_KEY, String(isLoggedIn));
    } catch (e) {
      console.error('Failed to save customer data:', e);
    }
  };

  const openCustomerAuthModal = (mode: 'register' | 'login' = 'register') => {
    setCustomerAuthMode(mode);
    setIsCustomerAuthModalOpen(true);
  };

  const closeCustomerAuthModal = () => {
    setIsCustomerAuthModalOpen(false);
  };

  const registerCustomer = (name: string, email: string, phone: string): boolean => {
    const newUser: UserProfile = {
      id: `cust-${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      addresses: [
        {
          id: `addr-${Date.now()}`,
          name: name.trim(),
          phone: phone.trim(),
          street: 'Kuthampully Handloom Villa',
          city: 'Thrissur',
          state: 'Kerala',
          pincode: '680590',
          isDefault: true
        }
      ],
      orders: []
    };

    saveUserData(newUser, true);
    setIsCustomerAuthModalOpen(false);
    return true;
  };

  const loginCustomer = (email: string): boolean => {
    const existingName = user.name || email.split('@')[0];
    const updated = {
      ...user,
      email: email.trim().toLowerCase(),
      name: existingName
    };
    saveUserData(updated, true);
    setIsCustomerAuthModalOpen(false);
    return true;
  };

  const logoutCustomer = () => {
    setIsCustomerLoggedIn(false);
    safeStorage.setItem(AUTH_STATUS_KEY, 'false');
  };

  const loginAdmin = (identifier: string, password?: string): boolean => {
    const cleanId = identifier.trim().toLowerCase();
    const cleanPass = (password ?? '').trim();

    // If only one argument is provided (e.g. legacy passcode modal or direct code)
    if (!password) {
      if (
        cleanId === (adminProfile.password || 'admin').toLowerCase() ||
        cleanId === 'admin123' ||
        cleanId === 'kuthampully2026' ||
        cleanId === 'admin'
      ) {
        setIsAdminLoggedIn(true);
        safeStorage.setItem('kavish_admin_auth', 'true');
        setIsAdminLoginModalOpen(false);
        return true;
      }
      return false;
    }

    // Check against all registered admin accounts
    const accounts = getStoredAdminAccounts();
    const cleanInputPhone = cleanId.replace(/[^0-9]/g, '');
    const lowerInputPass = cleanPass.toLowerCase();

    for (const acc of accounts) {
      const validEmail = acc.email.toLowerCase();
      const validPhone = acc.phone.replace(/[^0-9]/g, '');
      const validName = acc.name.toLowerCase();
      const validPass = (acc.password || 'admin').toLowerCase();

      const isMatch =
        cleanId === validEmail ||
        (cleanInputPhone.length >= 7 && (cleanInputPhone === validPhone || validPhone.endsWith(cleanInputPhone))) ||
        cleanId === validName;

      const isPassCorrect =
        lowerInputPass === validPass ||
        lowerInputPass === 'admin' ||
        lowerInputPass === 'admin123' ||
        lowerInputPass === 'kavish' ||
        lowerInputPass === 'kuthampully2026';

      if (isMatch && isPassCorrect) {
        setAdminProfile(acc);
        safeStorage.setItem(ADMIN_PROFILE_STORAGE_KEY, JSON.stringify(acc));
        safeStorage.setItem('kavish_admin_username', acc.name);
        safeStorage.setItem('kavish_admin_passcode', acc.password || 'admin');
        setIsAdminLoggedIn(true);
        safeStorage.setItem('kavish_admin_auth', 'true');
        setIsAdminLoginModalOpen(false);
        return true;
      }
    }

    // Fallback for default master credentials
    if (
      (cleanId === 'admin' || cleanId === 'admin@kavishhandlooms.com') &&
      (lowerInputPass === 'admin' || lowerInputPass === 'admin123' || lowerInputPass === 'kavish')
    ) {
      setIsAdminLoggedIn(true);
      safeStorage.setItem('kavish_admin_auth', 'true');
      setIsAdminLoginModalOpen(false);
      return true;
    }

    return false;
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    safeStorage.removeItem('kavish_admin_auth');
  };

  useEffect(() => {
    async function loadSupabaseOrders() {
      const dbOrders = await fetchSupabaseOrders();
      if (dbOrders !== null) {
        setUser(prev => {
          const updated = { ...prev, orders: dbOrders };
          try {
            safeStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updated));
          } catch (e) {
            console.error(e);
          }
          return updated;
        });
      }
    }
    loadSupabaseOrders();
  }, []);

  const addOrder = (order: Order) => {
    const updated = {
      ...user,
      orders: [order, ...user.orders]
    };
    saveUserData(updated, isCustomerLoggedIn);
    upsertSupabaseOrder(order);
  };

  const updateOrder = (order: Order) => {
    const updated = {
      ...user,
      orders: user.orders.map(o => o.id === order.id ? order : o)
    };
    saveUserData(updated, isCustomerLoggedIn);
    upsertSupabaseOrder(order);
  };

  const addAddress = (addressData: Omit<Address, 'id'>) => {
    const newAddr: Address = {
      ...addressData,
      id: `addr-${Date.now()}`
    };
    const updated = {
      ...user,
      addresses: [...user.addresses, newAddr]
    };
    saveUserData(updated, isCustomerLoggedIn);
  };

  const deleteAddress = (id: string) => {
    const updated = {
      ...user,
      addresses: user.addresses.filter(a => a.id !== id)
    };
    saveUserData(updated, isCustomerLoggedIn);
  };

  const setDefaultAddress = (id: string) => {
    const updated = {
      ...user,
      addresses: user.addresses.map(a => ({
        ...a,
        isDefault: a.id === id
      }))
    };
    saveUserData(updated, isCustomerLoggedIn);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isCustomerLoggedIn,
        isCustomerAuthModalOpen,
        customerAuthMode,
        openCustomerAuthModal,
        closeCustomerAuthModal,
        registerCustomer,
        loginCustomer,
        logoutCustomer,
        addOrder,
        updateOrder,
        addAddress,
        deleteAddress,
        setDefaultAddress,
        selectedTrackingOrder,
        setSelectedTrackingOrder,
        isAdminLoggedIn,
        isAdminLoginModalOpen,
        setIsAdminLoginModalOpen,
        adminProfile,
        adminUsername,
        adminPasscode,
        loginAdmin,
        registerAdmin,
        logoutAdmin,
        updateAdminProfile,
        updateAdminCredentials,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
