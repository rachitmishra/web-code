import { requireRole } from '../../lib/auth.server';
import { fetchPDPLayout, updatePDPLayout } from '../../services/storefrontService.server';

export async function loader({ request }: { request: Request }) {
  await requireRole(request, ['admin']);
  const layout = await fetchPDPLayout();
  return { layout };
}

export async function action({ request }: { request: Request }) {
  await requireRole(request, ['admin']);
  const formData = await request.formData();
  const layoutJson = formData.get("layout") as string;
  
  try {
    const layout = JSON.parse(layoutJson);
    await updatePDPLayout(layout);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
