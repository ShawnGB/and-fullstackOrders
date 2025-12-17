"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/lib/stores/auth-store";
import { logoutAndRedirect } from "@/actions/auth";

export default function Header() {
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuthStore();

  const handleLogout = async () => {
    await logoutAndRedirect();
  };

  return (
    <header>
      <Link href="/">Admin</Link>
      <nav>
        <ul>
          <li>
            <Link
              href="/customers"
              className={pathname === "/customers" ? "active" : ""}
            >
              Customers
            </Link>
          </li>
          <li>
            <Link
              href="/products"
              className={pathname === "/products" ? "active" : ""}
            >
              Products
            </Link>
          </li>
          <li>
            <Link
              href="/orders"
              className={pathname === "/orders" ? "active" : ""}
            >
              Orders
            </Link>
          </li>
        </ul>
      </nav>

      <div className="auth-section">
        {isAuthenticated && user ? (
          <>
            <span>Welcome, {user.name}</span>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link href="/auth/login">Login</Link>
            <Link href="/auth/register">Register</Link>
          </>
        )}
      </div>
    </header>
  );
}
