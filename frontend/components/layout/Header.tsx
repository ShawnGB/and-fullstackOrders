"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

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
    </header>
  );
}
