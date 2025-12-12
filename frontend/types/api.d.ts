type BaseEntity = {
  id: string;
  createdAt: string;
  updatedAt: string;
};

export interface Product extends BaseEntity {
  name: string;
  description: string;
  price: number;
}

export interface Customer extends BaseEntity {
  name: string;
  email: string;
  orders?: Order[];
}

export interface Order extends BaseEntity {
  orderNumber: number;
  customer: Customer;
  products: Product[];
  totalPrice: number;
}

export type CreateProduct = Omit<Product, keyof BaseEntity>;
export type UpdateProduct = Partial<CreateProduct>;

export type CreateCustomer = Omit<Customer, keyof BaseEntity | 'orders'> & {
  password: string;
};
export type UpdateCustomer = Partial<CreateCustomer>;

export type CreateOrder = {
  customerId: string;
  productIds: string[];
  totalPrice: number;
};
export type UpdateOrder = {
  productIds?: string[];
};
