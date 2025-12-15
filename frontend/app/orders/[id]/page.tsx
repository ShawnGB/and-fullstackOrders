import { redirect, notFound } from "next/navigation";
import Link from "next/link";

const API_URL = process.env.API_URL || "http://localhost:3000";

async function getOrder(id: string): Promise<Order | null> {
  try {
    const response = await fetch(`${API_URL}/order/${id}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching order:", error);
    return null;
  }
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!id) redirect("/orders");

  const order = await getOrder(id);

  if (!order) {
    notFound();
  }

  return (
    <section>
      <Link href="/orders" className="back-link">
        ← Back to Orders
      </Link>

      <h2>Order Details</h2>

      <div className="detail-card">
        <div className="detail-row">
          <strong>Order Number:</strong>
          <span>{order.orderNumber}</span>
        </div>
        <div className="detail-row">
          <strong>Customer:</strong>
          <Link href={`/customers/${order.customer.id}`} className="link">
            {order.customer.name}
          </Link>
        </div>
        <div className="detail-row">
          <strong>Customer Email:</strong>
          <span>{order.customer.email}</span>
        </div>
        <div className="detail-row">
          <strong>Total Price:</strong>
          <span>{Number(order.totalPrice).toFixed(2)} €</span>
        </div>
        <div className="detail-row">
          <strong>Created:</strong>
          <span>{new Date(order.createdAt).toLocaleDateString()}</span>
        </div>
      </div>

      <h3>Products ({order.products?.length || 0})</h3>

      {order.products && order.products.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {order.products.map((product) => (
              <tr key={product.id}>
                <td>
                  <Link href={`/products/${product.id}`}>{product.name}</Link>
                </td>
                <td>{product.description}</td>
                <td>{Number(product.price).toFixed(2)} €</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p style={{ textAlign: "center", padding: "2em", color: "#666" }}>
          No products in this order
        </p>
      )}
    </section>
  );
}
