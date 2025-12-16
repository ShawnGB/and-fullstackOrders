import { API_URL, CLIENT_API_URL } from "../config/constants";

type FetchOptions = RequestInit & {
  isClient?: boolean;
};

/**
 * Generic API fetch wrapper with error handling
 */
async function apiFetch<T>(
  endpoint: string,
  options: FetchOptions = {},
): Promise<T> {
  const { isClient = false, ...fetchOptions } = options;
  const baseUrl = isClient ? CLIENT_API_URL : API_URL;

  const response = await fetch(`${baseUrl}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...fetchOptions.headers,
    },
    ...fetchOptions,
  });

  if (!response.ok) {
    // Try to get error message from response body
    let errorMessage = response.statusText;
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch {
      // If parsing fails, use statusText
    }
    throw new Error(errorMessage);
  }

  // Check if response has content before parsing
  const contentLength = response.headers.get("content-length");
  if (contentLength === "0" || response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

/**
 * Server-side API client (for Server Components)
 */
export const apiClient = {
  get: <T>(endpoint: string) => apiFetch<T>(endpoint, { cache: "no-store" }),

  post: <T>(endpoint: string, data: unknown) =>
    apiFetch<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  put: <T>(endpoint: string, data: unknown) =>
    apiFetch<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  patch: <T>(endpoint: string, data: unknown) =>
    apiFetch<T>(endpoint, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  delete: <T>(endpoint: string) => apiFetch<T>(endpoint, { method: "DELETE" }),
};
