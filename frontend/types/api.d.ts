interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

interface Product extends BaseEntity {
  name: string;
  description: string;
  price: number;
}

interface Customer extends BaseEntity {
  name: string;
  email: string;
  orders?: Order[];
}

interface Order extends BaseEntity {
  orderNumber: number;
  customer: Customer;
  products: Product[];
  totalPrice: number;
}

type CreateProduct = Omit<Product, keyof BaseEntity>;
type UpdateProduct = Partial<CreateProduct>;

type CreateCustomer = Omit<Customer, keyof BaseEntity | "orders"> & {
  password: string;
};
type UpdateCustomer = Partial<CreateCustomer>;

interface CreateOrder {
  customerId: string;
  productIds: string[];
}

interface UpdateOrder {
  productIds?: string[];
}
