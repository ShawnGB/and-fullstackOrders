import CustomersTable from "@/components/features/customers/CustomersTable";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

async function getCustomers(): Promise<Customer[]> {
  try {
    return await apiClient.get<Customer[]>(API_ENDPOINTS.customers.list);
  } catch (error) {
    console.error("Error fetching customers:", error);
    return [];
  }
}

export default async function CustomersPage() {
  const customers = await getCustomers();

  return (
    <section>
      <CustomersTable customers={customers} />
    </section>
  );
}
