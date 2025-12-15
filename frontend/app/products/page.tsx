import ProductsList from '@/components/ProductsList';

const API_URL = process.env.API_URL || 'http://localhost:3000';

async function getProducts(): Promise<Product[]> {
  try {
    const response = await fetch(`${API_URL}/product`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export default async function ProductsPage() {
  const products = await getProducts();

  console.log('Products:', products);

  return <ProductsList products={products} />;
}
