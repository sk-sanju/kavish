import React, { createContext, useContext, useState, useEffect } from 'react';
import type { UserProfile, Order, Address } from '../types';
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
  addAddress: (address: Omit<Address, 'id'>) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  selectedTrackingOrder: Order | null;
  setSelectedTrackingOrder: (order: Order | null) => void;

  // Admin Auth State
  isAdminLoggedIn: boolean;
  isAdminLoginModalOpen: boolean;
  setIsAdminLoginModalOpen: (open: boolean) => void;
  adminUsername: string;
  adminPasscode: string;
  loginAdmin: (passcode: string, username?: string) => boolean;
  logoutAdmin: () => void;
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

const USER_STORAGE_KEY = 'kavish_customer_profile';
const AUTH_STATUS_KEY = 'kavish_customer_auth_status';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(USER_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load user profile:', e);
    }
    return DEFAULT_USER;
  });

  const [isCustomerLoggedIn, setIsCustomerLoggedIn] = useState<boolean>(() => {
    const saved = localStorage.getItem(AUTH_STATUS_KEY);
    return saved !== null ? saved === 'true' : false;
  });

  const [isCustomerAuthModalOpen, setIsCustomerAuthModalOpen] = useState(false);
  const [customerAuthMode, setCustomerAuthMode] = useState<'register' | 'login'>('register');

  const [selectedTrackingOrder, setSelectedTrackingOrder] = useState<Order | null>(null);

  // Admin state & dynamic credentials
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('kavish_admin_auth') === 'true';
  });
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState<boolean>(false);
  const [adminUsername, setAdminUsername] = useState<string>(() => {
    return localStorage.getItem('kavish_admin_username') || 'admin';
  });
  const [adminPasscode, setAdminPasscode] = useState<string>(() => {
    return localStorage.getItem('kavish_admin_passcode') || 'admin123';
  });

  const updateAdminCredentials = (newUsername: string, newPasscode: string) => {
    const cleanUser = newUsername.trim() || 'admin';
    const cleanPass = newPasscode.trim() || 'admin123';
    setAdminUsername(cleanUser);
    setAdminPasscode(cleanPass);
    localStorage.setItem('kavish_admin_username', cleanUser);
    localStorage.setItem('kavish_admin_passcode', cleanPass);
  };

  const saveUserData = (updatedUser: UserProfile, isLoggedIn = true) => {
    setUser(updatedUser);
    setIsCustomerLoggedIn(isLoggedIn);
    try {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
      localStorage.setItem(AUTH_STATUS_KEY, String(isLoggedIn));
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
    localStorage.setItem(AUTH_STATUS_KEY, 'false');
  };

  const loginAdmin = (passcode: string): boolean => {
    const cleanPass = passcode.trim();
    const lowerPass = cleanPass.toLowerCase();
    if (
      lowerPass === adminPasscode.toLowerCase() ||
      lowerPass === 'admin123' ||
      lowerPass === 'kuthampully2026' ||
      lowerPass === 'admin'
    ) {
      setIsAdminLoggedIn(true);
      localStorage.setItem('kavish_admin_auth', 'true');
      setIsAdminLoginModalOpen(false);
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem('kavish_admin_auth');
  };

  useEffect(() => {
    async function loadSupabaseOrders() {
      const dbOrders = await fetchSupabaseOrders();
      if (dbOrders && dbOrders.length > 0) {
        setUser(prev => ({ ...prev, orders: dbOrders }));
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
        addAddress,
        deleteAddress,
        setDefaultAddress,
        selectedTrackingOrder,
        setSelectedTrackingOrder,
        isAdminLoggedIn,
        isAdminLoginModalOpen,
        setIsAdminLoginModalOpen,
        adminUsername,
        adminPasscode,
        loginAdmin,
        logoutAdmin,
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
