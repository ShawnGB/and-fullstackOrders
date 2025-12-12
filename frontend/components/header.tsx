import Link from "next/link";

export default function Header() {
  return (
    <header>
      <div>Admin</div>

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
