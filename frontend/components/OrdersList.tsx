'use client';

import { useState } from 'react';
import Modal from './Modal';
import OrderForm from './OrderForm';

interface OrdersListProps {
  orders: Order[];
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default function OrdersList({ orders }: OrdersListProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateOrder = async (data: CreateOrder) => {
    try {
      const response = await fetch(`${API_URL}/order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setIsModalOpen(false);
        window.location.reload();
      }
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  return (
    <>
      <section>
        <table>
          <thead>
            <tr>
              <th>Order #</th>
              <th>Customer</th>
              <th>Products</th>
              <th>Total Price</th>
              <th>
                <button
                  className="btn-add"
                  onClick={() => setIsModalOpen(true)}
                  title="Create new Order"
                >
                  +
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '2em' }}>
                  No orders found
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.orderNumber}</td>
                  <td>{order.customer.name}</td>
                  <td>
                    {order.products.length > 0
                      ? order.products.map(p => p.name).join(', ')
                      : 'No products'}
                  </td>
                  <td>{Number(order.totalPrice).toFixed(2)} €</td>
                  <td>
                    <button className="btn-edit">Edit</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Order"
      >
        <OrderForm
          onSubmit={handleCreateOrder}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </>
  );
}
