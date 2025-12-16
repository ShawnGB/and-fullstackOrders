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
    throw new Error(`API Error: ${response.statusText}`);
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

  delete: <T>(endpoint: string) => apiFetch<T>(endpoint, { method: "DELETE" }),
};

/**
 * Client-side API client (for Client Components)
 */
export const clientApiClient = {
  get: <T>(endpoint: string) => apiFetch<T>(endpoint, { isClient: true }),

  post: <T>(endpoint: string, data: unknown) =>
    apiFetch<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
      isClient: true,
    }),

  put: <T>(endpoint: string, data: unknown) =>
    apiFetch<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
      isClient: true,
    }),

  delete: <T>(endpoint: string) =>
    apiFetch<T>(endpoint, {
      method: "DELETE",
      isClient: true,
    }),
};
