import { getCart, clearCart } from "../services/cartService.server";
import { getSecureProfile } from "../services/profileService.server";
import { createOrder } from "../services/orderService.server";
import { getAuthenticatedUser } from "../lib/auth.server";
import { getSessionIdFromRequest } from "../lib/session";

export async function loader({ request }: { request: Request }) {
  const sessionId = getSessionIdFromRequest(request);
  const user = await getAuthenticatedUser(request);
  
  const [items, profile] = await Promise.all([
    getCart(sessionId),
    user ? getSecureProfile(user.uid) : Promise.resolve(null)
  ]);

  return { items, addresses: profile?.addresses || [], user };
}

export async function action({ request }: { request: Request }) {
  const sessionId = getSessionIdFromRequest(request);
  const user = await getAuthenticatedUser(request);
  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "create-order") {
    const orderDataJson = formData.get("orderData") as string;
    try {
      const orderData = JSON.parse(orderDataJson);
      const orderId = await createOrder(orderData);
      await clearCart(sessionId);
      return { success: true, orderId };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  return null;
}
