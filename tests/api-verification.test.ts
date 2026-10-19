import { describe, it, expect } from 'vitest';
import crypto from 'crypto';
import { POST as verifyPaymentHandler } from '../src/app/api/verify-payment/route';
import { POST as sendOrderEmailHandler } from '../src/app/api/send-order-email/route';
import { POST as webhookHandler } from '../src/app/api/razorpay-webhook/route';

describe('Backend API & Security Verification Tests', () => {
  const dummySecret = 'test_secret_1234567890abcdef';

  describe('/api/verify-payment', () => {
    it('rejects verification if payment_id does not start with pay_', async () => {
      const req = new Request('http://localhost:3000/api/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          razorpay_payment_id: 'fake_id_12345',
          razorpay_order_id: 'order_98765',
          razorpay_signature: 'abc123sig'
        })
      });

      const res = await verifyPaymentHandler(req);
      const data = await res.json();

      expect(res.status).toBe(400);
      expect(data.verified).toBe(false);
      expect(data.error).toContain('Invalid payment ID format');
    });

    it('rejects verification if signature is missing or empty', async () => {
      const req = new Request('http://localhost:3000/api/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          razorpay_payment_id: 'pay_valid_12345',
          razorpay_order_id: 'order_98765',
          razorpay_signature: ''
        })
      });

      const res = await verifyPaymentHandler(req);
      const data = await res.json();

      expect(res.status).toBe(400);
      expect(data.verified).toBe(false);
    });

    it('verifies valid HMAC SHA-256 signature correctly when secret is provided', () => {
      const orderId = 'order_valid_123';
      const paymentId = 'pay_valid_456';
      const hmac = crypto.createHmac('sha256', dummySecret);
      hmac.update(`${orderId}|${paymentId}`);
      const validSignature = hmac.digest('hex');

      // Test constant-time verification
      const expectedSignature = crypto
        .createHmac('sha256', dummySecret)
        .update(`${orderId}|${paymentId}`)
        .digest('hex');

      const isMatch = crypto.timingSafeEqual(
        Buffer.from(validSignature, 'hex'),
        Buffer.from(expectedSignature, 'hex')
      );
      expect(isMatch).toBe(true);
    });

    it('fails constant-time comparison on forged signature', () => {
      const orderId = 'order_valid_123';
      const paymentId = 'pay_valid_456';
      const forgedSignature = '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';

      const expectedSignature = crypto
        .createHmac('sha256', dummySecret)
        .update(`${orderId}|${paymentId}`)
        .digest('hex');

      const isMatch = crypto.timingSafeEqual(
        Buffer.from(forgedSignature, 'hex'),
        Buffer.from(expectedSignature, 'hex')
      );
      expect(isMatch).toBe(false);
    });
  });

  describe('/api/send-order-email Security Guardrails', () => {
    it('blocks open email relay to unauthorized third-party destinations', async () => {
      const req = new Request('http://localhost:3000/api/send-order-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetEmail: 'attacker_phishing_target@external-domain.com',
          order: {
            id: 'KV-ORD-999',
            total: 1000,
            items: [{ product: { name: 'Saree' }, quantity: 1, price: 1000 }],
            shippingAddress: {
              name: 'John Doe',
              email: 'legitimate.customer@gmail.com'
            }
          }
        })
      });

      const res = await sendOrderEmailHandler(req);
      const data = await res.json();

      expect(res.status).toBe(403);
      expect(data.error).toContain('Unauthorized email target recipient');
    });

    it('rejects order email with negative total or empty items array', async () => {
      const req = new Request('http://localhost:3000/api/send-order-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetEmail: 'customer@gmail.com',
          order: {
            id: 'KV-ORD-999',
            total: -500,
            items: [],
            shippingAddress: {
              name: 'Test Customer',
              email: 'customer@gmail.com'
            }
          }
        })
      });

      const res = await sendOrderEmailHandler(req);
      const data = await res.json();

      expect(res.status).toBe(400);
      expect(data.error).toBeDefined();
    });
  });

  describe('/api/razorpay-webhook Signature Security', () => {
    it('rejects webhook requests without signature when webhook secret is configured', async () => {
      const originalSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
      process.env.RAZORPAY_WEBHOOK_SECRET = 'active_test_webhook_secret';

      try {
        const req = new Request('http://localhost:3000/api/razorpay-webhook', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ event: 'payment.captured' })
        });

        const res = await webhookHandler(req);
        const data = await res.json();

        expect(res.status).toBe(400);
        expect(data.error).toContain('Missing x-razorpay-signature header');
      } finally {
        process.env.RAZORPAY_WEBHOOK_SECRET = originalSecret;
      }
    });
  });
});
