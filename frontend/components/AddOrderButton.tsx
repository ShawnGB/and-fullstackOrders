"use client";

import { useState } from "react";
import Modal from "./Modal";
import OrderForm from "./OrderForm";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export default function AddOrderButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateOrder = async (data: CreateOrder) => {
    try {
      const response = await fetch(`${API_URL}/order`, {
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
      console.error("Error creating order:", error);
    }
  };

  return (
    <>
      <button
        className="btn-add"
        onClick={() => setIsModalOpen(true)}
        title="Create new Order"
      >
        +
      </button>

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
