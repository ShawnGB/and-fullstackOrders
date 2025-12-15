"use client";

import { useState } from "react";
import Modal from "./Modal";
import EntityForm from "./EntityForm";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export default function AddProductButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateProduct = async (data: CreateProduct) => {
    try {
      const response = await fetch(`${API_URL}/product`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setIsModalOpen(false);
        window.location.reload();
      }
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  return (
    <>
      <button
        className="btn-add"
        onClick={() => setIsModalOpen(true)}
        title="Create new Product"
      >
        +
      </button>

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
