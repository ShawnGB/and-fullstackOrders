import ProductsTable from "@/components/features/products/ProductsTable";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

async function getProducts(): Promise<Product[]> {
  try {
    return await apiClient.get<Product[]>(API_ENDPOINTS.products.list);
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <section>
      <ProductsTable products={products} />
    </section>
  );
}
