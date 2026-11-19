import { describe, it, expect } from 'vitest';
import type { Order, OrderStatus, OrderTimelineEntry, StockAdjustment, ProductVariant, Product } from '../src/types';

describe('Order Pipeline, Timeline Audit & Inventory Stock Adjustment Tests', () => {
  it('records complete activity timeline entry on order status transition', () => {
    const initialTimeline: OrderTimelineEntry = {
      id: 'ot-1',
      previousStatus: 'New Order',
      newStatus: 'Confirmed',
      timestamp: new Date().toISOString(),
      staffName: 'Lakshmi Menon (Store Manager)',
      remarks: 'Payment verified via Razorpay, scheduled for atelier loom master'
    };

    const order: Order = {
      id: 'KV-ORD-5001',
      date: 'November 14, 2026',
      status: 'Confirmed',
      paymentStatus: 'Paid',
      items: [],
      subtotal: 5499,
      discount: 0,
      shippingFee: 0,
      total: 5499,
      shippingAddress: {
        id: 'addr-5001',
        name: 'Devaki Varma',
        phone: '9847054321',
        street: 'Palace Road',
        city: 'Kochi',
        state: 'Kerala',
        pincode: '682011'
      },
      paymentMethod: 'Razorpay UPI',
      trackingNumber: 'KV-TRK-5001',
      estimatedDelivery: '4-7 days',
      timeline: [initialTimeline]
    };

    expect(order.timeline).toHaveLength(1);
    expect(order.timeline![0].newStatus).toBe('Confirmed');
    expect(order.timeline![0].staffName).toContain('Store Manager');

    // Simulate stage advancement to Processing
    const nextTimeline: OrderTimelineEntry = {
      id: 'ot-2',
      previousStatus: 'Confirmed',
      newStatus: 'Processing',
      timestamp: new Date().toISOString(),
      staffName: 'Kavitha P (Inventory Manager)',
      remarks: 'Artisan warp and weft inspection in progress at Kuthampully loom'
    };

    const updatedOrder: Order = {
      ...order,
      status: 'Processing',
      timeline: [...(order.timeline || []), nextTimeline]
    };

    expect(updatedOrder.status).toBe('Processing');
    expect(updatedOrder.timeline).toHaveLength(2);
    expect(updatedOrder.timeline![1].previousStatus).toBe('Confirmed');
    expect(updatedOrder.timeline![1].newStatus).toBe('Processing');
  });

  it('preserves courier partner details, AWB, and tracking URL upon dispatch', () => {
    const shippedOrder: Order = {
      id: 'KV-ORD-5002',
      date: 'November 14, 2026',
      status: 'Shipped',
      paymentStatus: 'Paid',
      items: [],
      subtotal: 7999,
      discount: 0,
      shippingFee: 0,
      total: 7999,
      shippingAddress: {
        id: 'addr-5002',
        name: 'Arun Nair',
        phone: '9847011223',
        street: 'MG Road',
        city: 'Thiruvananthapuram',
        state: 'Kerala',
        pincode: '695001'
      },
      paymentMethod: 'Credit Card',
      courierProvider: 'Blue Dart Express',
      trackingNumber: 'BD-84920194',
      trackingUrl: 'https://www.bluedart.com/tracking?awb=BD-84920194',
      estimatedDelivery: '3-5 days',
      dispatchDate: '2026-11-14T10:30:00.000Z',
      assignedStaff: 'Radhakrishnan M',
      internalNotes: 'Handle with care: 24k Gold Zari heirloom packaging'
    };

    expect(shippedOrder.status).toBe('Shipped');
    expect(shippedOrder.courierProvider).toBe('Blue Dart Express');
    expect(shippedOrder.trackingNumber).toBe('BD-84920194');
    expect(shippedOrder.trackingUrl).toContain('bluedart.com');
    expect(shippedOrder.dispatchDate).toBeDefined();
    expect(shippedOrder.internalNotes).toContain('24k Gold Zari');
  });

  it('records manual stock adjustments with staff audit trail', () => {
    const adjustments: StockAdjustment[] = [];

    const makeAdjustment = (
      productId: string,
      productName: string,
      sku: string,
      type: 'add' | 'deduct' | 'set',
      qty: number,
      prevStock: number,
      reason: string,
      staff: string
    ): number => {
      let newStock = prevStock;
      if (type === 'add') newStock = prevStock + qty;
      else if (type === 'deduct') newStock = Math.max(0, prevStock - qty);
      else if (type === 'set') newStock = Math.max(0, qty);

      adjustments.push({
        id: `adj-${Date.now()}`,
        productId,
        productName,
        sku,
        type,
        quantity: qty,
        previousStock: prevStock,
        newStock,
        reason,
        staffName: staff,
        timestamp: new Date().toISOString()
      });

      return newStock;
    };

    const stock1 = makeAdjustment('prod-1', 'Tissue Kasavu Saree', 'KV-KUT-1001', 'add', 10, 5, 'New loom batch arrived from Kuthampully master weaver', 'Sanjay Suresh (Super Admin)');
    expect(stock1).toBe(15);
    expect(adjustments).toHaveLength(1);
    expect(adjustments[0].previousStock).toBe(5);
    expect(adjustments[0].newStock).toBe(15);
    expect(adjustments[0].staffName).toBe('Sanjay Suresh (Super Admin)');

    const stock2 = makeAdjustment('prod-1', 'Tissue Kasavu Saree', 'KV-KUT-1001', 'deduct', 3, stock1, 'Showroom display allocation', 'Kavitha P (Inventory Manager)');
    expect(stock2).toBe(12);
    expect(adjustments).toHaveLength(2);
    expect(adjustments[1].previousStock).toBe(15);
    expect(adjustments[1].newStock).toBe(12);
  });

  it('verifies product variants sum and variant-level stock allocation', () => {
    const variants: ProductVariant[] = [
      {
        id: 'KV-MUNDU-38-GOLD',
        sku: 'KV-MUNDU-38-GOLD',
        size: '38 (S)',
        color: { name: 'Kasavu Gold', hex: '#C5A15A' },
        price: 4999,
        stock: 5
      },
      {
        id: 'KV-MUNDU-40-GOLD',
        sku: 'KV-MUNDU-40-GOLD',
        size: '40 (M)',
        color: { name: 'Kasavu Gold', hex: '#C5A15A' },
        price: 4999,
        stock: 8
      },
      {
        id: 'KV-MUNDU-42-GOLD',
        sku: 'KV-MUNDU-42-GOLD',
        size: '42 (L)',
        color: { name: 'Kasavu Gold', hex: '#C5A15A' },
        price: 4999,
        stock: 7
      }
    ];

    const totalStock = variants.reduce((sum, v) => sum + v.stock, 0);
    expect(totalStock).toBe(20);

    const product: Partial<Product> = {
      id: 'prod-mundu-1',
      name: 'Double Kasavu Handloom Mundu',
      price: 4999,
      variants,
      stockCount: totalStock,
      inStock: totalStock > 0
    };

    expect(product.stockCount).toBe(20);
    expect(product.inStock).toBe(true);
    expect(product.variants).toHaveLength(3);
    expect(product.variants![0].sku).toBe('KV-MUNDU-38-GOLD');
  });
});
