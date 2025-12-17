import axios, { AxiosError, AxiosResponse } from "axios";
import { API_URL, CLIENT_API_URL } from "../config/constants";
import { API_ENDPOINTS } from "./endpoints";
import { cookies } from "next/headers";

// Flag to prevent multiple concurrent refresh requests
let isRefreshing = false;
let refreshPromise: Promise<void> | null = null;

// Helper to get cookie header for server-side requests
async function getCookieHeader(): Promise<string | undefined> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token");
    const refreshToken = cookieStore.get("refresh_token");

    const cookieParts: string[] = [];
    if (accessToken) cookieParts.push(`access_token=${accessToken.value}`);
    if (refreshToken) cookieParts.push(`refresh_token=${refreshToken.value}`);

    return cookieParts.length > 0 ? cookieParts.join("; ") : undefined;
  } catch {
    return undefined;
  }
}

// Create axios instance for server-side requests
const serverAxios = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Create axios instance for client-side requests
const clientAxios = axios.create({
  baseURL: CLIENT_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add response interceptor for client-side requests to handle 401 errors
clientAxios.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    // If error is 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // If not already refreshing, start refresh
        if (!isRefreshing) {
          isRefreshing = true;
          refreshPromise = clientAxios
            .post(API_ENDPOINTS.auth.refresh)
            .then(() => {
              // Refresh successful
            })
            .finally(() => {
              isRefreshing = false;
              refreshPromise = null;
            });
        }

        // Wait for refresh to complete
        await refreshPromise;

        // Retry original request
        return clientAxios(originalRequest);
      } catch (refreshError) {
        // Refresh failed, redirect to login
        if (typeof window !== "undefined") {
          window.location.href = "/auth/login";
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

/**
 * Generic API client wrapper
 */
export const apiClient = {
  get: async <T>(endpoint: string, isClient = false): Promise<T> => {
    const axiosInstance = isClient ? clientAxios : serverAxios;
    const config: any = {};

    // Forward cookies for server-side requests
    if (!isClient) {
      const cookieHeader = await getCookieHeader();
      if (cookieHeader) {
        config.headers = { Cookie: cookieHeader };
      }
    }

    const response = await axiosInstance.get<T>(endpoint, config);
    return response.data;
  },

  post: async <T>(
    endpoint: string,
    data: unknown,
    isClient = false
  ): Promise<T> => {
    const axiosInstance = isClient ? clientAxios : serverAxios;
    const config: any = {};

    // Forward cookies for server-side requests
    if (!isClient) {
      const cookieHeader = await getCookieHeader();
      if (cookieHeader) {
        config.headers = { Cookie: cookieHeader };
      }
    }

    const response = await axiosInstance.post<T>(endpoint, data, config);
    return response.data;
  },

  put: async <T>(
    endpoint: string,
    data: unknown,
    isClient = false
  ): Promise<T> => {
    const axiosInstance = isClient ? clientAxios : serverAxios;
    const config: any = {};

    // Forward cookies for server-side requests
    if (!isClient) {
      const cookieHeader = await getCookieHeader();
      if (cookieHeader) {
        config.headers = { Cookie: cookieHeader };
      }
    }

    const response = await axiosInstance.put<T>(endpoint, data, config);
    return response.data;
  },

  patch: async <T>(
    endpoint: string,
    data: unknown,
    isClient = false
  ): Promise<T> => {
    const axiosInstance = isClient ? clientAxios : serverAxios;
    const config: any = {};

    // Forward cookies for server-side requests
    if (!isClient) {
      const cookieHeader = await getCookieHeader();
      if (cookieHeader) {
        config.headers = { Cookie: cookieHeader };
      }
    }

    const response = await axiosInstance.patch<T>(endpoint, data, config);
    return response.data;
  },

  delete: async <T>(endpoint: string, isClient = false): Promise<T> => {
    const axiosInstance = isClient ? clientAxios : serverAxios;
    const config: any = {};

    // Forward cookies for server-side requests
    if (!isClient) {
      const cookieHeader = await getCookieHeader();
      if (cookieHeader) {
        config.headers = { Cookie: cookieHeader };
      }
    }

    const response = await axiosInstance.delete<T>(endpoint, config);
    return response.data;
  },
};
