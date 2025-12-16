import Link from "next/link";
import Table, { TableColumn } from "@/components/ui/Table";
import AddCustomerButton from "./AddCustomerButton";

interface CustomersTableProps {
  customers: Customer[];
}

export default function CustomersTable({ customers }: CustomersTableProps) {
  const columns: TableColumn<Customer>[] = [
    {
      header: "Name",
      accessor: "name",
    },
    {
      header: "Email",
      accessor: "email",
    },
    {
      header: "Orders",
      render: (customer) => customer.orders?.length || 0,
    },
    {
      header: "",
      render: (customer) => (
        <Link href={`/customers/${customer.id}`}>View Details</Link>
      ),
    },
  ];

  return (
    <Table
      data={customers}
      columns={columns}
      keyExtractor={(customer) => customer.id}
      emptyMessage="No customers found"
      actionButton={<AddCustomerButton />}
    />
  );
}
