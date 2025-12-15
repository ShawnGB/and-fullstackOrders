'use client';

import { useState } from 'react';
import Modal from './Modal';
import EntityForm from './EntityForm';

interface ProductsListProps {
  products: Product[];
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default function ProductsList({ products }: ProductsListProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateProduct = async (data: CreateProduct) => {
    try {
      const response = await fetch(`${API_URL}/product`, {
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
      console.error('Error creating product:', error);
    }
  };

  return (
    <>
      <section>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Price</th>
              <th>
                <button
                  className="btn-add"
                  onClick={() => setIsModalOpen(true)}
                  title="Create new Product"
                >
                  +
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', padding: '2em' }}>
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
        title="Create New Product"
      >
        <EntityForm
          type="product"
          onSubmit={handleCreateProduct}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </>
  );
}
