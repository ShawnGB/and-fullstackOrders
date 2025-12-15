import Link from "next/link";
import AddCustomerButton from "./AddCustomerButton";

interface CustomersTableProps {
  customers: Customer[];
}

export default function CustomersTable({ customers }: CustomersTableProps) {
  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Orders</th>
          <th>
            <AddCustomerButton />
          </th>
        </tr>
      </thead>
      <tbody>
        {customers.length === 0 ? (
          <tr>
            <td colSpan={4} style={{ textAlign: "center", padding: "2em" }}>
              No customers found
            </td>
          </tr>
        ) : (
          customers.map((customer) => (
            <tr key={customer.id}>
              <td>{customer.name}</td>
              <td>{customer.email}</td>
              <td>{customer.orders?.length || 0}</td>
              <td>
                <Link href={`/customers/${customer.id}`}>View Details</Link>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
