import CustomersTable from "@/components/CustomersTable";

const API_URL = process.env.API_URL || "http://localhost:3000";

async function getCustomers(): Promise<Customer[]> {
  try {
    const response = await fetch(`${API_URL}/customer`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch customers: ${response.statusText}`);
    }

    return response.json();
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
