import Link from "next/link";

export default function Header() {
  return (
    <header>
      <Link href="/">Admin</Link>
      <nav>
        <ul>
          <li>
            <Link href="/customers">Costumers</Link>
          </li>
          <li>
            <Link href="/products">Products</Link>
          </li>
          <li>
            <Link href="/orders">Orders</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
