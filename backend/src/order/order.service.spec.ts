import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { OrderService } from './order.service';
import { Order } from './entities/order.entity';
import { Product } from '../product/entities/product.entity';
import { Customer } from '../customer/entities/customer.entity';
import { getTestDatabaseConfig, cleanupDatabase } from '../test-utils/test-db.config';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('OrderService', () => {
  let service: OrderService;
  let module: TestingModule;
  let customerRepository: Repository<Customer>;
  let productRepository: Repository<Product>;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(getTestDatabaseConfig()),
        TypeOrmModule.forFeature([Order, Product, Customer]),
      ],
      providers: [OrderService],
    }).compile();

    service = module.get<OrderService>(OrderService);
    customerRepository = module.get<Repository<Customer>>(
      getRepositoryToken(Customer),
    );
    productRepository = module.get<Repository<Product>>(
      getRepositoryToken(Product),
    );
  });

  afterAll(async () => {
    if (module) {
      await module.close();
    }
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new order with products', async () => {
      const customer = await customerRepository.save({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      });

      const product1 = await productRepository.save({
        name: 'Laptop',
        description: 'High-performance laptop',
        price: 999.99,
      });

      const product2 = await productRepository.save({
        name: 'Mouse',
        description: 'Wireless mouse',
        price: 29.99,
      });

      const createOrderDto: CreateOrderDto = {
        customerId: customer.id,
        productIds: [product1.id, product2.id],
        totalPrice: 1029.98,
      };

      const order = await service.create(createOrderDto);

      expect(order).toBeDefined();
      expect(order.id).toBeDefined();
      expect(order.customer).toBeDefined();
      expect(order.customer.id).toBe(customer.id);
      expect(order.products).toHaveLength(2);
      expect(Number(order.totalPrice)).toBe(createOrderDto.totalPrice);
    });

    it('should throw NotFoundException when product does not exist', async () => {
      const customer = await customerRepository.save({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      });

      const createOrderDto: CreateOrderDto = {
        customerId: customer.id,
        productIds: ['00000000-0000-0000-0000-000000000000'],
        totalPrice: 100,
      };

      await expect(service.create(createOrderDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should create an order with a single product', async () => {
      const customer = await customerRepository.save({
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: 'password456',
      });

      const product = await productRepository.save({
        name: 'Keyboard',
        description: 'Mechanical keyboard',
        price: 149.99,
      });

      const createOrderDto: CreateOrderDto = {
        customerId: customer.id,
        productIds: [product.id],
        totalPrice: 149.99,
      };

      const order = await service.create(createOrderDto);

      expect(order.products).toHaveLength(1);
      expect(order.products[0].id).toBe(product.id);
    });
  });

  describe('findAll', () => {
    it('should return an empty array when no orders exist', async () => {
      const orders = await service.findAll();
      expect(orders).toEqual([]);
    });

    it('should return all orders with relations', async () => {
      const customer = await customerRepository.save({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      });

      const product = await productRepository.save({
        name: 'Laptop',
        description: 'High-performance laptop',
        price: 999.99,
      });

      await service.create({
        customerId: customer.id,
        productIds: [product.id],
        totalPrice: 999.99,
      });

      const orders = await service.findAll();
      expect(orders).toHaveLength(1);
      expect(orders[0].customer).toBeDefined();
      expect(orders[0].products).toBeDefined();
      expect(orders[0].customer.id).toBe(customer.id);
    });
  });

  describe('findOne', () => {
    it('should return an order by id with relations', async () => {
      const customer = await customerRepository.save({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      });

      const product = await productRepository.save({
        name: 'Laptop',
        description: 'High-performance laptop',
        price: 999.99,
      });

      const created = await service.create({
        customerId: customer.id,
        productIds: [product.id],
        totalPrice: 999.99,
      });

      const found = await service.findOne(created.id);
      expect(found).toBeDefined();
      expect(found.id).toBe(created.id);
      expect(found.customer).toBeDefined();
      expect(found.products).toBeDefined();
      expect(found.products).toHaveLength(1);
    });

    it('should throw NotFoundException when order does not exist', async () => {
      await expect(
        service.findOne('00000000-0000-0000-0000-000000000000'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update an order and recalculate total price', async () => {
      const customer = await customerRepository.save({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      });

      const product1 = await productRepository.save({
        name: 'Laptop',
        description: 'High-performance laptop',
        price: 999.99,
      });

      const product2 = await productRepository.save({
        name: 'Mouse',
        description: 'Wireless mouse',
        price: 29.99,
      });

      const created = await service.create({
        customerId: customer.id,
        productIds: [product1.id],
        totalPrice: 999.99,
      });

      const updateDto: UpdateOrderDto = {
        productIds: [product1.id, product2.id],
      };

      const updated = await service.update(created.id, updateDto);
      expect(updated.products).toHaveLength(2);
      expect(Number(updated.totalPrice)).toBe(1029.98);
    });

    it('should return order unchanged when updating with empty DTO', async () => {
      const customer = await customerRepository.save({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      });

      const product = await productRepository.save({
        name: 'Laptop',
        description: 'High-performance laptop',
        price: 999.99,
      });

      const created = await service.create({
        customerId: customer.id,
        productIds: [product.id],
        totalPrice: 999.99,
      });

      const updateDto: UpdateOrderDto = {};

      const updated = await service.update(created.id, updateDto);
      expect(Number(updated.totalPrice)).toBe(999.99);
      expect(updated.products).toHaveLength(1);
    });

    it('should throw NotFoundException when updating with non-existent product', async () => {
      const customer = await customerRepository.save({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      });

      const product = await productRepository.save({
        name: 'Laptop',
        description: 'High-performance laptop',
        price: 999.99,
      });

      const created = await service.create({
        customerId: customer.id,
        productIds: [product.id],
        totalPrice: 999.99,
      });

      await expect(
        service.update(created.id, {
          productIds: ['00000000-0000-0000-0000-000000000000'],
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when updating non-existent order', async () => {
      await expect(
        service.update('00000000-0000-0000-0000-000000000000', {
          totalPrice: 100,
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove an order', async () => {
      const customer = await customerRepository.save({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      });

      const product = await productRepository.save({
        name: 'Laptop',
        description: 'High-performance laptop',
        price: 999.99,
      });

      const created = await service.create({
        customerId: customer.id,
        productIds: [product.id],
        totalPrice: 999.99,
      });

      await service.remove(created.id);

      await expect(service.findOne(created.id)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException when removing non-existent order', async () => {
      await expect(
        service.remove('00000000-0000-0000-0000-000000000000'),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
