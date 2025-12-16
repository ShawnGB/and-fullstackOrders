"use client";

import AddEntityButton from "@/components/ui/AddEntityButton";
import EntityForm from "@/components/forms/EntityForm";
import { createProduct } from "@/actions/products";

export default function AddProductButton() {
  const handleCreateProduct = async (data: CreateProduct) => {
    const result = await createProduct(data);
    return result.success;
  };

  return (
    <AddEntityButton
      title="Create New Product"
      buttonTitle="Create new Product"
    >
      {({ onClose, onSuccess }) => (
        <EntityForm
          type="product"
          onSubmit={async (data) => {
            const success = await handleCreateProduct(data);
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
