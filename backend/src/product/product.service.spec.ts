import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from './entities/product.entity';
import { Order } from '../order/entities/order.entity';
import { Customer } from '../customer/entities/customer.entity';
import { getTestDatabaseConfig, cleanupDatabase } from '../test-utils/test-db.config';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

describe('ProductService', () => {
  let service: ProductService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(getTestDatabaseConfig()),
        TypeOrmModule.forFeature([Product, Order, Customer]),
      ],
      providers: [ProductService],
    }).compile();

    service = module.get<ProductService>(ProductService);
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
    it('should create a new product', async () => {
      const createProductDto: CreateProductDto = {
        name: 'Laptop',
        description: 'High-performance laptop',
        price: 999.99,
      };

      const product = await service.create(createProductDto);

      expect(product).toBeDefined();
      expect(product.id).toBeDefined();
      expect(product.name).toBe(createProductDto.name);
      expect(product.description).toBe(createProductDto.description);
      expect(Number(product.price)).toBe(createProductDto.price);
    });

    it('should create multiple products', async () => {
      const product1 = await service.create({
        name: 'Laptop',
        description: 'High-performance laptop',
        price: 999.99,
      });

      const product2 = await service.create({
        name: 'Mouse',
        description: 'Wireless mouse',
        price: 29.99,
      });

      expect(product1.id).not.toBe(product2.id);
      expect(product1.name).not.toBe(product2.name);
    });
  });

  describe('findAll', () => {
    it('should return an empty array when no products exist', async () => {
      const products = await service.findAll();
      expect(products).toEqual([]);
    });

    it('should return all products', async () => {
      await service.create({
        name: 'Laptop',
        description: 'High-performance laptop',
        price: 999.99,
      });

      await service.create({
        name: 'Mouse',
        description: 'Wireless mouse',
        price: 29.99,
      });

      const products = await service.findAll();
      expect(products).toHaveLength(2);
      expect(products[0].name).toBe('Laptop');
      expect(products[1].name).toBe('Mouse');
    });
  });

  describe('findOne', () => {
    it('should return a product by id', async () => {
      const created = await service.create({
        name: 'Laptop',
        description: 'High-performance laptop',
        price: 999.99,
      });

      const found = await service.findOne(created.id);
      expect(found).toBeDefined();
      expect(found.id).toBe(created.id);
      expect(found.name).toBe(created.name);
      expect(found.description).toBe(created.description);
    });

    it('should throw NotFoundException when product does not exist', async () => {
      await expect(
        service.findOne('00000000-0000-0000-0000-000000000000'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      const created = await service.create({
        name: 'Laptop',
        description: 'High-performance laptop',
        price: 999.99,
      });

      const updateDto: UpdateProductDto = {
        name: 'Gaming Laptop',
        description: 'High-performance gaming laptop',
        price: 1299.99,
      };

      const updated = await service.update(created.id, updateDto);
      expect(updated.name).toBe(updateDto.name);
      expect(updated.description).toBe(updateDto.description);
      expect(Number(updated.price)).toBe(updateDto.price);
    });

    it('should partially update a product', async () => {
      const created = await service.create({
        name: 'Laptop',
        description: 'High-performance laptop',
        price: 999.99,
      });

      const updateDto: UpdateProductDto = {
        price: 899.99,
      };

      const updated = await service.update(created.id, updateDto);
      expect(updated.name).toBe(created.name);
      expect(updated.description).toBe(created.description);
      expect(Number(updated.price)).toBe(updateDto.price);
    });

    it('should throw NotFoundException when updating non-existent product', async () => {
      await expect(
        service.update('00000000-0000-0000-0000-000000000000', {
          name: 'Updated',
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a product', async () => {
      const created = await service.create({
        name: 'Laptop',
        description: 'High-performance laptop',
        price: 999.99,
      });

      await service.remove(created.id);

      await expect(service.findOne(created.id)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException when removing non-existent product', async () => {
      await expect(
        service.remove('00000000-0000-0000-0000-000000000000'),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
