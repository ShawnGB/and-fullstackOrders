'use client';

import { useState } from 'react';
import Modal from './Modal';
import EntityForm from './EntityForm';

interface CustomersListProps {
  customers: Customer[];
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default function CustomersList({ customers }: CustomersListProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateCustomer = async (data: CreateCustomer) => {
    try {
      const response = await fetch(`${API_URL}/customer`, {
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
      console.error('Error creating customer:', error);
    }
  };

  return (
    <>
      <section>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Orders</th>
              <th>
                <button
                  className="btn-add"
                  onClick={() => setIsModalOpen(true)}
                  title="Create new Customer"
                >
                  +
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', padding: '2em' }}>
                  No customers found
                </td>
              </tr>
            ) : (
              customers.map((customer) => (
                <tr key={customer.id}>
                  <td>{customer.name}</td>
                  <td>{customer.email}</td>
                  <td>{customer.orders?.length || 0}</td>
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
        title="Create New Customer"
      >
        <EntityForm
          type="customer"
          onSubmit={handleCreateCustomer}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </>
  );
}
