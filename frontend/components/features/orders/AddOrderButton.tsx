"use client";

import AddEntityButton from "@/components/ui/AddEntityButton";
import OrderForm from "@/components/forms/OrderForm";
import { createOrder } from "@/actions/orders";

export default function AddOrderButton() {
  const handleCreateOrder = async (data: CreateOrder) => {
    const result = await createOrder(data);
    return result.success;
  };

  return (
    <AddEntityButton
      title="Create New Order"
      buttonTitle="Create new Order"
    >
      {({ onClose, onSuccess }) => (
        <OrderForm
          onSubmit={async (data) => {
            const success = await handleCreateOrder(data);
            if (success) {
              onSuccess();
            }
          }}
          onCancel={onClose}
        />
      )}
    </AddEntityButton>
  );
}
