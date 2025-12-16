"use client";

import { useState } from "react";
import AddEntityButton from "@/components/ui/AddEntityButton";
import EntityForm from "@/components/forms/EntityForm";
import { createOrder } from "@/actions/orders";
import { getOrderFormData } from "@/actions/orderFormData";

export default function AddOrderButton() {
  const [formData, setFormData] = useState<{
    customers: Customer[];
    products: Product[];
    loading: boolean;
  }>({
    customers: [],
    products: [],
    loading: false,
  });

  const handleModalOpen = async () => {
    setFormData({ customers: [], products: [], loading: true });
    const data = await getOrderFormData();
    setFormData({
      customers: data.customers,
      products: data.products,
      loading: false,
    });
  };

  const handleCreateOrder = async (data: CreateOrder) => {
    const result = await createOrder(data);
    return result.success;
  };

  return (
    <AddEntityButton
      title="Create New Order"
      buttonTitle="Create new Order"
      onOpen={handleModalOpen}
    >
      {({ onClose, onSuccess }) =>
        formData.loading ? (
          <div>Loading form data...</div>
        ) : (
          <EntityForm
            type="order"
            customers={formData.customers}
            products={formData.products}
            onSubmit={async (data) => {
              const success = await handleCreateOrder(data);
              if (success) {
                onSuccess();
              }
            }}
            onCancel={onClose}
          />
        )
      }
    </AddEntityButton>
  );
}
