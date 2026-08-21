import type { PromoOffer } from '../types';

export const INITIAL_OFFERS: PromoOffer[] = [
  {
    id: 'off-royal15',
    code: 'ROYAL15',
    discountType: 'percentage',
    discountValue: 15,
    minOrderAmount: 3000,
    maxDiscountAmount: 2000,
    expiryDate: '2026-12-31',
    isActive: true,
    usageCount: 42,
    description: 'Complimentary 15% discount on all Royal Kasavu & Linen orders above ₹3,000'
  },
  {
    id: 'off-welcome10',
    code: 'WELCOME10',
    discountType: 'percentage',
    discountValue: 10,
    minOrderAmount: 1500,
    expiryDate: '2026-12-31',
    isActive: true,
    usageCount: 115,
    isFirstOrderOnly: true,
    description: 'Enjoy 10% off your inaugural Kavish handloom purchase'
  }
];
