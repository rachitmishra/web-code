import { requireRole } from '../../lib/auth.server';
import { fetchProducts, saveProduct } from '../../services/productService.server';

export async function loader({ request }: { request: Request }) {
  await requireRole(request, ['admin']);
  const products = await fetchProducts();
  return { products };
}

export async function action({ request }: { request: Request }) {
  await requireRole(request, ['admin']);
  const formData = await request.formData();
  const productJson = formData.get("product") as string;
  
  try {
    const productData = JSON.parse(productJson);
    await saveProduct(productData);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
