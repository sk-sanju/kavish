'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { AdminLayout, type AdminTab } from '../components/admin/AdminLayout';
import { AdminLoginPage } from './AdminLoginPage';
import { DashboardOverview } from '../components/admin/DashboardOverview';
import { BannerManagement } from '../components/admin/BannerManagement';
import { ProductManagement } from '../components/admin/ProductManagement';
import { CategoryManagement } from '../components/admin/CategoryManagement';
import { OrderManagement } from '../components/admin/OrderManagement';
import { OrderPipeline } from '../components/admin/OrderPipeline';
import { InventoryManagement } from '../components/admin/InventoryManagement';
import { ReturnsRefundsManagement } from '../components/admin/ReturnsRefundsManagement';
import { CustomerManagement } from '../components/admin/CustomerManagement';
import { DiscountManagement } from '../components/admin/DiscountManagement';
import { ShippingManagement } from '../components/admin/ShippingManagement';
import { FinancialManagement } from '../components/admin/FinancialManagement';
import { AnalyticsReports } from '../components/admin/AnalyticsReports';
import { ContentManagement } from '../components/admin/ContentManagement';
import { ReviewManagement } from '../components/admin/ReviewManagement';
import { RoleManagement } from '../components/admin/RoleManagement';
import { AuditTrail } from '../components/admin/AuditTrail';
import { SettingsManagement } from '../components/admin/SettingsManagement';
import { NotificationCenter } from '../components/admin/NotificationCenter';

export const AdminDashboard: React.FC = () => {
  const { isAdminLoggedIn } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  if (!isAdminLoggedIn) {
    return <AdminLoginPage />;
  }

  return (
    <AdminLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      onNavigateHome={() => router.push('/')}
    >
      {activeTab === 'overview' && <DashboardOverview onNavigateTab={setActiveTab} />}
      {activeTab === 'orders' && <OrderManagement />}
      {activeTab === 'pipeline' && <OrderPipeline />}
      {activeTab === 'products' && <ProductManagement />}
      {activeTab === 'categories' && <CategoryManagement />}
      {activeTab === 'inventory' && <InventoryManagement />}
      {activeTab === 'customers' && <CustomerManagement />}
      {activeTab === 'discounts' && <DiscountManagement />}
      {activeTab === 'financials' && <FinancialManagement />}
      {activeTab === 'shipping' && <ShippingManagement />}
      {activeTab === 'returns' && <ReturnsRefundsManagement />}
      {activeTab === 'reviews' && <ReviewManagement />}
      {activeTab === 'analytics' && <AnalyticsReports />}
      {activeTab === 'roles' && <RoleManagement />}
      {activeTab === 'settings' && <SettingsManagement />}
      {activeTab === 'banners' && <BannerManagement />}
      {activeTab === 'content' && <ContentManagement />}
      {activeTab === 'audit' && <AuditTrail />}
      {activeTab === 'notifications' && (
        <>
          <DashboardOverview onNavigateTab={setActiveTab} />
          <NotificationCenter onClose={() => setActiveTab('overview')} />
        </>
      )}
    </AdminLayout>
  );
};
