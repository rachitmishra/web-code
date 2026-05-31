import { getSessionIdFromRequest } from "../lib/session";
import { getCart, removeFromCart, updateQuantity } from "../services/cartService.server";
import { validatePromoCode } from "../services/promoService.server";
import { getAuthenticatedUser } from "../lib/auth.server";

export async function loader({ request }: { request: Request }) {
  const user = await getAuthenticatedUser(request);
  const sessionId = user?.uid || getSessionIdFromRequest(request);
  const items = await getCart(sessionId);
  return { items };
}

export async function action({ request }: { request: Request }) {
  const user = await getAuthenticatedUser(request);
  const sessionId = user?.uid || getSessionIdFromRequest(request);
  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "remove") {
    const productId = formData.get("productId") as string;
    const size = formData.get("size") as string;
    const color = formData.get("color") as string;
    await removeFromCart(sessionId, productId, { size, color });
    return { success: true };
  }

  if (intent === "update-quantity") {
    const productId = formData.get("productId") as string;
    const quantity = parseInt(formData.get("quantity") as string, 10);
    const size = formData.get("size") as string;
    const color = formData.get("color") as string;
    await updateQuantity(sessionId, productId, quantity, { size, color });
    return { success: true };
  }

  if (intent === "apply-promo") {
    const code = formData.get("code") as string;
    const subtotal = parseFloat(formData.get("subtotal") as string);
    try {
      const result = await validatePromoCode(code, subtotal);
      return { success: true, promo: { code, ...result } };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  return null;
}
