import { NextResponse } from 'next/server';
import { POLICY_CONFIG } from '../../../config/policyConfig';

const AUTHORIZED_ADMIN_EMAILS = new Set([
  POLICY_CONFIG.ADMIN_NOTIFICATION_EMAIL.toLowerCase(),
  POLICY_CONFIG.SUPPORT_EMAIL.toLowerCase(),
  'sanjayskpy7@gmail.com',
  'kavishlooms@gmail.com',
  'admin@kavishhandlooms.com',
]);

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { order, targetEmail } = body;

    // Validate order presence and required attributes
    if (!order || typeof order !== 'object' || !order.id) {
      return NextResponse.json({ error: 'Missing or invalid order details' }, { status: 400 });
    }

    if (typeof order.total !== 'number' || isNaN(order.total) || order.total < 0) {
      return NextResponse.json({ error: 'Invalid order total amount' }, { status: 400 });
    }

    if (!Array.isArray(order.items) || order.items.length === 0) {
      return NextResponse.json({ error: 'Order must contain at least one item' }, { status: 400 });
    }

    // Prevent open email relay: targetEmail must be an authorized admin address or match customer's shipping email
    let recipientEmail: string = POLICY_CONFIG.ADMIN_NOTIFICATION_EMAIL;
    if (targetEmail && typeof targetEmail === 'string') {
      const cleanTarget = targetEmail.trim().toLowerCase();
      const customerEmail = (order.shippingAddress?.email || '').trim().toLowerCase();
      if (AUTHORIZED_ADMIN_EMAILS.has(cleanTarget) || (customerEmail && cleanTarget === customerEmail)) {
        recipientEmail = cleanTarget;
      } else {
        return NextResponse.json(
          { error: 'Unauthorized email target recipient. Open mail relay is strictly prohibited.' },
          { status: 403 }
        );
      }
    }

    // Build payload for transactional notification
    const payload = {
      _subject: `🛍️ Order Confirmed — Kavish #${String(order.id).slice(0, 50)} (₹${Number(order.total).toLocaleString('en-IN')})`,
      _template: 'table',
      _captcha: 'false',
      order_id: String(order.id).slice(0, 50),
      invoice_id: String(order.invoiceId || `KV-INV-2026-${order.id.replace('KV-ORD-', '')}`).slice(0, 50),
      order_date: String(order.date || new Date().toISOString()).slice(0, 50),
      total_amount_inr: `₹${Number(order.total).toLocaleString('en-IN')}`,
      subtotal_inr: `₹${Number(order.subtotal || order.total).toLocaleString('en-IN')}`,
      discount_inr: `₹${Number(order.discount || 0).toLocaleString('en-IN')}`,
      shipping_fee_inr: Number(order.shippingFee) === 0 ? 'Complimentary' : `₹${order.shippingFee}`,
      payment_method_and_ref: String(order.paymentMethod || 'Razorpay').slice(0, 100),
      tracking_number: String(order.trackingNumber || 'Pending').slice(0, 50),
      customer_name: String(order.shippingAddress?.name || 'Customer').slice(0, 100),
      customer_phone: String(order.shippingAddress?.phone || '').slice(0, 20),
      shipping_address: `${order.shippingAddress?.name || ''}\n${order.shippingAddress?.street || ''}\n${order.shippingAddress?.city || ''}, ${order.shippingAddress?.state || ''} - ${order.shippingAddress?.pincode || ''}`.slice(0, 300),
      order_items: (order.items || [])
        .slice(0, 50)
        .map(
          (item: any, idx: number) =>
            `${idx + 1}. ${String(item.product?.name || item.name || 'Garment').slice(0, 80)} | Size: ${item.size || 'Free Size'} | Qty: ${Number(item.quantity) || 1} | ₹${(Number(item.price) || 0) * (Number(item.quantity) || 1)}`
        )
        .join('\n'),
    };

    const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(recipientEmail)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => ({ success: response.ok }));

    return NextResponse.json({
      success: true,
      message: 'Order confirmation email processed successfully',
      data,
    });
  } catch (error: any) {
    console.error('Email dispatch error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Failed to dispatch email',
      },
      { status: 500 }
    );
  }
}

