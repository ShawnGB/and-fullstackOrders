import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { formatDate, formatPrice } from "@/lib/utils/formatters";
import EntityActions from "@/components/features/EntityActions";

async function getCustomer(id: string): Promise<Customer | null> {
  try {
    return await apiClient.get<Customer>(API_ENDPOINTS.customers.detail(id));
  } catch (error) {
    console.error("Error fetching customer:", error);
    return null;
  }
}

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!id) redirect("/customers");

  const customer = await getCustomer(id);

  if (!customer) {
    notFound();
  }

  return (
    <section>
      <Link href="/customers" className="back-link">
        ← Back to Customers
      </Link>

      <h2>Customer Details</h2>

      <div className="detail-card">
        <div className="detail-row">
          <strong>Name:</strong>
          <span>{customer.name}</span>
        </div>
        <div className="detail-row">
          <strong>Email:</strong>
          <span>{customer.email}</span>
        </div>
        <div className="detail-row">
          <strong>Created:</strong>
          <span>{formatDate(customer.createdAt)}</span>
        </div>
      </div>

      <EntityActions type="customer" entity={customer} entityId={customer.id} />

      <h3>Orders ({customer.orders?.length || 0})</h3>

      {customer.orders && customer.orders.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Order Number</th>
              <th>Products</th>
              <th>Total Price</th>
            </tr>
          </thead>
          <tbody>
            {customer.orders.map((order) => (
              <tr key={order.id}>
                <td>
                  <Link href={`/orders/${order.id}`}>{order.orderNumber}</Link>
                </td>
                <td>
                  {order.products?.length > 0
                    ? order.products.map((p) => p.name).join(", ")
                    : "No products"}
                </td>
                <td>{formatPrice(order.totalPrice)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p style={{ textAlign: "center", padding: "2em", color: "#666" }}>
          No orders yet
        </p>
      )}
    </section>
  );
}
