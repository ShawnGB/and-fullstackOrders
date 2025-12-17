/**
 * Centralized API endpoint definitions
 */
export const API_ENDPOINTS = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    logout: "/auth/logout",
    refresh: "/auth/refresh",
    me: "/auth/me",
  },
  customers: {
    list: "/customer",
    detail: (id: string) => `/customer/${id}`,
    create: "/customer",
    update: (id: string) => `/customer/${id}`,
    delete: (id: string) => `/customer/${id}`,
  },
  products: {
    list: "/product",
    detail: (id: string) => `/product/${id}`,
    create: "/product",
    update: (id: string) => `/product/${id}`,
    delete: (id: string) => `/product/${id}`,
  },
  orders: {
    list: "/order",
    detail: (id: string) => `/order/${id}`,
    create: "/order",
    update: (id: string) => `/order/${id}`,
    delete: (id: string) => `/order/${id}`,
  },
} as const;
