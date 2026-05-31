import { requireRole } from "../../lib/auth.server";
import { fetchAllOrders } from "../../services/orderService.server";

export async function loader({ request }: { request: Request }) {
  await requireRole(request, ['admin']);
  const orders = await fetchAllOrders();
  return { orders };
}
