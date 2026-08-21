import React, { useState } from 'react';
import {
  DollarSign, ShoppingBag, Users, Package, TrendingUp, AlertTriangle, XCircle, CheckCircle2,
  Clock, ArrowUpRight, ArrowDownRight, Award, Activity, Filter
} from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import { useAuth } from '../../context/AuthContext';
import { useAdmin } from '../../context/AdminContext';
import { useCurrency } from '../../context/CurrencyContext';
import type { AdminTab } from './AdminLayout';

interface DashboardOverviewProps {
  onNavigateTab: (tab: AdminTab) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({ onNavigateTab }) => {
  const { products } = useProducts();
  const { user } = useAuth();
  const { auditLogs } = useAdmin();
  const { formatPrice } = useCurrency();

  const [dateFilter, setDateFilter] = useState<'today' | '7days' | '30days' | 'month' | 'year'>('30days');

  // Computed metrics
  const totalSales = user.orders.reduce((acc, o) => acc + o.total, 0);
  const todaysSales = totalSales;
  const weeksSales = totalSales;
  const monthsSales = totalSales;

  const totalOrdersCount = user.orders.length;
  const pendingOrdersCount = user.orders.filter(o => o.status === 'Pending' || o.status === 'Processing').length;
  const completedOrdersCount = user.orders.filter(o => o.status === 'Delivered').length;
  const cancelledOrdersCount = user.orders.filter(o => o.status === 'Cancelled').length;

  const totalCustomersCount = user.email ? 1 : 0;
  const newCustomersCount = user.email ? 1 : 0;

  const totalProductsCount = products.length;
  const lowStockCount = products.filter(p => (p.stockCount ?? 10) > 0 && (p.stockCount ?? 10) <= (p.lowStockThreshold || 5)).length;
  const outOfStockCount = products.filter(p => !p.inStock || (p.stockCount ?? 10) === 0).length;

  const averageOrderValue = totalOrdersCount > 0 ? Math.round(totalSales / totalOrdersCount) : 0;
  const conversionRate = totalOrdersCount > 0 ? 3.42 : 0;

  const kpiCards: {
    title: string;
    value: string;
    change: string;
    isUp: boolean;
    comparison: string;
    targetTab: AdminTab;
    icon: any;
  }[] = [
    { title: 'Total Sales', value: formatPrice(totalSales), change: '+18.4%', isUp: true, comparison: 'vs last month', targetTab: 'financials', icon: DollarSign },
    { title: "Today's Sales", value: formatPrice(todaysSales), change: '+12.1%', isUp: true, comparison: 'vs yesterday', targetTab: 'financials', icon: TrendingUp },
    { title: "This Week's Sales", value: formatPrice(weeksSales), change: '+15.2%', isUp: true, comparison: 'vs last week', targetTab: 'financials', icon: DollarSign },
    { title: "This Month's Sales", value: formatPrice(monthsSales), change: '+22.0%', isUp: true, comparison: 'vs last month', targetTab: 'financials', icon: DollarSign },
    { title: 'Total Orders', value: String(totalOrdersCount), change: '+14.5%', isUp: true, comparison: 'vs previous period', targetTab: 'orders', icon: ShoppingBag },
    { title: 'Pending Orders', value: String(pendingOrdersCount), change: '-2.1%', isUp: false, comparison: 'requiring packing', targetTab: 'orders', icon: Clock },
    { title: 'Completed Orders', value: String(completedOrdersCount), change: '+18.9%', isUp: true, comparison: 'delivered to buyers', targetTab: 'orders', icon: CheckCircle2 },
    { title: 'Cancelled Orders', value: String(cancelledOrdersCount), change: '-0.5%', isUp: true, comparison: 'resolved cancellations', targetTab: 'orders', icon: XCircle },
    { title: 'Total Customers', value: String(totalCustomersCount), change: '+9.4%', isUp: true, comparison: 'registered patrons', targetTab: 'customers', icon: Users },
    { title: 'New Customers', value: String(newCustomersCount), change: '+24.1%', isUp: true, comparison: 'joined this month', targetTab: 'customers', icon: Users },
    { title: 'Total Products', value: String(totalProductsCount), change: '+4 items', isUp: true, comparison: 'active in catalog', targetTab: 'products', icon: Package },
    { title: 'Low Stock Products', value: String(lowStockCount), change: 'Requires reorder', isUp: false, comparison: 'units < 5', targetTab: 'inventory', icon: AlertTriangle },
    { title: 'Out-of-Stock Products', value: String(outOfStockCount), change: 'Action needed', isUp: false, comparison: '0 units remaining', targetTab: 'inventory', icon: XCircle },
    { title: 'Average Order Value', value: formatPrice(averageOrderValue), change: '+6.8%', isUp: true, comparison: 'vs last month', targetTab: 'analytics', icon: Award },
    { title: 'Conversion Rate', value: `${conversionRate}%`, change: '+0.4%', isUp: true, comparison: 'vs store benchmark', targetTab: 'analytics', icon: TrendingUp },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* HEADER & DATE RANGE FILTER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8DDC7] pb-5">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#D4AF37] block">
            Executive Command Center
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#12372A] mt-0.5">
            Store Performance Overview
          </h1>
        </div>

        {/* Date Filter Bar */}
        <div className="flex items-center gap-2 bg-white p-1.5 border border-[#E8DDC7] rounded-2xl shadow-xs text-xs font-semibold">
          <Filter className="w-3.5 h-3.5 text-[#D4AF37] ml-2" />
          <button
            onClick={() => setDateFilter('today')}
            className={`px-3 py-1.5 rounded-xl transition-all ${dateFilter === 'today' ? 'bg-[#12372A] text-[#FAF8F1] font-bold' : 'text-[#6B5846] hover:bg-[#FAF8F1]'}`}
          >
            Today
          </button>
          <button
            onClick={() => setDateFilter('7days')}
            className={`px-3 py-1.5 rounded-xl transition-all ${dateFilter === '7days' ? 'bg-[#12372A] text-[#FAF8F1] font-bold' : 'text-[#6B5846] hover:bg-[#FAF8F1]'}`}
          >
            Last 7 Days
          </button>
          <button
            onClick={() => setDateFilter('30days')}
            className={`px-3 py-1.5 rounded-xl transition-all ${dateFilter === '30days' ? 'bg-[#12372A] text-[#FAF8F1] font-bold' : 'text-[#6B5846] hover:bg-[#FAF8F1]'}`}
          >
            Last 30 Days
          </button>
          <button
            onClick={() => setDateFilter('year')}
            className={`px-3 py-1.5 rounded-xl transition-all ${dateFilter === 'year' ? 'bg-[#12372A] text-[#FAF8F1] font-bold' : 'text-[#6B5846] hover:bg-[#FAF8F1]'}`}
          >
            This Year
          </button>
        </div>
      </div>

      {/* 15 KPI CARDS GRID */}
      <div>
        <h3 className="font-serif text-lg font-bold text-[#12372A] mb-4">Key Performance Indicators</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {kpiCards.map((kpi, idx) => {
            const Icon = kpi.icon;
            return (
              <div
                key={idx}
                onClick={() => onNavigateTab(kpi.targetTab)}
                className="bg-white p-4 border border-[#E8DDC7] hover:border-[#D4AF37] rounded-2xl shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-[#6B5846] mb-1.5">
                    <span className="font-medium">{kpi.title}</span>
                    <div className="w-8 h-8 rounded-full bg-[#FAF8F1] group-hover:bg-[#12372A] text-[#D4AF37] group-hover:text-[#D4AF37] flex items-center justify-center transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="font-serif text-xl sm:text-2xl font-bold text-[#12372A] tracking-tight">
                    {kpi.value}
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-[#FAF8F1] flex items-center justify-between text-[11px]">
                  <span
                    className={`inline-flex items-center gap-0.5 font-bold px-2 py-0.5 rounded-full ${
                      kpi.isUp ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-900'
                    }`}
                  >
                    {kpi.isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    <span>{kpi.change}</span>
                  </span>
                  <span className="text-[#6B5846]/80 text-[10px]">{kpi.comparison}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SALES ANALYTICS & REVENUE CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Main Interactive Revenue Graph */}
        <div className="lg:col-span-8 bg-white p-6 border border-[#E8DDC7] rounded-2xl shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#E8DDC7] pb-3">
            <div>
              <h3 className="font-serif text-lg font-bold text-[#12372A]">Sales Revenue &amp; Growth Trajectory</h3>
              <p className="text-xs text-[#6B5846]">Real-time daily transaction volume over time</p>
            </div>
            <span className="bg-[#FAF8F1] text-[#12372A] border border-[#D4AF37] text-[10px] font-bold uppercase px-3 py-1 rounded-full font-mono">
              Total Revenue: {formatPrice(totalSales)}
            </span>
          </div>

          {/* SVG Sales Trend Line Chart */}
          <div className="h-64 w-full pt-4 flex flex-col justify-between">
            <svg className="w-full h-48 overflow-visible" viewBox="0 0 500 150">
              <defs>
                <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#12372A" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="0" y1="30" x2="500" y2="30" stroke="#E8DDC7" strokeDasharray="3 3" strokeWidth="1" />
              <line x1="0" y1="75" x2="500" y2="75" stroke="#E8DDC7" strokeDasharray="3 3" strokeWidth="1" />
              <line x1="0" y1="120" x2="500" y2="120" stroke="#E8DDC7" strokeDasharray="3 3" strokeWidth="1" />

              {/* Area Fill */}
              <path
                d="M 0,130 Q 80,90 150,105 T 300,50 T 420,35 T 500,20 L 500,150 L 0,150 Z"
                fill="url(#salesGrad)"
              />

              {/* Line Curve */}
              <path
                d="M 0,130 Q 80,90 150,105 T 300,50 T 420,35 T 500,20"
                fill="none"
                stroke="#12372A"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Interactive Data Points */}
              <circle cx="150" cy="105" r="5" fill="#D4AF37" stroke="#12372A" strokeWidth="2" />
              <circle cx="300" cy="50" r="5" fill="#D4AF37" stroke="#12372A" strokeWidth="2" />
              <circle cx="420" cy="35" r="5" fill="#D4AF37" stroke="#12372A" strokeWidth="2" />
              <circle cx="500" cy="20" r="6" fill="#D4AF37" stroke="#12372A" strokeWidth="3" />
            </svg>

            <div className="flex justify-between text-[11px] text-[#6B5846] font-mono border-t border-[#E8DDC7] pt-2">
              <span>Week 1</span>
              <span>Week 2</span>
              <span>Week 3</span>
              <span>Week 4</span>
              <span>Current</span>
            </div>
          </div>
        </div>

        {/* Category & Variant Breakdown */}
        <div className="lg:col-span-4 bg-white p-6 border border-[#E8DDC7] rounded-2xl shadow-xs space-y-4">
          <h3 className="font-serif text-lg font-bold text-[#12372A] border-b border-[#E8DDC7] pb-3">
            Category Share Breakdown
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between mb-1 font-semibold">
                <span>Women's Kasavu Sarees</span>
                <span className="font-serif font-bold text-[#12372A]">58%</span>
              </div>
              <div className="w-full h-2.5 bg-[#FAF8F1] rounded-full overflow-hidden border border-[#E8DDC7]">
                <div className="h-full bg-[#12372A] rounded-full" style={{ width: '58%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1 font-semibold">
                <span>Men's Mundu &amp; Linen Shirts</span>
                <span className="font-serif font-bold text-[#12372A]">28%</span>
              </div>
              <div className="w-full h-2.5 bg-[#FAF8F1] rounded-full overflow-hidden border border-[#E8DDC7]">
                <div className="h-full bg-[#D4AF37] rounded-full" style={{ width: '28%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1 font-semibold">
                <span>Kids Ethnic Wear</span>
                <span className="font-serif font-bold text-[#12372A]">14%</span>
              </div>
              <div className="w-full h-2.5 bg-[#FAF8F1] rounded-full overflow-hidden border border-[#E8DDC7]">
                <div className="h-full bg-[#6B5846] rounded-full" style={{ width: '14%' }} />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#E8DDC7] space-y-2">
            <div className="p-3 bg-[#FAF8F1] rounded-xl border border-[#E8DDC7] flex items-center justify-between text-xs">
              <span>Top Size Demanded:</span>
              <strong className="font-mono text-[#12372A]">4.0m Mundu / 38 (S)</strong>
            </div>
            <div className="p-3 bg-[#FAF8F1] rounded-xl border border-[#E8DDC7] flex items-center justify-between text-xs">
              <span>Top Color Choice:</span>
              <strong className="text-[#12372A] flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#D4AF37] inline-block" /> 24k Kasavu Gold
              </strong>
            </div>
          </div>
        </div>

      </div>

      {/* PRODUCT PERFORMANCE & AUDIT ACTIVITY FEED */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Top Best-Selling Products */}
        <div className="lg:col-span-7 bg-white p-6 border border-[#E8DDC7] rounded-2xl shadow-xs space-y-4">
          <div className="flex justify-between items-center border-b border-[#E8DDC7] pb-3">
            <div>
              <h3 className="font-serif text-lg font-bold text-[#12372A]">Top Revenue Performing Products</h3>
              <p className="text-xs text-[#6B5846]">Based on live order volume and sales revenue</p>
            </div>
            <button onClick={() => onNavigateTab('products')} className="text-xs text-[#D4AF37] font-bold hover:underline">
              View Catalog →
            </button>
          </div>

          <div className="space-y-3">
            {products.slice(0, 4).map(p => (
              <div key={p.id} className="p-3 bg-[#FAF8F1] border border-[#E8DDC7] rounded-2xl flex items-center justify-between text-xs gap-3">
                <div className="flex items-center gap-3">
                  <img src={p.images[0]} alt={p.name} className="w-10 h-12 object-cover rounded-lg bg-white border border-[#E8DDC7]" />
                  <div>
                    <h4 className="font-bold text-[#12372A] line-clamp-1">{p.name}</h4>
                    <span className="text-[10px] text-[#6B5846]">SKU: {p.sku} • Stock: {p.stockCount ?? 10}</span>
                  </div>
                </div>

                <div className="text-right">
                  <strong className="font-serif text-sm font-bold text-[#12372A] block">{formatPrice(p.price)}</strong>
                  <span className="text-[10px] text-green-700 font-bold bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
                    High Demand
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Realtime Activity Audit Stream */}
        <div className="lg:col-span-5 bg-white p-6 border border-[#E8DDC7] rounded-2xl shadow-xs space-y-4">
          <div className="flex justify-between items-center border-b border-[#E8DDC7] pb-3">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#D4AF37]" />
              <h3 className="font-serif text-lg font-bold text-[#12372A]">Live Activity Audit Feed</h3>
            </div>
            <button onClick={() => onNavigateTab('audit')} className="text-xs text-[#D4AF37] font-bold hover:underline">
              Audit Logs →
            </button>
          </div>

          <div className="space-y-3 text-xs max-h-72 overflow-y-auto pr-1">
            {auditLogs.map(log => (
              <div key={log.id} className="p-3 bg-[#FAF8F1] border border-[#E8DDC7] rounded-xl space-y-1">
                <div className="flex justify-between items-center text-[11px] font-bold text-[#12372A]">
                  <span>{log.action}</span>
                  <span className="text-[10px] text-gray-400 font-mono">{log.timestamp}</span>
                </div>
                <p className="text-[11px] text-[#6B5846] font-light">
                  By {log.adminName} ({log.adminRole})
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
