"use client";

import AddEntityButton from "@/components/ui/AddEntityButton";
import EntityForm from "@/components/forms/EntityForm";
import { createCustomer } from "@/actions/customers";

export default function AddCustomerButton() {
  const handleCreateCustomer = async (data: CreateCustomer) => {
    const result = await createCustomer(data);
    return result.success;
  };

  return (
    <AddEntityButton
      title="Create New Customer"
      buttonTitle="Create new Customer"
    >
      {({ onClose, onSuccess }) => (
        <EntityForm
          type="customer"
          onSubmit={async (data) => {
            const success = await handleCreateCustomer(data);
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
