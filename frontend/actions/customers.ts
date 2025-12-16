"use server";

import { revalidatePath } from "next/cache";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

export async function createCustomer(data: CreateCustomer) {
  try {
    await apiClient.post(API_ENDPOINTS.customers.create, data);
    revalidatePath("/customers");
    return { success: true };
  } catch (error) {
    console.error("Error creating customer:", error);
    return { success: false, error: "Failed to create customer" };
  }
}

export async function updateCustomer(id: string, data: UpdateCustomer) {
  try {
    await apiClient.put(API_ENDPOINTS.customers.update(id), data);
    revalidatePath("/customers");
    revalidatePath(`/customers/${id}`);
    return { success: true };
  } catch (error) {
    console.error("Error updating customer:", error);
    return { success: false, error: "Failed to update customer" };
  }
}

export async function deleteCustomer(id: string) {
  try {
    await apiClient.delete(API_ENDPOINTS.customers.delete(id));
    revalidatePath("/customers");
    return { success: true };
  } catch (error) {
    console.error("Error deleting customer:", error);
    return { success: false, error: "Failed to delete customer" };
  }
}
