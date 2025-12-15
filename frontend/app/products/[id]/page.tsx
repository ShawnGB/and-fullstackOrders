import { redirect, notFound } from "next/navigation";
import Link from "next/link";

const API_URL = process.env.API_URL || "http://localhost:3000";

async function getProduct(id: string): Promise<Product | null> {
  try {
    const response = await fetch(`${API_URL}/product/${id}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    return response.json();
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
          <span>{Number(product.price).toFixed(2)} €</span>
        </div>
        <div className="detail-row">
          <strong>Created:</strong>
          <span>{new Date(product.createdAt).toLocaleDateString()}</span>
        </div>
        <div className="detail-row">
          <strong>Last Updated:</strong>
          <span>{new Date(product.updatedAt).toLocaleDateString()}</span>
        </div>
      </div>
    </section>
  );
}
