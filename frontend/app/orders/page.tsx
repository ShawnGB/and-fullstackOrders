import OrdersTable from "@/components/features/orders/OrdersTable";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

async function getOrders(): Promise<Order[]> {
  try {
    return await apiClient.get<Order[]>(API_ENDPOINTS.orders.list);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
}

export default async function OrdersPage() {
  const orders = await getOrders();

  return (
    <section>
      <OrdersTable orders={orders} />
    </section>
  );
}
