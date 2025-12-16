"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import EditEntityButton from "@/components/ui/EditEntityButton";
import ConfirmModal from "@/components/ui/ConfirmModal";
import EntityForm from "@/components/forms/EntityForm";
import { deleteCustomer, updateCustomer } from "@/actions/customers";
import { deleteProduct, updateProduct } from "@/actions/products";
import { deleteOrder, updateOrder } from "@/actions/orders";
import { getOrderFormData } from "@/actions/orderFormData";

type EntityType = "customer" | "product" | "order";

interface EntityActionsProps {
  type: EntityType;
  entity: any;
  entityId: string;
}

export default function EntityActions({
  type,
  entity,
  entityId,
}: EntityActionsProps) {
  const router = useRouter();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // For orders - fetch customers and products when editing
  const [orderFormData, setOrderFormData] = useState<{
    customers: Customer[];
    products: Product[];
    loading: boolean;
  }>({
    customers: [],
    products: [],
    loading: false,
  });

  const handleEditOpen = async () => {
    if (type === "order") {
      setOrderFormData({ customers: [], products: [], loading: true });
      const data = await getOrderFormData();
      setOrderFormData({
        customers: data.customers,
        products: data.products,
        loading: false,
      });
    }
  };

  const handleUpdate = async (data: any) => {
    let result;
    switch (type) {
      case "customer":
        result = await updateCustomer(entityId, data);
        break;
      case "product":
        result = await updateProduct(entityId, data);
        break;
      case "order":
        result = await updateOrder(entityId, data);
        break;
    }
    return result.success;
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    setDeleteError(null);
    try {
      let result;
      switch (type) {
        case "customer":
          result = await deleteCustomer(entityId);
          break;
        case "product":
          result = await deleteProduct(entityId);
          break;
        case "order":
          result = await deleteOrder(entityId);
          break;
      }

      if (result.success) {
        // Navigate to list page after successful deletion
        router.push(`/${type}s`);
      } else if (result.error) {
        setDeleteError(result.error);
      }
    } catch (error) {
      console.error("Error deleting entity:", error);
      setDeleteError(error instanceof Error ? error.message : "Failed to delete");
    } finally {
      setIsDeleting(false);
    }
  };

  const getInitialValues = () => {
    switch (type) {
      case "customer":
        return {
          name: entity.name,
          email: entity.email,
        };
      case "product":
        return {
          name: entity.name,
          description: entity.description,
          price: entity.price,
        };
      case "order":
        return {
          customerId: entity.customer?.id || entity.customerId,
          productIds: entity.products?.map((p: any) => p.id) || [],
        };
      default:
        return {};
    }
  };

  const getEntityName = () => {
    switch (type) {
      case "customer":
        return entity.name;
      case "product":
        return entity.name;
      case "order":
        return entity.orderNumber;
      default:
        return "this item";
    }
  };

  return (
    <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
      <EditEntityButton
        title={`Edit ${type.charAt(0).toUpperCase() + type.slice(1)}`}
        onOpen={handleEditOpen}
      >
        {({ onClose, onSuccess }) => (
          orderFormData.loading && type === "order" ? (
            <div>Loading form data...</div>
          ) : (
            <EntityForm
              type={type}
              initialValues={getInitialValues()}
              customers={type === "order" ? orderFormData.customers : undefined}
              products={type === "order" ? orderFormData.products : undefined}
              onSubmit={async (data) => {
                const success = await handleUpdate(data);
                if (success) {
                  onSuccess();
                  router.refresh();
                }
              }}
              onCancel={onClose}
            />
          )
        )}
      </EditEntityButton>

      <button
        className="btn-danger"
        onClick={() => setIsDeleteModalOpen(true)}
      >
        Delete
      </button>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeleteError(null);
        }}
        onConfirm={handleDelete}
        title={`Delete ${type.charAt(0).toUpperCase() + type.slice(1)}`}
        message={
          deleteError
            ? deleteError
            : `Are you sure you want to delete ${getEntityName()}? This action cannot be undone.`
        }
        confirmText={isDeleting ? "Deleting..." : "Delete"}
        cancelText={deleteError ? "Close" : "Cancel"}
        variant="danger"
        showConfirmButton={!deleteError}
      />
    </div>
  );
}
