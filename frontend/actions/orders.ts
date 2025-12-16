"use server";

import { revalidatePath } from "next/cache";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

export async function createOrder(data: CreateOrder) {
  try {
    await apiClient.post(API_ENDPOINTS.orders.create, data);
    revalidatePath("/orders");
    return { success: true };
  } catch (error) {
    console.error("Error creating order:", error);
    return { success: false, error: "Failed to create order" };
  }
}

export async function updateOrder(id: string, data: UpdateOrder) {
  try {
    await apiClient.put(API_ENDPOINTS.orders.update(id), data);
    revalidatePath("/orders");
    revalidatePath(`/orders/${id}`);
    return { success: true };
  } catch (error) {
    console.error("Error updating order:", error);
    return { success: false, error: "Failed to update order" };
  }
}

export async function deleteOrder(id: string) {
  try {
    await apiClient.delete(API_ENDPOINTS.orders.delete(id));
    revalidatePath("/orders");
    return { success: true };
  } catch (error) {
    console.error("Error deleting order:", error);
    return { success: false, error: "Failed to delete order" };
  }
}
