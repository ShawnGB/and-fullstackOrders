"use client";

import { useForm } from "react-hook-form";
import { formatPrice } from "@/lib/utils/formatters";

type EntityType = "customer" | "product" | "order";

interface EntityFormProps {
  type: EntityType;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  customers?: Customer[];
  products?: Product[];
  initialValues?: any;
}

export default function EntityForm({
  type,
  onSubmit,
  onCancel,
  customers,
  products,
  initialValues,
}: EntityFormProps) {
  const isEditing = !!initialValues;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: initialValues || (type === "order"
      ? {
          customerId: "",
          productIds: [] as string[],
        }
      : {}),
  });

  const renderFields = () => {
    switch (type) {
      case "customer":
        return (
          <>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                {...register("name", { required: "Name is required" })}
              />
              {errors.name && (
                <span className="error">{errors.name.message as string}</span>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
              />
              {errors.email && (
                <span className="error">{errors.email.message as string}</span>
              )}
            </div>
            {!isEditing && (
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                />
                {errors.password && (
                  <span className="error">
                    {errors.password.message as string}
                  </span>
                )}
              </div>
            )}
          </>
        );

      case "product":
        return (
          <>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                {...register("name", { required: "Name is required" })}
              />
              {errors.name && (
                <span className="error">{errors.name.message as string}</span>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                {...register("description", {
                  required: "Description is required",
                })}
              />
              {errors.description && (
                <span className="error">
                  {errors.description.message as string}
                </span>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="price">Price</label>
              <input
                type="number"
                id="price"
                step="0.01"
                {...register("price", {
                  required: "Price is required",
                  valueAsNumber: true,
                  min: { value: 0, message: "Price must be positive" },
                })}
              />
              {errors.price && (
                <span className="error">{errors.price.message as string}</span>
              )}
            </div>
          </>
        );

      case "order":
        return (
          <>
            <div className="form-group">
              <label htmlFor="customerId">Customer</label>
              <select
                id="customerId"
                {...register("customerId", {
                  required: "Customer is required",
                })}
              >
                <option value="">Select a customer</option>
                {customers?.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name} ({customer.email})
                  </option>
                ))}
              </select>
              {errors.customerId && (
                <span className="error">
                  {errors.customerId.message as string}
                </span>
              )}
            </div>

            <div className="form-group">
              <label>Products (select at least one)</label>
              <div className="checkbox-group">
                {products?.map((product) => (
                  <label key={product.id} className="checkbox-label">
                    <input
                      type="checkbox"
                      value={product.id}
                      {...register("productIds", {
                        validate: (value) =>
                          (value && value.length > 0) ||
                          "Select at least one product",
                      })}
                    />
                    <span>
                      {product.name} - {formatPrice(product.price)}
                    </span>
                  </label>
                ))}
              </div>
              {errors.productIds && (
                <span className="error">
                  {errors.productIds.message as string}
                </span>
              )}
            </div>
          </>
        );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="entity-form">
      {renderFields()}
      <div className="form-actions">
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
        <button type="submit" className="btn-primary">
          {isEditing ? "Update" : "Create"}
        </button>
      </div>
    </form>
  );
}
