import type { Order } from '../types';
import { POLICY_CONFIG } from '../config/policyConfig';

export const ADMIN_NOTIFICATION_EMAIL = POLICY_CONFIG.ADMIN_NOTIFICATION_EMAIL;

/**
 * Generates an ultra-luxurious, mobile-responsive HTML email for Customer Order Confirmation
 */
export function generateCustomerOrderConfirmationHtml(order: Order): string {
  const itemsRows = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #E8DDC7; font-size: 13px; color: #171717;">
          <strong style="color: #12372A;">${item.product.name}</strong><br />
          <span style="font-size: 11px; color: #6B5846;">Size: ${item.size} | Color: ${item.color.name}</span>
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #E8DDC7; font-size: 13px; text-align: center; color: #171717;">
          ${item.quantity}
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #E8DDC7; font-size: 13px; text-align: right; font-weight: bold; color: #12372A;">
          ₹${(item.price * item.quantity).toLocaleString('en-IN')}
        </td>
      </tr>`
    )
    .join('');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Order Confirmed — Kavish #${order.id}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FAF8F1; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #171717;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #FAF8F1; padding: 24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 600px; background-color: #FFFFFF; border-radius: 16px; overflow: hidden; border: 1px solid #E8DDC7; box-shadow: 0 4px 20px rgba(0,0,0,0.06);">
          
          <!-- Header Banner -->
          <tr>
            <td style="background-color: #12372A; padding: 32px 24px; text-align: center;">
              <h1 style="margin: 0; font-family: 'Georgia', serif; font-size: 28px; letter-spacing: 4px; color: #D4AF37; font-weight: bold;">
                KAVISH
              </h1>
              <p style="margin: 6px 0 0 0; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #E8DDC7;">
                Authentic Kuthampully GI Tag Handlooms
              </p>
            </td>
          </tr>

          <!-- Confirmation Message -->
          <tr>
            <td style="padding: 32px 28px 20px 28px; text-align: center;">
              <div style="display: inline-block; width: 48px; height: 48px; line-height: 48px; border-radius: 50%; background-color: #12372A; color: #D4AF37; font-size: 22px; margin-bottom: 16px;">
                ✓
              </div>
              <h2 style="margin: 0 0 8px 0; font-family: 'Georgia', serif; font-size: 22px; color: #12372A;">
                Thank You, ${order.shippingAddress.name}!
              </h2>
              <p style="margin: 0; font-size: 14px; color: #6B5846; line-height: 1.5;">
                Your order <strong style="color: #12372A;">#${order.id}</strong> has been confirmed and assigned to our master weavers in Kuthampully.
              </p>
            </td>
          </tr>

          <!-- Order Summary Meta Box -->
          <tr>
            <td style="padding: 0 28px 24px 28px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #FAF8F1; border-radius: 12px; border: 1px solid #E8DDC7; padding: 16px;">
                <tr>
                  <td style="padding: 6px 12px; font-size: 12px; color: #6B5846;">Order Number:</td>
                  <td style="padding: 6px 12px; font-size: 12px; font-weight: bold; color: #12372A; text-align: right; font-family: monospace;">${order.id}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 12px; font-size: 12px; color: #6B5846;">Tax Invoice ID:</td>
                  <td style="padding: 6px 12px; font-size: 12px; font-weight: bold; color: #D4AF37; text-align: right; font-family: monospace;">${order.invoiceId || 'KV-INV-' + order.id.replace('KV-ORD-', '')}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 12px; font-size: 12px; color: #6B5846;">Order Date:</td>
                  <td style="padding: 6px 12px; font-size: 12px; color: #12372A; text-align: right;">${order.date}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 12px; font-size: 12px; color: #6B5846;">Payment Method:</td>
                  <td style="padding: 6px 12px; font-size: 12px; font-weight: bold; color: #12372A; text-align: right;">${order.paymentMethod}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 12px; font-size: 12px; color: #6B5846;">Estimated Delivery:</td>
                  <td style="padding: 6px 12px; font-size: 12px; font-weight: bold; color: #12372A; text-align: right;">${order.estimatedDelivery || POLICY_CONFIG.STANDARD_DELIVERY_TIME}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 12px; font-size: 12px; color: #6B5846;">Tracking AWB:</td>
                  <td style="padding: 6px 12px; font-size: 12px; font-weight: bold; color: #12372A; text-align: right; font-family: monospace;">${order.trackingNumber}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Items Ordered Table -->
          <tr>
            <td style="padding: 0 28px 24px 28px;">
              <h3 style="margin: 0 0 12px 0; font-family: 'Georgia', serif; font-size: 16px; color: #12372A; border-bottom: 1px solid #E8DDC7; padding-bottom: 8px;">
                Items in Your Atelier Box
              </h3>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">
                <thead>
                  <tr style="background-color: #FAF8F1;">
                    <th style="padding: 8px 12px; text-align: left; font-size: 11px; text-transform: uppercase; color: #6B5846;">Item</th>
                    <th style="padding: 8px 12px; text-align: center; font-size: 11px; text-transform: uppercase; color: #6B5846;">Qty</th>
                    <th style="padding: 8px 12px; text-align: right; font-size: 11px; text-transform: uppercase; color: #6B5846;">Price</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsRows}
                </tbody>
              </table>

              <!-- Totals -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top: 16px;">
                <tr>
                  <td style="padding: 4px 12px; font-size: 13px; color: #6B5846;">Subtotal:</td>
                  <td style="padding: 4px 12px; font-size: 13px; color: #12372A; text-align: right;">₹${order.subtotal.toLocaleString('en-IN')}</td>
                </tr>
                ${
                  order.discount > 0
                    ? `<tr>
                        <td style="padding: 4px 12px; font-size: 13px; color: #15803D;">Discount:</td>
                        <td style="padding: 4px 12px; font-size: 13px; color: #15803D; text-align: right;">-₹${order.discount.toLocaleString('en-IN')}</td>
                      </tr>`
                    : ''
                }
                <tr>
                  <td style="padding: 4px 12px; font-size: 13px; color: #6B5846;">Complimentary Express Shipping:</td>
                  <td style="padding: 4px 12px; font-size: 13px; color: #12372A; text-align: right;">${order.shippingFee === 0 ? 'FREE' : `₹${order.shippingFee}`}</td>
                </tr>
                <tr>
                  <td style="padding: 12px; font-size: 16px; font-weight: bold; color: #12372A; border-top: 1px solid #E8DDC7;">Total Amount Paid:</td>
                  <td style="padding: 12px; font-size: 18px; font-weight: bold; font-family: 'Georgia', serif; color: #12372A; text-align: right; border-top: 1px solid #E8DDC7;">₹${order.total.toLocaleString('en-IN')}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Shipping Address -->
          <tr>
            <td style="padding: 0 28px 24px 28px;">
              <h3 style="margin: 0 0 8px 0; font-family: 'Georgia', serif; font-size: 16px; color: #12372A;">
                Shipping Destination
              </h3>
              <p style="margin: 0; font-size: 13px; color: #6B5846; line-height: 1.6; background-color: #FAF8F1; padding: 12px 16px; border-radius: 8px; border: 1px solid #E8DDC7;">
                <strong style="color: #12372A;">${order.shippingAddress.name}</strong><br />
                ${order.shippingAddress.street}<br />
                ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}<br />
                Phone: ${order.shippingAddress.phone}
              </p>
            </td>
          </tr>

          <!-- Action Buttons -->
          <tr>
            <td style="padding: 0 28px 32px 28px; text-align: center;">
              <a href="https://kavish.xenotrix.in/track-order?orderId=${order.id}" style="display: inline-block; background-color: #12372A; color: #FAF8F1; padding: 14px 28px; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1.5px; text-decoration: none; border-radius: 8px; border: 1px solid #D4AF37; margin-right: 8px;">
                Track Delivery
              </a>
              <a href="https://kavish.xenotrix.in" style="display: inline-block; background-color: #FFFFFF; color: #12372A; padding: 14px 24px; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1.5px; text-decoration: none; border-radius: 8px; border: 1px solid #12372A;">
                Visit Store
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #12372A; padding: 24px; text-align: center; color: #E8DDC7; font-size: 11px; line-height: 1.6;">
              <p style="margin: 0 0 8px 0; color: #D4AF37; font-weight: bold;">
                ${POLICY_CONFIG.COMPANY_LEGAL_NAME}
              </p>
              <p style="margin: 0 0 4px 0;">
                ${POLICY_CONFIG.ATELIER_ADDRESS.FULL}
              </p>
              <p style="margin: 0;">
                Concierge: <a href="mailto:${POLICY_CONFIG.SUPPORT_EMAIL}" style="color: #D4AF37; text-decoration: none;">${POLICY_CONFIG.SUPPORT_EMAIL}</a> | Phone: ${POLICY_CONFIG.SUPPORT_PHONE}
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
}

/**
 * Generates an internal admin order notification HTML email
 */
export function generateAdminOrderNotificationHtml(order: Order): string {
  const itemsText = order.items
    .map(
      (item, idx) =>
        `${idx + 1}. ${item.product.name} | Size: ${item.size} | Color: ${item.color.name} | Qty: ${item.quantity} | ₹${item.price * item.quantity}`
    )
    .join('<br />');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>New Order Received — Kavish #${order.id}</title>
</head>
<body style="background-color: #F3F4F6; font-family: sans-serif; padding: 20px; color: #111827;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border-radius: 12px; border: 2px solid #12372A; padding: 24px;">
    <h2 style="color: #12372A; margin-top: 0; border-bottom: 2px solid #D4AF37; padding-bottom: 8px;">
      🛍️ New Order Received: #${order.id}
    </h2>
    <p><strong>Total Value:</strong> <span style="font-size: 18px; color: #15803D; font-weight: bold;">₹${order.total.toLocaleString('en-IN')}</span></p>
    <p><strong>Customer Name:</strong> ${order.shippingAddress.name}</p>
    <p><strong>Customer Phone:</strong> ${order.shippingAddress.phone}</p>
    <p><strong>Payment Status/Ref:</strong> ${order.paymentMethod}</p>
    <p><strong>Tax Invoice:</strong> ${order.invoiceId || 'N/A'}</p>
    <p><strong>AWB Tracking:</strong> ${order.trackingNumber}</p>
    
    <div style="background-color: #FAF8F1; border: 1px solid #E8DDC7; padding: 12px; border-radius: 8px; margin: 16px 0;">
      <h4 style="margin: 0 0 8px 0; color: #12372A;">Ordered Items:</h4>
      ${itemsText}
    </div>

    <div style="background-color: #FAF8F1; border: 1px solid #E8DDC7; padding: 12px; border-radius: 8px; margin: 16px 0;">
      <h4 style="margin: 0 0 8px 0; color: #12372A;">Shipping Address:</h4>
      ${order.shippingAddress.name}<br />
      ${order.shippingAddress.street}<br />
      ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}<br />
      Phone: ${order.shippingAddress.phone}
    </div>

    <p style="font-size: 11px; color: #6B7280; margin-top: 20px; border-top: 1px solid #E5E7EB; padding-top: 8px;">
      Kavish Handlooms Admin Management System • Instant Purchase Alert
    </p>
  </div>
</body>
</html>
`;
}

