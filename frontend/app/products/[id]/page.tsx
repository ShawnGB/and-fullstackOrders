import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { formatDate, formatPrice } from "@/lib/utils/formatters";

async function getProduct(id: string): Promise<Product | null> {
  try {
    return await apiClient.get<Product>(API_ENDPOINTS.products.detail(id));
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!id) redirect("/products");

  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  return (
    <section>
      <Link href="/products" className="back-link">
        ← Back to Products
      </Link>

      <h2>Product Details</h2>

      <div className="detail-card">
        <div className="detail-row">
          <strong>Name:</strong>
          <span>{product.name}</span>
        </div>
        <div className="detail-row">
          <strong>Description:</strong>
          <span>{product.description}</span>
        </div>
        <div className="detail-row">
          <strong>Price:</strong>
          <span>{formatPrice(product.price)}</span>
        </div>
        <div className="detail-row">
          <strong>Created:</strong>
          <span>{formatDate(product.createdAt)}</span>
        </div>
        <div className="detail-row">
          <strong>Last Updated:</strong>
          <span>{formatDate(product.updatedAt)}</span>
        </div>
      </div>
    </section>
  );
}
