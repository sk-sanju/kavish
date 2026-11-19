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
    <div className="min-h-screen bg-[#F8F5EF] flex flex-col font-sans text-[#292722]">
      
      {/* TOPBAR HEADER */}
      <header className="bg-[#641E2B] text-[#F8F5EF] sticky top-0 z-40 px-4 sm:px-6 py-3 flex items-center justify-between shadow-md border-b border-[#B99A61]/30">
        
        {/* Left Branding & Mobile Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-1.5 text-[#B99A61] hover:bg-white/10 rounded-lg"
            title="Toggle Menu"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div onClick={onNavigateHome} className="cursor-pointer flex items-center gap-3 group">
            <div className="bg-[#F8F5EF] px-2.5 py-1 rounded-xl shadow-xs flex items-center">
              <img
                src={logoImg}
                alt="KAVISH"
                className="h-7 sm:h-8 w-auto object-contain"
              />
            </div>
            <span className="bg-[#B99A61] text-[#641E2B] text-[9px] uppercase font-bold px-2 py-0.5 rounded-full font-mono hidden sm:inline-block">
              Atelier OS ERP
            </span>
          </div>
        </div>

        {/* Global Command / Quick Search Input */}
        <div className="hidden md:flex items-center relative max-w-md w-full mx-4">
          <Search className="w-4 h-4 text-[#B99A61] absolute left-3" />
          <input
            type="text"
            value={quickSearch}
            onChange={(e) => setQuickSearch(e.target.value)}
            placeholder="Search orders, SKU, customer name, coupon..."
            className="w-full bg-[#46141D] border border-[#B99A61]/40 text-xs text-[#F8F5EF] pl-9 pr-4 py-2 rounded-xl focus:outline-none focus:border-[#B99A61] placeholder:text-[#E8DFD0]/60 font-sans"
          />
        </div>

        {/* Right Actions: Return to Storefront, Quick Actions, Notifications, Admin Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Return to Storefront Button in Top Right */}
          <button
            onClick={onNavigateHome}
            className="bg-[#46141D] hover:bg-[#B99A61] hover:text-[#641E2B] text-[#F8F5EF] border border-[#B99A61]/50 px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            title="Return to Customer Storefront"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#B99A61]" />
            <span className="hidden sm:inline">Storefront</span>
            <span className="sm:hidden">Store</span>
          </button>

          {onOpenAddProductModal && (
            <button
              onClick={onOpenAddProductModal}
              className="hidden md:flex bg-[#B99A61] text-[#641E2B] px-3 py-1.5 text-xs font-bold uppercase rounded-xl hover:bg-[#F8F5EF] transition-all items-center gap-1 shadow-sm cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Product</span>
            </button>
          )}

          {/* Notifications Trigger */}
          <button
            onClick={() => setNotifDrawerOpen(true)}
            className="p-2 bg-[#46141D] border border-[#B99A61]/40 text-[#B99A61] rounded-xl relative hover:bg-[#B99A61] hover:text-[#641E2B] transition-all cursor-pointer"
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
          <div className="flex items-center gap-2 bg-[#46141D] border border-[#B99A61]/40 px-3 py-1.5 rounded-xl text-xs">
            <ShieldCheck className="w-4 h-4 text-[#B99A61]" />
            <div className="hidden lg:block text-left">
              <span className="font-bold text-[#F8F5EF] block leading-tight">{adminProfile.name}</span>
              <span className="text-[9px] text-[#B99A61] uppercase font-mono">{adminProfile.role || 'Super Admin'}</span>
            </div>
            <button
              onClick={() => {
                logoutAdmin();
                onNavigateHome();
              }}
              className="text-[#E8DFD0]/70 hover:text-red-400 p-1 ml-1 cursor-pointer"
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
          className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-[#641E2B] text-[#F8F5EF] flex flex-col justify-between transition-transform duration-300 transform border-r border-[#B99A61]/20 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          {/* Nav List */}
          <div className="py-4 px-3 space-y-1 overflow-y-auto flex-1 max-h-[calc(100vh-65px)]">
            <div className="px-3 py-1.5 text-[10px] uppercase font-bold tracking-widest text-[#B99A61] border-b border-white/10 mb-2 flex items-center justify-between">
              <span>Administration</span>
              <span className="text-[9px] text-[#E8DFD0]/60">15 Modules</span>
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
                      ? 'bg-[#B99A61] text-[#641E2B] shadow-md font-bold'
                      : 'text-[#E8DFD0]/90 hover:bg-white/10 hover:text-[#F8F5EF]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#641E2B]' : 'text-[#B99A61]'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase shrink-0 ${
                        isActive ? 'bg-[#641E2B] text-[#B99A61]' : 'bg-[#46141D] text-[#B99A61] border border-[#B99A61]/40'
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
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 bg-[#F8F5EF]">
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
