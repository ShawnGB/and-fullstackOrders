import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { Customer } from './entities/customer.entity';
import { getTestDatabaseConfig, cleanupDatabase } from '../test-utils/test-db.config';
import * as bcrypt from 'bcrypt';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

describe('CustomerService', () => {
  let service: CustomerService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(getTestDatabaseConfig()),
        TypeOrmModule.forFeature([Customer]),
      ],
      providers: [CustomerService],
    }).compile();

    service = module.get<CustomerService>(CustomerService);
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
    it('should create a new customer', async () => {
      const createCustomerDto: CreateCustomerDto = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      };

      const customer = await service.create(createCustomerDto);

      expect(customer).toBeDefined();
      expect(customer.id).toBeDefined();
      expect(customer.name).toBe(createCustomerDto.name);
      expect(customer.email).toBe(createCustomerDto.email);
      expect(customer.password).not.toBe(createCustomerDto.password);
      const isPasswordValid = await bcrypt.compare(
        createCustomerDto.password,
        customer.password,
      );
      expect(isPasswordValid).toBe(true);
    });

    it('should create multiple customers with unique emails', async () => {
      const customer1 = await service.create({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      });

      const customer2 = await service.create({
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: 'password456',
      });

      expect(customer1.email).not.toBe(customer2.email);
      expect(customer1.id).not.toBe(customer2.id);
    });
  });

  describe('findAll', () => {
    it('should return an empty array when no customers exist', async () => {
      const customers = await service.findAll();
      expect(customers).toEqual([]);
    });

    it('should return all customers', async () => {
      await service.create({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      });

      await service.create({
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: 'password456',
      });

      const customers = await service.findAll();
      expect(customers).toHaveLength(2);
      expect(customers[0].name).toBe('Jane Doe');
      expect(customers[1].name).toBe('John Doe');
    });
  });

  describe('findOne', () => {
    it('should return a customer by id', async () => {
      const created = await service.create({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      });

      const found = await service.findOne(created.id);
      expect(found).toBeDefined();
      expect(found.id).toBe(created.id);
      expect(found.name).toBe(created.name);
      expect(found.email).toBe(created.email);
    });

    it('should throw NotFoundException when customer does not exist', async () => {
      await expect(
        service.findOne('00000000-0000-0000-0000-000000000000'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a customer', async () => {
      const created = await service.create({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      });

      const updateDto: UpdateCustomerDto = {
        name: 'John Updated',
        email: 'john.updated@example.com',
      };

      const updated = await service.update(created.id, updateDto);
      expect(updated.name).toBe(updateDto.name);
      expect(updated.email).toBe(updateDto.email);
      expect(updated.password).toBe(created.password); // password unchanged
    });

    it('should partially update a customer', async () => {
      const created = await service.create({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      });

      const updateDto: UpdateCustomerDto = {
        name: 'John Updated',
      };

      const updated = await service.update(created.id, updateDto);
      expect(updated.name).toBe(updateDto.name);
      expect(updated.email).toBe(created.email); // email unchanged
    });

    it('should throw NotFoundException when updating non-existent customer', async () => {
      await expect(
        service.update('00000000-0000-0000-0000-000000000000', {
          name: 'Updated',
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a customer', async () => {
      const created = await service.create({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      });

      await service.remove(created.id);

      await expect(service.findOne(created.id)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException when removing non-existent customer', async () => {
      await expect(
        service.remove('00000000-0000-0000-0000-000000000000'),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
