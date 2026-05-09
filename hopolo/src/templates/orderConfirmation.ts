export interface OrderDetails {
  id: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  total: number;
  address: {
    street: string;
    city: string;
    zip: string;
  };
}

export const generateOrderConfirmationHtml = (order: any): string => {
  const itemsHtml = order.items.map((item: any) => `
    <div style="padding: 16px 0; border-bottom: 1px solid #000000; display: flex; justify-content: space-between;">
      <div style="text-transform: uppercase; font-weight: 700;">${(item.product?.name || item.name).toUpperCase()}</div>
      <div style="color: #666666;">QTY: ${item.quantity.toString().padStart(2, '0')} — $${(item.product?.price || item.price) * item.quantity}</div>
    </div>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;700&display=swap" rel="stylesheet">
    </head>
    <body style="background-color: #ffffff; color: #000000; font-family: 'Space Grotesk', 'Helvetica', sans-serif; margin: 0; padding: 40px;">
      <div style="max-width: 600px; margin: 0 auto; border: 1px solid #000000; padding: 32px;">
        <div style="display: flex; justify-content: space-between; align-items: baseline; border-bottom: 2px solid #000000; padding-bottom: 16px; margin-bottom: 32px;">
          <h1 style="font-size: 24px; font-weight: 700; margin: 0; letter-spacing: -0.02em;">HYPVZN</h1>
          <span style="font-size: 12px; color: #666666; letter-spacing: 0.1em;">ORDER_MANIFEST</span>
        </div>

        <div style="margin-bottom: 40px;">
          <p style="font-size: 10px; color: #8A2BE2; font-weight: 700; margin-bottom: 4px; letter-spacing: 0.2em;">SYSTEM.TRANSACTION.SUCCESS</p>
          <h2 style="font-size: 32px; font-weight: 700; margin: 0; text-transform: uppercase; line-height: 1;">RECEIPT_CONFIRMED</h2>
        </div>

        <div style="margin-bottom: 40px; font-size: 14px; line-height: 1.6;">
          <div style="margin-bottom: 16px;">
            <span style="display: block; font-size: 10px; color: #666666; font-weight: 700; letter-spacing: 0.1em;">TRANSACTION_ID</span>
            <span style="font-weight: 400;">${order.id}</span>
          </div>
          <div style="margin-bottom: 16px;">
            <span style="display: block; font-size: 10px; color: #666666; font-weight: 700; letter-spacing: 0.1em;">LOGISTICS_DESTINATION</span>
            <span style="font-weight: 400;">${order.address.street}, ${order.address.city} ${order.address.zip}</span>
          </div>
        </div>

        <div style="border-top: 1px solid #000000; margin-bottom: 32px;">
          <div style="font-size: 10px; font-weight: 700; padding: 8px 0; color: #666666; letter-spacing: 0.1em;">REGISTERED_ITEMS</div>
          ${itemsHtml}
        </div>

        <div style="display: flex; justify-content: space-between; align-items: baseline; padding-top: 16px;">
          <span style="font-weight: 700; font-size: 18px;">TOTAL_PAYABLE</span>
          <span style="font-weight: 700; font-size: 24px; color: #8A2BE2;">$${order.total.toFixed(2)}</span>
        </div>

        <div style="margin-top: 64px; padding-top: 16px; border-top: 1px solid #eeeeee; font-size: 10px; color: #999999; text-align: center; letter-spacing: 0.05em;">
          © 2024 HYPVZN. ENGINEERED FOR PRECISION. ALL DATA LOGS SECURED.
        </div>
      </div>
    </body>
    </html>
  `;
};
