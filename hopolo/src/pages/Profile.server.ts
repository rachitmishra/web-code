import { getAuthenticatedUser } from '../lib/auth.server';
import { getSecureProfile, updateSecureProfile, saveAddress, deleteAddress } from '../services/profileService.server';
import { fetchOrdersByUserId } from '../services/orderService.server';

export async function loader({ request }: { request: Request }) {
  const user = await getAuthenticatedUser(request);
  if (!user) return { profile: null, orders: [] };

  const [profile, orders] = await Promise.all([
    getSecureProfile(user.uid),
    fetchOrdersByUserId(user.uid)
  ]);

  return { profile, orders };
}

export async function action({ request }: { request: Request }) {
  const user = await getAuthenticatedUser(request);
  if (!user) throw new Response("Unauthorized", { status: 401 });

  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "update-profile") {
    const displayName = formData.get("displayName") as string;
    const emoji = formData.get("emoji") as string;
    await updateSecureProfile(user.uid, { displayName, emoji });
    return { success: true };
  }

  if (intent === "add-address") {
    const street = formData.get("street") as string;
    const city = formData.get("city") as string;
    const zip = formData.get("zip") as string;
    await saveAddress(user.uid, { street, city, zip });
    return { success: true };
  }

  if (intent === "delete-address") {
    const index = parseInt(formData.get("index") as string, 10);
    await deleteAddress(user.uid, index);
    return { success: true };
  }

  return null;
}
