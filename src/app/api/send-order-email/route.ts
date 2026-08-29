import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { order, targetEmail } = body;

    if (!order || !order.id) {
      return NextResponse.json({ error: 'Missing order details' }, { status: 400 });
    }

    const adminEmail = targetEmail || 'sanjayskpy7@gmail.com';

    // Build payload for transactional notification
    const payload = {
      _subject: `🛍️ Order Confirmed — Kavish #${order.id} (₹${Number(order.total).toLocaleString('en-IN')})`,
      _template: 'table',
      _captcha: 'false',
      order_id: order.id,
      invoice_id: order.invoiceId || `KV-INV-2026-${order.id.replace('KV-ORD-', '')}`,
      order_date: order.date,
      total_amount_inr: `₹${Number(order.total).toLocaleString('en-IN')}`,
      subtotal_inr: `₹${Number(order.subtotal).toLocaleString('en-IN')}`,
      discount_inr: `₹${Number(order.discount || 0).toLocaleString('en-IN')}`,
      shipping_fee_inr: Number(order.shippingFee) === 0 ? 'Complimentary' : `₹${order.shippingFee}`,
      payment_method_and_ref: order.paymentMethod,
      tracking_number: order.trackingNumber,
      customer_name: order.shippingAddress?.name,
      customer_phone: order.shippingAddress?.phone,
      shipping_address: `${order.shippingAddress?.name}\n${order.shippingAddress?.street}\n${order.shippingAddress?.city}, ${order.shippingAddress?.state} - ${order.shippingAddress?.pincode}`,
      order_items: (order.items || [])
        .map(
          (item: any, idx: number) =>
            `${idx + 1}. ${item.product?.name || item.name} | Size: ${item.size} | Qty: ${item.quantity} | ₹${item.price * item.quantity}`
        )
        .join('\n'),
    };

    const response = await fetch(`https://formsubmit.co/ajax/${adminEmail}`, {
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
