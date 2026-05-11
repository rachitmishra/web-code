import { getStorefrontSettings } from '../services/storefrontService.server';
import { DEFAULT_SETTINGS } from '../services/storefrontService';

export async function loader({ request }: { request: Request }) {
  const settings = await getStorefrontSettings() || DEFAULT_SETTINGS;
  const url = new URL(request.url);
  const path = url.pathname;
  
  const content = settings.pageContent?.[path] || {
    title: 'Not Found',
    content: 'The requested information is not available at this time.'
  };

  return { content };
}
