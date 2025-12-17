"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import {
  LoginCredentials,
  RegisterData,
  AuthResponse,
  ActionResult,
  User,
} from "@/types/auth";

export async function login(
  credentials: LoginCredentials
): Promise<ActionResult<User>> {
  try {
    const response = await fetch(
      `${process.env.API_URL || "http://localhost:3000"}${
        API_ENDPOINTS.auth.login
      }`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
        credentials: "include",
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || "Login failed" };
    }

    const data: AuthResponse = await response.json();

    // Forward cookies from backend to client
    // Use getSetCookie() to get all Set-Cookie headers as an array
    const setCookieHeaders =
      response.headers.getSetCookie?.() ||
      (response.headers.get("set-cookie")?.split(", ") ?? []);

    if (setCookieHeaders.length > 0) {
      const cookieStore = await cookies();

      for (const cookieHeader of setCookieHeaders) {
        // Parse cookie: "name=value; HttpOnly; Secure; ..."
        const [nameValue] = cookieHeader.split(";");
        const [name, value] = nameValue.split("=");

        if (name && value) {
          // Extract cookie attributes
          const isHttpOnly = cookieHeader.includes("HttpOnly");
          const isSecure = cookieHeader.includes("Secure");
          const sameSiteMatch = cookieHeader.match(/SameSite=(\w+)/i);
          const maxAgeMatch = cookieHeader.match(/Max-Age=(\d+)/i);

          cookieStore.set(name.trim(), value.trim(), {
            httpOnly: isHttpOnly,
            secure: isSecure || process.env.NODE_ENV === "production",
            sameSite: (sameSiteMatch?.[1]?.toLowerCase() as any) || "strict",
            path: "/",
            maxAge: maxAgeMatch ? parseInt(maxAgeMatch[1]) : undefined,
          });
        }
      }
    }

    return { success: true, data: data.user };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function register(
  data: RegisterData
): Promise<ActionResult<User>> {
  try {
    const response = await fetch(
      `${process.env.API_URL || "http://localhost:3000"}${
        API_ENDPOINTS.auth.register
      }`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.message || "Registration failed",
      };
    }

    const authResponse: AuthResponse = await response.json();

    // Forward cookies from backend to client
    const setCookieHeaders =
      response.headers.getSetCookie?.() ||
      (response.headers.get("set-cookie")?.split(", ") ?? []);

    if (setCookieHeaders.length > 0) {
      const cookieStore = await cookies();

      for (const cookieHeader of setCookieHeaders) {
        const [nameValue] = cookieHeader.split(";");
        const [name, value] = nameValue.split("=");

        if (name && value) {
          const isHttpOnly = cookieHeader.includes("HttpOnly");
          const isSecure = cookieHeader.includes("Secure");
          const sameSiteMatch = cookieHeader.match(/SameSite=(\w+)/i);
          const maxAgeMatch = cookieHeader.match(/Max-Age=(\d+)/i);

          cookieStore.set(name.trim(), value.trim(), {
            httpOnly: isHttpOnly,
            secure: isSecure || process.env.NODE_ENV === "production",
            sameSite: (sameSiteMatch?.[1]?.toLowerCase() as any) || "strict",
            path: "/",
            maxAge: maxAgeMatch ? parseInt(maxAgeMatch[1]) : undefined,
          });
        }
      }
    }

    return { success: true, data: authResponse.user };
  } catch (error) {
    console.error("Registration error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Registration failed",
    };
  }
}

export async function logout(): Promise<ActionResult> {
  try {
    await apiClient.post(API_ENDPOINTS.auth.logout, {});

    const cookieStore = await cookies();
    cookieStore.delete("access_token");
    cookieStore.delete("refresh_token");

    return { success: true };
  } catch (error) {
    console.error("Logout error:", error);
    return { success: false, error: "Logout failed" };
  }
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const user = await apiClient.get<User>(API_ENDPOINTS.auth.me);
    return user;
  } catch (error) {
    console.error("Get current user error:", error);
    return null;
  }
}

export async function logoutAndRedirect() {
  await logout();
  redirect("/auth/login");
}
