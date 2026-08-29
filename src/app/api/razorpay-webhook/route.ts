import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-razorpay-signature');
    const webhookSecret =
      process.env.RAZORPAY_WEBHOOK_SECRET ||
      process.env.RAZORPAY_KEY_SECRET ||
      process.env.VITE_RAZORPAY_KEY_SECRET ||
      '';

    if (webhookSecret && signature) {
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(rawBody)
        .digest('hex');

      if (expectedSignature !== signature) {
        return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 });
      }
    }

    const payload = JSON.parse(rawBody || '{}');
    const event = payload?.event;

    console.log(`[Razorpay Webhook] Received event: ${event}`);

    return NextResponse.json({ status: 'ok', event, received: true });
  } catch (error: any) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ error: error?.message || 'Internal webhook error' }, { status: 500 });
  }
}
