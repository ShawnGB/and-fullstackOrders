"use client";

import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { clientApiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { formatPrice } from "@/lib/utils/formatters";

interface OrderFormProps {
  onSubmit: (data: CreateOrder) => Promise<boolean>;
  onCancel: () => void;
}

export default function OrderForm({ onSubmit, onCancel }: OrderFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [customersData, productsData] = await Promise.all([
          clientApiClient.get<Customer[]>(API_ENDPOINTS.customers.list),
          clientApiClient.get<Product[]>(API_ENDPOINTS.products.list),
        ]);

        setCustomers(customersData);
        setProducts(productsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleFormSubmit = async (data: any) => {
    const productIds = Array.from(
      document.querySelectorAll<HTMLInputElement>(
        'input[name="productIds"]:checked',
      ),
    ).map((checkbox) => checkbox.value);

    await onSubmit({
      customerId: data.customerId,
      productIds,
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="entity-form">
      <div className="form-group">
        <label htmlFor="customerId">Customer</label>
        <select
          id="customerId"
          {...register("customerId", { required: "Customer is required" })}
        >
          <option value="">Select a customer</option>
          {customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.name} ({customer.email})
            </option>
          ))}
        </select>
        {errors.customerId && (
          <span className="error">{errors.customerId.message as string}</span>
        )}
      </div>

      <div className="form-group">
        <label>Products (select at least one)</label>
        <div className="checkbox-group">
          {products.map((product) => (
            <label key={product.id} className="checkbox-label">
              <input type="checkbox" name="productIds" value={product.id} />
              <span>
                {product.name} - {formatPrice(product.price)}
              </span>
            </label>
          ))}
        </div>
        {products.length === 0 && (
          <span className="error">
            No products available. Create products first.
          </span>
        )}
      </div>

      <div className="form-actions">
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
        <button type="submit" className="btn-primary">
          Create Order
        </button>
      </div>
    </form>
  );
}
