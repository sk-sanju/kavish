import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabase, isSupabaseConfigured } from '../../../lib/supabase';

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-razorpay-signature');
    const webhookSecret = (
      process.env.RAZORPAY_WEBHOOK_SECRET ||
      process.env.RAZORPAY_KEY_SECRET ||
      process.env.VITE_RAZORPAY_KEY_SECRET ||
      ''
    ).trim();

    if (webhookSecret) {
      if (!signature) {
        return NextResponse.json({ error: 'Missing x-razorpay-signature header' }, { status: 400 });
      }

      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(rawBody)
        .digest('hex');

      const expectedBuf = Buffer.from(expectedSignature, 'hex');
      const sigBuf = Buffer.from(signature, 'hex');

      if (expectedBuf.length !== sigBuf.length || !crypto.timingSafeEqual(expectedBuf, sigBuf)) {
        return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 });
      }
    }

    const payload = JSON.parse(rawBody || '{}');
    const event = payload?.event;
    const paymentEntity = payload?.payload?.payment?.entity;
    const orderEntity = payload?.payload?.order?.entity;

    console.log(`[Razorpay Webhook] Authenticated event: ${event}`);

    // If order.paid or payment.captured, update order status in Supabase if order id is present
    const orderId = paymentEntity?.notes?.order_id || orderEntity?.notes?.order_id || paymentEntity?.order_id;
    if (orderId && isSupabaseConfigured && (event === 'order.paid' || event === 'payment.captured')) {
      try {
        await supabase
          .from('orders')
          .update({
            status: 'Processing',
            notes: `Payment verified via webhook event ${event} (Ref: ${paymentEntity?.id || 'OK'})`
          })
          .eq('id', orderId);
      } catch (dbErr) {
        console.warn('[Razorpay Webhook] Database update error:', dbErr);
      }
    }

    return NextResponse.json({ status: 'ok', event, received: true });
  } catch (error: any) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ error: error?.message || 'Internal webhook error' }, { status: 500 });
  }
}

