import { requireRole } from '../../lib/auth.server';
import { getStorefrontSettings, updateStorefrontSettings } from '../../services/storefrontService.server';

export async function loader({ request }: { request: Request }) {
  await requireRole(request, ['admin']);
  const settings = await getStorefrontSettings();
  return { settings };
}

export async function action({ request }: { request: Request }) {
  await requireRole(request, ['admin']);
  const formData = await request.formData();
  const pageContentJson = formData.get("pageContent") as string;
  
  try {
    const pageContent = JSON.parse(pageContentJson);
    await updateStorefrontSettings({ pageContent });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
