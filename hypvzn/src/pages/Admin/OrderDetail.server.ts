import { type Order } from '../../services/orderService';
import { requireRole } from '../../lib/auth.server';
import { fetchOrderById, updateOrderStatus } from '../../services/orderService.server';
import { createShippingOrder } from '../../services/shippingService.server';
import { refundOrder } from '../../services/paymentService.server';

export async function loader({ request, params }: { request: Request, params: any }) {
  await requireRole(request, ['admin']);
  const orderId = params.id;
  if (!orderId) throw new Response("Order ID required", { status: 400 });
  
  const order = await fetchOrderById(orderId);
  if (!order) throw new Response("Order not found", { status: 404 });
  
  return { order };
}

export async function action({ request, params }: { request: Request, params: any }) {
  await requireRole(request, ['admin']);
  const { id: orderId } = params;
  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "update-status") {
    const status = formData.get("status") as Order["status"];
    await updateOrderStatus(orderId, status);
    return { success: true };
  }

  if (intent === "ship-order") {
    const order = await fetchOrderById(orderId);
    if (!order) return { success: false, error: "Order not found" };
    
    try {
      const result = await createShippingOrder({
        orderId: order.id,
        customerName: order.userId,
        phone: (order as any).phone || '9999999999',
        address: `${order.address?.street}, ${order.address?.city}`,
        items: order.items.map((item: any) => ({
          name: item.name,
          qty: item.quantity,
          price: item.price
        }))
      });
      
      await updateOrderStatus(orderId, 'shipped');
      return { success: true, shippingInfo: result };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  if (intent === "refund-order") {
    const order = await fetchOrderById(orderId);
    if (!order || !order.paymentId) return { success: false, error: "Order or payment ID not found" };
    
    try {
      await refundOrder(order.paymentId, order.total);
      await updateOrderStatus(orderId, 'refunded');
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  return null;
}
