import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, order_id } = body;

    if (!razorpay_payment_id) {
      return NextResponse.json(
        { verified: false, error: 'Missing razorpay_payment_id' },
        { status: 400 }
      );
    }

    const secret =
      process.env.RAZORPAY_KEY_SECRET ||
      process.env.VITE_RAZORPAY_KEY_SECRET ||
      '';

    // If order_id and signature are provided with a configured secret, verify HMAC SHA256
    if (secret && razorpay_order_id && razorpay_signature) {
      const generatedSignature = crypto
        .createHmac('sha256', secret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

      if (generatedSignature !== razorpay_signature) {
        return NextResponse.json(
          {
            verified: false,
            error: 'Razorpay payment signature mismatch. Transaction cannot be validated.',
          },
          { status: 400 }
        );
      }
    }

    return NextResponse.json({
      verified: true,
      message: 'Payment verified successfully',
      payment_id: razorpay_payment_id,
      order_id: order_id || razorpay_order_id,
    });
  } catch (error: any) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      {
        verified: false,
        error: error?.message || 'Internal server payment verification error',
      },
      { status: 500 }
    );
  }
}
