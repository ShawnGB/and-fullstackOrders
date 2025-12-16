/**
 * Centralized API URL configuration
 *
 * Server Components use API_URL
 * Client Components use CLIENT_API_URL
 */
export const API_URL = process.env.API_URL || "http://localhost:3000";

export const CLIENT_API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
