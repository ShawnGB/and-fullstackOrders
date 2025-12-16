import Link from "next/link";
import Table, { TableColumn } from "@/components/ui/Table";
import AddProductButton from "./AddProductButton";
import { formatPrice } from "@/lib/utils/formatters";

interface ProductsTableProps {
  products: Product[];
}

export default function ProductsTable({ products }: ProductsTableProps) {
  const columns: TableColumn<Product>[] = [
    {
      header: "Name",
      accessor: "name",
    },
    {
      header: "Description",
      accessor: "description",
    },
    {
      header: "Price",
      render: (product) => formatPrice(product.price),
    },
    {
      header: "",
      render: (product) => (
        <Link href={`/products/${product.id}`}>View Details</Link>
      ),
    },
  ];

  return (
    <Table
      data={products}
      columns={columns}
      keyExtractor={(product) => product.id}
      emptyMessage="No products found"
      actionButton={<AddProductButton />}
    />
  );
}
