import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AdminLayout, type AdminTab } from '../components/admin/AdminLayout';
import { AdminLoginPage } from './AdminLoginPage';
import { DashboardOverview } from '../components/admin/DashboardOverview';
import { BannerManagement } from '../components/admin/BannerManagement';
import { ProductManagement } from '../components/admin/ProductManagement';
import { CategoryManagement } from '../components/admin/CategoryManagement';
import { InventoryManagement } from '../components/admin/InventoryManagement';
import { OrderManagement } from '../components/admin/OrderManagement';
import { CustomerManagement } from '../components/admin/CustomerManagement';
import { DiscountManagement } from '../components/admin/DiscountManagement';
import { ReturnsManagement } from '../components/admin/ReturnsManagement';
import { ShippingManagement } from '../components/admin/ShippingManagement';
import { FinancialManagement } from '../components/admin/FinancialManagement';
import { AnalyticsReports } from '../components/admin/AnalyticsReports';
import { ContentManagement } from '../components/admin/ContentManagement';
import { ReviewManagement } from '../components/admin/ReviewManagement';
import { RoleManagement } from '../components/admin/RoleManagement';
import { AuditTrail } from '../components/admin/AuditTrail';
import { SettingsManagement } from '../components/admin/SettingsManagement';

export const AdminDashboard: React.FC = () => {
  const { isAdminLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  if (!isAdminLoggedIn) {
    return <AdminLoginPage />;
  }

  return (
    <AdminLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      onNavigateHome={() => navigate('/')}
    >
      {activeTab === 'overview' && <DashboardOverview onNavigateTab={setActiveTab} />}
      {activeTab === 'banners' && <BannerManagement />}
      {activeTab === 'products' && <ProductManagement />}
      {activeTab === 'categories' && <CategoryManagement />}
      {activeTab === 'inventory' && <InventoryManagement />}
      {activeTab === 'orders' && <OrderManagement />}
      {activeTab === 'customers' && <CustomerManagement />}
      {activeTab === 'discounts' && <DiscountManagement />}
      {activeTab === 'returns' && <ReturnsManagement />}
      {activeTab === 'shipping' && <ShippingManagement />}
      {activeTab === 'financials' && <FinancialManagement />}
      {activeTab === 'analytics' && <AnalyticsReports />}
      {activeTab === 'content' && <ContentManagement />}
      {activeTab === 'reviews' && <ReviewManagement />}
      {activeTab === 'roles' && <RoleManagement />}
      {activeTab === 'audit' && <AuditTrail />}
      {activeTab === 'settings' && <SettingsManagement />}
      {activeTab === 'notifications' && <DashboardOverview onNavigateTab={setActiveTab} />}
    </AdminLayout>
  );
};
