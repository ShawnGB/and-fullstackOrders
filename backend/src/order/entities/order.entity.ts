import { Customer } from 'src/customer/entities/customer.entity';
import { Product } from 'src/product/entities/product.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ generated: 'increment' })
  orderNumber: number;

  @ManyToOne(() => Customer, (customer) => customer.orders)
  customer: Customer;

  @Column()
  customerId: string;

  @ManyToMany(() => Product)
  @JoinTable()
  products: Product[];

  @Column('decimal', { precision: 10, scale: 2 })
  totalPrice: number;
}
