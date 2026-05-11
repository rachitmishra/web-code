import { requireRole } from '../../lib/auth.server';
import { getStorefrontSettings, updateStorefrontSettings } from '../../services/storefrontService.server';
import { type StorefrontSettings } from '../../services/storefrontService';

export async function loader({ request }: { request: Request }) {
  await requireRole(request, ['admin']);
  const settings = await getStorefrontSettings();
  return { settings };
}

export async function action({ request }: { request: Request }) {
  await requireRole(request, ['admin']);
  const formData = await request.formData();
  const settingsJson = formData.get("settings") as string;
  
  try {
    const settings = JSON.parse(settingsJson);
    await updateStorefrontSettings(settings);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
