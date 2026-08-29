import React, { useState } from 'react';
import {
  TrendingUp, Package, Tag, Truck, Users, Percent, RefreshCw, Navigation,
  DollarSign, BarChart3, Layout, Star, Bell, ShieldCheck, History, Settings,
  Search, Plus, LogOut, Menu, X, ArrowLeft, Globe, Image as ImageIcon
} from 'lucide-react';
const logoImg = '/assets/logo.png';
import { useAuth } from '../../context/AuthContext';
import { useAdmin } from '../../context/AdminContext';
import { NotificationCenter } from './NotificationCenter';

export type AdminTab =
  | 'overview'
  | 'banners'
  | 'products'
  | 'categories'
  | 'inventory'
  | 'orders'
  | 'customers'
  | 'discounts'
  | 'returns'
  | 'shipping'
  | 'financials'
  | 'analytics'
  | 'content'
  | 'reviews'
  | 'notifications'
  | 'roles'
  | 'audit'
  | 'settings';

interface AdminLayoutProps {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  children: React.ReactNode;
  onNavigateHome: () => void;
  onOpenAddProductModal?: () => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  activeTab,
  setActiveTab,
  children,
  onNavigateHome,
  onOpenAddProductModal
}) => {
  const { logoutAdmin, adminProfile } = useAuth();
  const { notifications } = useAdmin();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifDrawerOpen, setNotifDrawerOpen] = useState(false);
  const [quickSearch, setQuickSearch] = useState('');

  const unreadNotifCount = notifications.filter(n => !n.read).length;

  const navItems: { id: AdminTab; label: string; icon: any; badge?: string }[] = [
    { id: 'overview', label: 'Dashboard Overview', icon: TrendingUp },
    { id: 'banners', label: 'Banner & Hero CMS', icon: ImageIcon, badge: 'Hero' },
    { id: 'orders', label: 'Order Management', icon: Truck, badge: 'Live' },
    { id: 'products', label: 'Product Catalog', icon: Package },
    { id: 'categories', label: 'Category Manager', icon: Layout },
    { id: 'inventory', label: 'Inventory Control', icon: Tag, badge: 'Stock' },
    { id: 'customers', label: 'Customer CRM', icon: Users },
    { id: 'discounts', label: 'Discounts & Coupons', icon: Percent },
    { id: 'returns', label: 'Returns & Refunds', icon: RefreshCw },
    { id: 'shipping', label: 'Shipping & Logistics', icon: Navigation },
    { id: 'financials', label: 'GST & Financials', icon: DollarSign },
    { id: 'analytics', label: 'Analytics & Reports', icon: BarChart3 },
    { id: 'content', label: 'Storefront Content', icon: Globe },
    { id: 'reviews', label: 'Reviews & Feedback', icon: Star },
    { id: 'notifications', label: 'Notifications Center', icon: Bell, badge: unreadNotifCount > 0 ? String(unreadNotifCount) : undefined },
    { id: 'roles', label: 'Admin Roles & RBAC', icon: ShieldCheck },
    { id: 'audit', label: 'Audit Trail Logs', icon: History },
    { id: 'settings', label: 'Store Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F1] flex flex-col font-sans text-[#171717]">
      
      {/* TOPBAR HEADER */}
      <header className="bg-[#12372A] text-[#FAF8F1] sticky top-0 z-40 px-4 sm:px-6 py-3 flex items-center justify-between shadow-md">
        
        {/* Left Branding & Mobile Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-1.5 text-[#D4AF37] hover:bg-white/10 rounded-lg"
            title="Toggle Menu"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div onClick={onNavigateHome} className="cursor-pointer flex items-center gap-3 group">
            <div className="bg-[#FAF8F1] px-2.5 py-1 rounded-xl shadow-xs flex items-center">
              <img
                src={logoImg}
                alt="KAVISH"
                className="h-7 sm:h-8 w-auto object-contain"
              />
            </div>
            <span className="bg-[#D4AF37] text-[#12372A] text-[9px] uppercase font-bold px-2 py-0.5 rounded-full font-mono hidden sm:inline-block">
              Atelier OS
            </span>
          </div>
        </div>

        {/* Global Command / Quick Search Input */}
        <div className="hidden md:flex items-center relative max-w-md w-full mx-4">
          <Search className="w-4 h-4 text-[#D4AF37] absolute left-3" />
          <input
            type="text"
            value={quickSearch}
            onChange={(e) => setQuickSearch(e.target.value)}
            placeholder="Search orders, SKU, customer name, coupon..."
            className="w-full bg-[#0B241B] border border-[#D4AF37]/40 text-xs text-[#FAF8F1] pl-9 pr-4 py-2 rounded-xl focus:outline-none focus:border-[#D4AF37] placeholder:text-[#E8DDC7]/60 font-sans"
          />
        </div>

        {/* Right Actions: Return to Storefront, Quick Actions, Notifications, Admin Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Return to Storefront Button in Top Right */}
          <button
            onClick={onNavigateHome}
            className="bg-[#0B241B] hover:bg-[#D4AF37] hover:text-[#12372A] text-[#FAF8F1] border border-[#D4AF37]/50 px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            title="Return to Customer Storefront"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="hidden sm:inline">Return to Storefront</span>
            <span className="sm:hidden">Store</span>
          </button>

          {onOpenAddProductModal && (
            <button
              onClick={onOpenAddProductModal}
              className="hidden md:flex bg-[#D4AF37] text-[#12372A] px-3 py-1.5 text-xs font-bold uppercase rounded-xl hover:bg-[#FAF8F1] transition-all items-center gap-1 shadow-sm cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Product</span>
            </button>
          )}

          {/* Notifications Trigger */}
          <button
            onClick={() => setNotifDrawerOpen(true)}
            className="p-2 bg-[#0B241B] border border-[#D4AF37]/40 text-[#D4AF37] rounded-xl relative hover:bg-[#D4AF37] hover:text-[#12372A] transition-all cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center border border-white">
                {unreadNotifCount}
              </span>
            )}
          </button>

          {/* Admin User Profile */}
          <div className="flex items-center gap-2 bg-[#0B241B] border border-[#D4AF37]/40 px-3 py-1.5 rounded-xl text-xs">
            <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
            <div className="hidden lg:block text-left">
              <span className="font-bold text-[#FAF8F1] block leading-tight">{adminProfile.name}</span>
              <span className="text-[9px] text-[#D4AF37] uppercase font-mono">{adminProfile.email}</span>
            </div>
            <button
              onClick={() => {
                logoutAdmin();
                onNavigateHome();
              }}
              className="text-[#E8DDC7]/70 hover:text-red-400 p-1 ml-1 cursor-pointer"
              title="Sign Out Admin"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        
        {/* SIDEBAR NAVIGATION */}
        <aside
          className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-[#12372A] text-[#FAF8F1] flex flex-col justify-between transition-transform duration-300 transform ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          {/* Nav List */}
          <div className="py-4 px-3 space-y-1 overflow-y-auto flex-1 max-h-[calc(100vh-65px)]">
            <div className="px-3 py-1.5 text-[10px] uppercase font-bold tracking-widest text-[#D4AF37] border-b border-white/10 mb-2">
              Internal Modules
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#D4AF37] text-[#12372A] shadow-md font-bold'
                      : 'text-[#E8DDC7]/90 hover:bg-white/10 hover:text-[#FAF8F1]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#12372A]' : 'text-[#D4AF37]'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        isActive ? 'bg-[#12372A] text-[#D4AF37]' : 'bg-[#0B241B] text-[#D4AF37] border border-[#D4AF37]/40'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </aside>

        {/* MAIN ADMIN CONTENT CONTAINER */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {children}
        </main>
      </div>

      {/* NOTIFICATIONS DRAWER OVERLAY */}
      {notifDrawerOpen && (
        <NotificationCenter onClose={() => setNotifDrawerOpen(false)} />
      )}

    </div>
  );
};
