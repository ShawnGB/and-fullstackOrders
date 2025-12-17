"use server";

import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

export async function getOrderFormData() {
  try {
    const [customers, products] = await Promise.all([
      apiClient.get<Customer[]>(API_ENDPOINTS.customers.list),
      apiClient.get<Product[]>(API_ENDPOINTS.products.list),
    ]);
    return { customers, products, success: true };
  } catch (error) {
    console.error("Error fetching order form data:", error);
    return { customers: [], products: [], success: false };
  }
}
