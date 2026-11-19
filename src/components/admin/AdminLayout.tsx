'use client';

import React, { useState } from 'react';
import {
  TrendingUp, Package, Truck, Users, Percent, Navigation,
  DollarSign, BarChart3, Layout, Star, Bell, ShieldCheck, History, Settings,
  Search, Plus, LogOut, Menu, X, ArrowLeft, Globe, Image as ImageIcon,
  Kanban, Layers, RotateCcw
} from 'lucide-react';
const logoImg = '/assets/logo.png';
import { useAuth } from '../../context/AuthContext';
import { useAdmin } from '../../context/AdminContext';
import { NotificationCenter } from './NotificationCenter';

export type AdminTab =
  | 'overview'
  | 'orders'
  | 'pipeline'
  | 'products'
  | 'categories'
  | 'inventory'
  | 'customers'
  | 'discounts'
  | 'financials'
  | 'shipping'
  | 'returns'
  | 'reviews'
  | 'analytics'
  | 'roles'
  | 'settings'
  | 'banners'
  | 'content'
  | 'notifications'
  | 'audit';

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
  const { notifications, returnRequests } = useAdmin();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifDrawerOpen, setNotifDrawerOpen] = useState(false);
  const [quickSearch, setQuickSearch] = useState('');

  const unreadNotifCount = notifications.filter(n => !n.read).length;
  const pendingReturnsCount = returnRequests.filter(r => r.status === 'Requested' || r.status === 'Under Review').length;

  // 15 Standard Core Navigation items ordered according to the luxury ERP specification
  const navItems: { id: AdminTab; label: string; icon: any; badge?: string }[] = [
    { id: 'overview', label: '1. Dashboard', icon: TrendingUp },
    { id: 'orders', label: '2. Orders', icon: Truck, badge: 'Live' },
    { id: 'pipeline', label: '3. Order Pipeline', icon: Kanban, badge: 'Kanban' },
    { id: 'products', label: '4. Products', icon: Package },
    { id: 'categories', label: '5. Categories', icon: Layout },
    { id: 'inventory', label: '6. Inventory', icon: Layers, badge: 'Alerts' },
    { id: 'customers', label: '7. Customers', icon: Users },
    { id: 'discounts', label: '8. Coupons & Offers', icon: Percent },
    { id: 'financials', label: '9. Payments & GST', icon: DollarSign },
    { id: 'shipping', label: '10. Shipping & Logistics', icon: Navigation },
    { id: 'returns', label: '11. Returns & Refunds', icon: RotateCcw, badge: pendingReturnsCount > 0 ? String(pendingReturnsCount) : undefined },
    { id: 'reviews', label: '12. Reviews', icon: Star },
    { id: 'analytics', label: '13. Analytics & Reports', icon: BarChart3 },
    { id: 'roles', label: '14. Staff & Permissions', icon: ShieldCheck },
    { id: 'settings', label: '15. Store Settings', icon: Settings },
    // Ancillary CMS & Governance tools
    { id: 'banners', label: 'Hero Banners CMS', icon: ImageIcon },
    { id: 'content', label: 'Store Content CMS', icon: Globe },
    { id: 'notifications', label: 'Notification Center', icon: Bell, badge: unreadNotifCount > 0 ? String(unreadNotifCount) : undefined },
    { id: 'audit', label: 'Audit Trail Logs', icon: History },
  ];

  return (
    <div className="min-h-screen bg-[#FFFFFF] flex flex-col font-sans text-[#1A1A1A]">
      
      {/* TOPBAR HEADER */}
      <header className="bg-[#111111] text-[#FFFFFF] sticky top-0 z-40 px-4 sm:px-6 py-3 flex items-center justify-between shadow-md border-b border-[#C5A15A]/30">
        
        {/* Left Branding & Mobile Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-1.5 text-[#C5A15A] hover:bg-white/10 rounded-lg"
            title="Toggle Menu"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div onClick={onNavigateHome} className="cursor-pointer flex items-center gap-3 group">
            <div className="bg-[#FFFFFF] px-2.5 py-1 rounded-xl shadow-xs flex items-center">
              <img
                src={logoImg}
                alt="KAVISH"
                className="h-7 sm:h-8 w-auto object-contain"
              />
            </div>
            <span className="bg-[#C5A15A] text-[#111111] text-[9px] uppercase font-bold px-2 py-0.5 rounded-full font-mono hidden sm:inline-block">
              Atelier OS ERP
            </span>
          </div>
        </div>

        {/* Global Command / Quick Search Input */}
        <div className="hidden md:flex items-center relative max-w-md w-full mx-4">
          <Search className="w-4 h-4 text-[#C5A15A] absolute left-3" />
          <input
            type="text"
            value={quickSearch}
            onChange={(e) => setQuickSearch(e.target.value)}
            placeholder="Search orders, SKU, customer name, coupon..."
            className="w-full bg-[#000000] border border-[#C5A15A]/40 text-xs text-[#FFFFFF] pl-9 pr-4 py-2 rounded-xl focus:outline-none focus:border-[#C5A15A] placeholder:text-[#E5E7EB]/60 font-sans"
          />
        </div>

        {/* Right Actions: Return to Storefront, Quick Actions, Notifications, Admin Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Return to Storefront Button in Top Right */}
          <button
            onClick={onNavigateHome}
            className="bg-[#000000] hover:bg-[#C5A15A] hover:text-[#111111] text-[#FFFFFF] border border-[#C5A15A]/50 px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            title="Return to Customer Storefront"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#C5A15A]" />
            <span className="hidden sm:inline">Storefront</span>
            <span className="sm:hidden">Store</span>
          </button>

          {onOpenAddProductModal && (
            <button
              onClick={onOpenAddProductModal}
              className="hidden md:flex bg-[#C5A15A] text-[#111111] px-3 py-1.5 text-xs font-bold uppercase rounded-xl hover:bg-[#FFFFFF] transition-all items-center gap-1 shadow-sm cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Product</span>
            </button>
          )}

          {/* Notifications Trigger */}
          <button
            onClick={() => setNotifDrawerOpen(true)}
            className="p-2 bg-[#000000] border border-[#C5A15A]/40 text-[#C5A15A] rounded-xl relative hover:bg-[#C5A15A] hover:text-[#111111] transition-all cursor-pointer"
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
          <div className="flex items-center gap-2 bg-[#000000] border border-[#C5A15A]/40 px-3 py-1.5 rounded-xl text-xs">
            <ShieldCheck className="w-4 h-4 text-[#C5A15A]" />
            <div className="hidden lg:block text-left">
              <span className="font-bold text-[#FFFFFF] block leading-tight">{adminProfile.name}</span>
              <span className="text-[9px] text-[#C5A15A] uppercase font-mono">{adminProfile.role || 'Super Admin'}</span>
            </div>
            <button
              onClick={() => {
                logoutAdmin();
                onNavigateHome();
              }}
              className="text-[#E5E7EB]/70 hover:text-red-400 p-1 ml-1 cursor-pointer"
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
          className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-[#111111] text-[#FFFFFF] flex flex-col justify-between transition-transform duration-300 transform border-r border-[#C5A15A]/20 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          {/* Nav List */}
          <div className="py-4 px-3 space-y-1 overflow-y-auto flex-1 max-h-[calc(100vh-65px)]">
            <div className="px-3 py-1.5 text-[10px] uppercase font-bold tracking-widest text-[#C5A15A] border-b border-white/10 mb-2 flex items-center justify-between">
              <span>Administration</span>
              <span className="text-[9px] text-[#E5E7EB]/60">15 Modules</span>
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
                  className={`w-full px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#C5A15A] text-[#111111] shadow-md font-bold'
                      : 'text-[#E5E7EB]/90 hover:bg-white/10 hover:text-[#FFFFFF]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#111111]' : 'text-[#C5A15A]'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase shrink-0 ${
                        isActive ? 'bg-[#111111] text-[#C5A15A]' : 'bg-[#000000] text-[#C5A15A] border border-[#C5A15A]/40'
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
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 bg-[#FFFFFF]">
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
