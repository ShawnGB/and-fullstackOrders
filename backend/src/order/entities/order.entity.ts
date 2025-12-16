import { Customer } from 'src/customer/entities/customer.entity';
import { Product } from 'src/product/entities/product.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ generated: 'increment' })
  orderNumber: number;

  @ManyToOne(() => Customer, (customer) => customer.orders, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'customerId' })
  customer: Customer;

  @ManyToMany(() => Product)
  @JoinTable()
  products: Product[];

  @Column('decimal', { precision: 10, scale: 2 })
  totalPrice: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
