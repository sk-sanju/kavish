import React from 'react';
import { Download } from 'lucide-react';
import { useProducts } from '../../context/ProductContext';

export const AnalyticsReports: React.FC = () => {
  const { products, offers } = useProducts();

  const handleExportCSV = (reportType: string) => {
    let filename = `Kavish_${reportType}_Export_${Date.now()}.csv`;
    let content = '';

    if (reportType === 'products') {
      content = 'SKU,Name,Category,Subcategory,Price,Stock,Status\n' +
        products.map(p => `"${p.sku}","${p.name}","${p.category}","${p.subcategory}",${p.price},${p.stockCount ?? 10},"${p.inStock ? 'In Stock' : 'Out of Stock'}"`).join('\n');
    } else if (reportType === 'coupons') {
      content = 'Code,DiscountType,DiscountValue,MinOrder,UsageCount,Expiry\n' +
        offers.map(o => `"${o.code}","${o.discountType}",${o.discountValue},${o.minOrderAmount},${o.usageCount || 0},"${o.expiryDate}"`).join('\n');
    } else {
      content = 'Metric,Value\nTotal Revenue,482900\nTotal Orders,22\nAverage Order Value,21950\nCustomer Growth Rate,18.4%\n';
    }

    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8DDC7] pb-5">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#D4AF37] block">
            Business Intelligence &amp; Data Export
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#12372A] mt-0.5">
            Analytics &amp; CSV Data Reports
          </h1>
        </div>
      </div>

      {/* CSV Data Exporter Cards */}
      <div className="bg-white p-6 border border-[#E8DDC7] rounded-2xl shadow-xs space-y-4">
        <h3 className="font-serif font-bold text-lg text-[#12372A] border-b border-[#E8DDC7] pb-3">
          Downloadable Business Data Reports (CSV / Excel)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-[#FAF8F1] border border-[#E8DDC7] rounded-2xl flex flex-col justify-between space-y-3">
            <div>
              <strong className="font-bold text-[#12372A] block text-sm">Product Catalog Export</strong>
              <p className="text-[11px] text-[#6B5846]">Full product list, SKUs, category specs, prices &amp; inventory levels.</p>
            </div>
            <button
              onClick={() => handleExportCSV('products')}
              className="w-full bg-[#12372A] text-[#FAF8F1] py-2 rounded-xl font-bold uppercase text-[11px] flex items-center justify-center gap-1.5 border border-[#D4AF37]"
            >
              <Download className="w-3.5 h-3.5" /> Download Product CSV
            </button>
          </div>

          <div className="p-4 bg-[#FAF8F1] border border-[#E8DDC7] rounded-2xl flex flex-col justify-between space-y-3">
            <div>
              <strong className="font-bold text-[#12372A] block text-sm">Coupons &amp; Offers Data</strong>
              <p className="text-[11px] text-[#6B5846]">Active discount codes, usage counts, minimum spend, &amp; expiry dates.</p>
            </div>
            <button
              onClick={() => handleExportCSV('coupons')}
              className="w-full bg-[#12372A] text-[#FAF8F1] py-2 rounded-xl font-bold uppercase text-[11px] flex items-center justify-center gap-1.5 border border-[#D4AF37]"
            >
              <Download className="w-3.5 h-3.5" /> Download Coupons CSV
            </button>
          </div>

          <div className="p-4 bg-[#FAF8F1] border border-[#E8DDC7] rounded-2xl flex flex-col justify-between space-y-3">
            <div>
              <strong className="font-bold text-[#12372A] block text-sm">Sales &amp; Financial Summary</strong>
              <p className="text-[11px] text-[#6B5846]">Revenue metrics, average order value, growth rates &amp; tax breakdown.</p>
            </div>
            <button
              onClick={() => handleExportCSV('sales')}
              className="w-full bg-[#12372A] text-[#FAF8F1] py-2 rounded-xl font-bold uppercase text-[11px] flex items-center justify-center gap-1.5 border border-[#D4AF37]"
            >
              <Download className="w-3.5 h-3.5" /> Download Sales CSV
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
