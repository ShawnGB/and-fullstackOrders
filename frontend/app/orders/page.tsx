import OrdersList from '@/components/OrdersList';

const API_URL = process.env.API_URL || 'http://localhost:3000';

async function getOrders(): Promise<Order[]> {
  try {
    const response = await fetch(`${API_URL}/order`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch orders: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
}

export default async function OrdersPage() {
  const orders = await getOrders();

  console.log('Orders:', orders);

  return <OrdersList orders={orders} />;
}
