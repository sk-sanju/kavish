import type { Order } from '../types';

export const ADMIN_NOTIFICATION_EMAIL = 'sanjayskpy7@gmail.com';

/**
 * Sends real-time email notification when an order is placed on Kavish
 */
export async function sendOrderNotificationEmail(order: Order, targetEmail: string = ADMIN_NOTIFICATION_EMAIL): Promise<boolean> {
  try {
    const itemsListText = order.items
      .map(
        (item, idx) =>
          `${idx + 1}. ${item.product.name} | Size: ${item.size} | Color: ${item.color.name} | Qty: ${item.quantity} | ₹${item.price * item.quantity}`
      )
      .join('\n');

    const addressFormatted = `${order.shippingAddress.name}
Phone: ${order.shippingAddress.phone}
${order.shippingAddress.street}
${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}`;

    const payload = {
      _subject: `🛍️ New Kavish Order ${order.id} (Invoice: ${order.invoiceId || 'N/A'}) - ₹${order.total}`,
      _template: 'table',
      _captcha: 'false',
      order_id: order.id,
      invoice_id: order.invoiceId || `KV-INV-${Date.now()}`,
      order_date: order.date,
      total_amount_inr: `₹${order.total}`,
      subtotal_inr: `₹${order.subtotal}`,
      discount_inr: `₹${order.discount}`,
      shipping_fee_inr: `₹${order.shippingFee}`,
      payment_method_and_ref: order.paymentMethod,
      tracking_number: order.trackingNumber,
      customer_name: order.shippingAddress.name,
      customer_phone: order.shippingAddress.phone,
      shipping_address: addressFormatted,
      order_items: itemsListText,
    };

    // Dispatch asynchronous email notification to target admin email
    const response = await fetch(`https://formsubmit.co/ajax/${targetEmail}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(payload)
    });

    return response.ok;
  } catch (error) {
    console.warn('Order email notification dispatch notice:', error);
    return false;
  }
}
