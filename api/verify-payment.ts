import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, order_id } = req.body || {};

    if (!razorpay_payment_id) {
      return res.status(400).json({ verified: false, error: 'Missing razorpay_payment_id' });
    }

    const secret = process.env.VITE_RAZORPAY_KEY_SECRET || process.env.RAZORPAY_KEY_SECRET;

    // If order_id and signature are provided with a configured secret, verify HMAC SHA256
    if (secret && razorpay_order_id && razorpay_signature) {
      const generatedSignature = crypto
        .createHmac('sha256', secret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

      if (generatedSignature !== razorpay_signature) {
        return res.status(400).json({
          verified: false,
          error: 'Razorpay payment signature mismatch. Transaction cannot be validated.'
        });
      }
    }

    return res.status(200).json({
      verified: true,
      message: 'Payment verified successfully',
      payment_id: razorpay_payment_id,
      order_id: order_id || razorpay_order_id
    });
  } catch (error: any) {
    console.error('Payment verification error:', error);
    return res.status(500).json({
      verified: false,
      error: error?.message || 'Internal server payment verification error'
    });
  }
}
