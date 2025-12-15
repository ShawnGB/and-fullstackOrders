"use client";

import { useState } from "react";
import Modal from "./Modal";
import EntityForm from "./EntityForm";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export default function AddCustomerButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateCustomer = async (data: CreateCustomer) => {
    try {
      const response = await fetch(`${API_URL}/customer`, {
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
      console.error("Error creating customer:", error);
    }
  };

  return (
    <>
      <button
        className="btn-add"
        onClick={() => setIsModalOpen(true)}
        title="Create new Customer"
      >
        +
      </button>

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