/**
 * Sends real-time customer and admin order notifications
 */
export async function sendOrderNotificationEmail(
  order: Order,
  targetEmail: string = ADMIN_NOTIFICATION_EMAIL
): Promise<boolean> {
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
      _subject: `🛍️ Order Confirmed — Kavish #${order.id} (₹${order.total.toLocaleString('en-IN')})`,
      _template: 'table',
      _captcha: 'false',
      order_id: order.id,
      invoice_id: order.invoiceId || `KV-INV-2026-${order.id.replace('KV-ORD-', '')}`,
      order_date: order.date,
      total_amount_inr: `₹${order.total.toLocaleString('en-IN')}`,
      subtotal_inr: `₹${order.subtotal.toLocaleString('en-IN')}`,
      discount_inr: `₹${order.discount.toLocaleString('en-IN')}`,
      shipping_fee_inr: order.shippingFee === 0 ? 'Complimentary' : `₹${order.shippingFee}`,
      payment_method_and_ref: order.paymentMethod,
      tracking_number: order.trackingNumber,
      estimated_delivery: order.estimatedDelivery || POLICY_CONFIG.STANDARD_DELIVERY_TIME,
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

    // Also attempt serverless dispatch if running in a production backend environment
    try {
      if (typeof window !== 'undefined') {
        fetch('/api/send-order-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ order, targetEmail })
        }).catch(() => {
          // Silent fallback for non-serverless dev
        });
      }
    } catch {
      // Ignore
    }

    return response.ok;
  } catch (error) {
    console.warn('Order email notification dispatch notice:', error);
    return false;
  }
}
