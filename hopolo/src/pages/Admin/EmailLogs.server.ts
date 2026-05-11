import { requireRole } from "../../lib/auth.server";
import { fetchEmailLogs } from "../../services/emailService.server";

export async function loader({ request }: { request: Request }) {
  await requireRole(request, ['admin']);
  const logs = await fetchEmailLogs();
  return { logs };
}
