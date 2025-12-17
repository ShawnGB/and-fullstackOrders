import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const PUBLIC_ROUTES = ["/", "/products", "/auth/login", "/auth/register"];

const isPublicRoute = (pathname: string): boolean => {
  // Exact match
  if (PUBLIC_ROUTES.includes(pathname)) return true;

  // Product detail pages
  if (pathname.startsWith("/products/")) return true;

  return false;
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get("access_token")?.value;

  // No token - redirect to login
  if (!accessToken) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Verify token
  try {
    const secret = new TextEncoder().encode(
      process.env.JWT_ACCESS_SECRET ||
        "your-super-secret-jwt-access-key-change-this-in-production-min-32-chars"
    );
    await jwtVerify(accessToken, secret);
    return NextResponse.next();
  } catch (error) {
    // Token invalid or expired - try refresh
    const refreshToken = request.cookies.get("refresh_token")?.value;

    if (refreshToken) {
      // Attempt token refresh
      try {
        const refreshResponse = await fetch(
          `${process.env.API_URL || "http://localhost:3000"}/auth/refresh`,
          {
            method: "POST",
            headers: {
              Cookie: `refresh_token=${refreshToken}`,
            },
          }
        );

        if (refreshResponse.ok) {
          const response = NextResponse.next();

          // Forward new cookies
          const setCookieHeader = refreshResponse.headers.get("set-cookie");
          if (setCookieHeader) {
            response.headers.set("set-cookie", setCookieHeader);
          }

          return response;
        }
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
      }
    }

    // Refresh failed - redirect to login
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
