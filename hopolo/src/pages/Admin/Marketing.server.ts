import { requireRole } from "../../lib/auth.server";
import { fetchPromoCodes, addPromoCode, deletePromoCode } from "../../services/promoService.server";

export async function loader({ request }: { request: Request }) {
  await requireRole(request, ['admin']);
  const promos = await fetchPromoCodes();
  return { promos };
}

export async function action({ request }: { request: Request }) {
  await requireRole(request, ['admin']);
  const formData = await request.formData();
  const intent = formData.get("intent");

  try {
    if (intent === "add") {
      const code = formData.get("code") as string;
      const type = formData.get("type") as 'percentage' | 'fixed';
      const value = parseFloat(formData.get("value") as string);
      const minPurchase = formData.get("minPurchase") ? parseFloat(formData.get("minPurchase") as string) : undefined;
      
      await addPromoCode({ code, type, value, minPurchase });
      return { success: true };
    }
    if (intent === "delete") {
      const id = formData.get("id") as string;
      await deletePromoCode(id);
      return { success: true };
    }
    return { success: false, error: "Unknown intent" };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
