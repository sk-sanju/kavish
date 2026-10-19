import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, order_id } = body;

    if (!razorpay_payment_id || typeof razorpay_payment_id !== 'string') {
      return NextResponse.json(
        { verified: false, error: 'Missing or invalid razorpay_payment_id' },
        { status: 400 }
      );
    }

    // Validate payment ID format (e.g. pay_xxxxxxxxxxxxxx)
    if (!/^pay_[a-zA-Z0-9]+$/.test(razorpay_payment_id.trim())) {
      return NextResponse.json(
        { verified: false, error: 'Invalid payment ID format' },
        { status: 400 }
      );
    }

    const secret = (
      process.env.RAZORPAY_KEY_SECRET ||
      process.env.VITE_RAZORPAY_KEY_SECRET ||
      ''
    ).trim();

    // In production or whenever secret is configured, require both razorpay_order_id and razorpay_signature
    if (secret) {
      if (!razorpay_order_id || !razorpay_signature) {
        return NextResponse.json(
          {
            verified: false,
            error: 'Missing razorpay_order_id or razorpay_signature required for cryptographic verification.',
          },
          { status: 400 }
        );
      }

      const generatedSignature = crypto
        .createHmac('sha256', secret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

      // Use timing-safe comparison to prevent timing side-channel attacks
      const genBuf = Buffer.from(generatedSignature, 'hex');
      const sigBuf = Buffer.from(razorpay_signature, 'hex');

      if (genBuf.length !== sigBuf.length || !crypto.timingSafeEqual(genBuf, sigBuf)) {
        return NextResponse.json(
          {
            verified: false,
            error: 'Razorpay payment signature mismatch. Transaction cannot be validated.',
          },
          { status: 400 }
        );
      }
    } else {
      console.warn('[SECURITY WARNING] RAZORPAY_KEY_SECRET is not configured on server. Verification relying on gateway transaction payload format.');
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

