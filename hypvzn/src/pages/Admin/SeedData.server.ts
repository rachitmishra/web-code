import { requireRole } from '../../lib/auth.server';
import { seedProducts, seedReviews, seedUserProfile } from '../../services/seederService.server';

export async function loader({ request }: { request: Request }) {
  await requireRole(request, ['admin']);
  return null;
}

export async function action({ request }: { request: Request }) {
  const { user } = await requireRole(request, ['admin']);
  const formData = await request.formData();
  const intent = formData.get("intent");

  try {
    if (intent === "seed-products") {
      await seedProducts();
      return { success: true, message: "Products seeded successfully." };
    }
    if (intent === "seed-reviews") {
      await seedReviews();
      return { success: true, message: "Reviews seeded successfully." };
    }
    if (intent === "seed-profile") {
      await seedUserProfile(user.uid);
      return { success: true, message: "Profile seeded successfully." };
    }
    return { success: false, error: "Unknown intent" };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
