import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || process.env.VITE_RAZORPAY_KEY_SECRET;
    const signature = req.headers['x-razorpay-signature'] as string;

    // Verify webhook signature if webhook secret is configured
    if (webhookSecret && signature) {
      const rawBody = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(rawBody)
        .digest('hex');

      if (expectedSignature !== signature) {
        return res.status(400).json({ error: 'Invalid webhook signature' });
      }
    }

    const event = req.body?.event;
    const payload = req.body?.payload;

    console.log(`[Razorpay Webhook] Received event: ${event}`);

    switch (event) {
      case 'payment.captured':
        // Payment successfully captured
        break;
      case 'payment.failed':
        // Payment failed
        break;
      case 'order.paid':
        // Order fully paid
        break;
      default:
        break;
    }

    return res.status(200).json({ status: 'ok', event, received: true });
  } catch (error: any) {
    console.error('Webhook processing error:', error);
    return res.status(500).json({ error: error?.message || 'Internal webhook error' });
  }
}
