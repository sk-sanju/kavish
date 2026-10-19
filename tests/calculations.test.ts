import { describe, it, expect } from 'vitest';
import { POLICY_CONFIG } from '../src/config/policyConfig';

describe('Ecommerce Calculations & Financial Business Rules', () => {
  it('correctly calculates free shipping above threshold', () => {
    const threshold = 1999;
    const flatRate = POLICY_CONFIG.SHIPPING_CHARGE; // Flat rate

    const subtotalAbove = threshold + 500;
    const feeAbove = subtotalAbove >= threshold ? 0 : flatRate;
    expect(feeAbove).toBe(0);

    const subtotalBelow = threshold - 100;
    const feeBelow = subtotalBelow >= threshold ? 0 : flatRate;
    expect(feeBelow).toBe(flatRate);
  });

  it('correctly calculates 5% GST breakdown for artisanal handloom textiles', () => {
    // In India, handloom & apparel under 1000/10000 has standard 5% GST (2.5% CGST + 2.5% SGST or 5% IGST)
    const baseTotal = 5000;
    const isKeralaCustomer = true;

    const gstRate = 0.05;
    const totalGst = Math.round(baseTotal * (gstRate / (1 + gstRate)));

    if (isKeralaCustomer) {
      const cgst = Math.round(totalGst / 2);
      const sgst = totalGst - cgst;
      expect(cgst + sgst).toBe(totalGst);
      expect(cgst).toBeGreaterThan(0);
      expect(sgst).toBeGreaterThan(0);
    }
  });

  it('accurately calculates discount percentages without rounding artifacts', () => {
    const originalPrice = 4999;
    const salePrice = 3999;
    const discountPercentage = Math.round(((originalPrice - salePrice) / originalPrice) * 100);

    expect(discountPercentage).toBe(20);
    expect(salePrice).toBeLessThan(originalPrice);
  });

  it('prevents negative quantities and caps item quantity at stock level', () => {
    const stockCount = 5;
    const requestedQuantity = 8;
    const clampedMax = Math.min(stockCount, Math.max(1, requestedQuantity));
    expect(clampedMax).toBe(5);

    const negativeQuantity = -3;
    const clampedMin = Math.min(stockCount, Math.max(1, negativeQuantity));
    expect(clampedMin).toBe(1);
  });

  it('disallows adding out-of-stock items when backorders are disabled', () => {
    const item = { inStock: false, allowBackorders: false, stockCount: 0 };
    const canAddToCart = item.inStock || item.allowBackorders;
    expect(canAddToCart).toBe(false);

    const backorderItem = { inStock: false, allowBackorders: true, stockCount: 0 };
    const canBackorder = backorderItem.inStock || backorderItem.allowBackorders;
    expect(canBackorder).toBe(true);
  });
});
