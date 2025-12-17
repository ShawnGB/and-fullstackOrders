"use server";

import { revalidatePath } from "next/cache";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

export async function createProduct(data: CreateProduct) {
  try {
    await apiClient.post(API_ENDPOINTS.products.create, data);
    revalidatePath("/products");
    return { success: true };
  } catch (error) {
    console.error("Error creating product:", error);
    return { success: false, error: "Failed to create product" };
  }
}

export async function updateProduct(id: string, data: UpdateProduct) {
  try {
    await apiClient.patch(API_ENDPOINTS.products.update(id), data);
    revalidatePath("/products");
    revalidatePath(`/products/${id}`);
    return { success: true };
  } catch (error) {
    console.error("Error updating product:", error);
    return { success: false, error: "Failed to update product" };
  }
}

export async function deleteProduct(id: string) {
  try {
    await apiClient.delete(API_ENDPOINTS.products.delete(id));
    revalidatePath("/products");
    return { success: true };
  } catch (error) {
    console.error("Error deleting product:", error);
    return { success: false, error: "Failed to delete product" };
  }
}
