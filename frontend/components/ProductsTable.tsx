import Link from "next/link";
import AddProductButton from "./AddProductButton";

interface ProductsTableProps {
  products: Product[];
}

export default function ProductsTable({ products }: ProductsTableProps) {
  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Description</th>
          <th>Price</th>
          <th>
            <AddProductButton />
          </th>
        </tr>
      </thead>
      <tbody>
        {products.length === 0 ? (
          <tr>
            <td colSpan={4} style={{ textAlign: "center", padding: "2em" }}>
              No products found
            </td>
          </tr>
        ) : (
          products.map((product) => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{product.description}</td>
              <td>{Number(product.price).toFixed(2)} €</td>
              <td>
                <Link href={`/products/${product.id}`}>View Details</Link>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
