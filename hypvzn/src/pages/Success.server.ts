import { fetchOrderById } from '../services/orderService.server';

export async function loader({ params }: { params: any }) {
  const { orderId } = params;
  if (!orderId) throw new Response("Order ID required", { status: 400 });
  
  const order = await fetchOrderById(orderId);
  return { order };
}
