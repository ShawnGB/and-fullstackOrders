import Link from "next/link";
import AddOrderButton from "./AddOrderButton";

interface OrdersTableProps {
  orders: Order[];
}

export default function OrdersTable({ orders }: OrdersTableProps) {
  return (
    <table>
      <thead>
        <tr>
          <th>Order #</th>
          <th>Customer</th>
          <th>Products</th>
          <th>Total Price</th>
          <th>
            <AddOrderButton />
          </th>
        </tr>
      </thead>
      <tbody>
        {orders.length === 0 ? (
          <tr>
            <td colSpan={5} style={{ textAlign: "center", padding: "2em" }}>
              No orders found
            </td>
          </tr>
        ) : (
          orders.map((order) => (
            <tr key={order.id}>
              <td>{order.orderNumber}</td>
              <td>{order.customer.name}</td>
              <td>
                {order.products.length > 0
                  ? order.products.map((p) => p.name).join(", ")
                  : "No products"}
              </td>
              <td>{Number(order.totalPrice).toFixed(2)} €</td>
              <td>
                <Link href={`/orders/${order.id}`}>View Details</Link>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
