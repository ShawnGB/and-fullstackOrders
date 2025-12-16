import Link from "next/link";
import Table, { TableColumn } from "@/components/ui/Table";
import AddOrderButton from "./AddOrderButton";
import { formatPrice } from "@/lib/utils/formatters";

interface OrdersTableProps {
  orders: Order[];
}

export default function OrdersTable({ orders }: OrdersTableProps) {
  const columns: TableColumn<Order>[] = [
    {
      header: "Order #",
      accessor: "orderNumber",
    },
    {
      header: "Customer",
      render: (order) => order.customer.name,
    },
    {
      header: "Products",
      render: (order) =>
        order.products.length > 0
          ? order.products.map((p) => p.name).join(", ")
          : "No products",
    },
    {
      header: "Total Price",
      render: (order) => formatPrice(order.totalPrice),
    },
    {
      header: "",
      render: (order) => (
        <Link href={`/orders/${order.id}`}>View Details</Link>
      ),
    },
  ];

  return (
    <Table
      data={orders}
      columns={columns}
      keyExtractor={(order) => order.id}
      emptyMessage="No orders found"
      actionButton={<AddOrderButton />}
    />
  );
}
