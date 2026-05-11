import { requireRole } from '../../lib/auth.server';
import { createInvitation } from '../../services/profileService.server';

export async function loader({ request }: { request: Request }) {
  await requireRole(request, ['admin']);
  return null;
}

export async function action({ request }: { request: Request }) {
  const { user } = await requireRole(request, ['admin']);
  const formData = await request.formData();
  const phoneNumber = formData.get("phoneNumber") as string;
  const role = formData.get("role") as string;

  try {
    const result = await createInvitation(user.uid, phoneNumber, role);
    return { success: true, inviteCode: result.inviteCode };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
