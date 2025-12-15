import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import request from 'supertest';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { Order } from './entities/order.entity';
import { Product } from '../product/entities/product.entity';
import { Customer } from '../customer/entities/customer.entity';
import { CustomerController } from '../customer/customer.controller';
import { CustomerService } from '../customer/customer.service';
import { ProductController } from '../product/product.controller';
import { ProductService } from '../product/product.service';
import { getTestDatabaseConfig, startTestDatabase, stopTestDatabase } from '../test-utils/test-db.config';

describe('OrderController (Integration)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    await startTestDatabase();
  }, 60000);

  afterAll(async () => {
    await stopTestDatabase();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(getTestDatabaseConfig()),
        TypeOrmModule.forFeature([Order, Product, Customer]),
      ],
      controllers: [OrderController, CustomerController, ProductController],
      providers: [OrderService, CustomerService, ProductService],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('POST /order', () => {
    it('should create a new order with products', async () => {
      const customerResponse = await request(app.getHttpServer())
        .post('/customer')
        .send({
          name: 'John Doe',
          email: 'john@example.com',
          password: 'password123',
        });

      const product1Response = await request(app.getHttpServer())
        .post('/product')
        .send({
          name: 'Laptop',
          description: 'High-performance laptop',
          price: 999.99,
        });

      const product2Response = await request(app.getHttpServer())
        .post('/product')
        .send({
          name: 'Mouse',
          description: 'Wireless mouse',
          price: 29.99,
        });

      const createDto = {
        customerId: customerResponse.body.id,
        productIds: [product1Response.body.id, product2Response.body.id],
      };

      const response = await request(app.getHttpServer())
        .post('/order')
        .send(createDto)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.customer).toBeDefined();
      expect(response.body.customer.id).toBe(createDto.customerId);
      expect(response.body.products).toHaveLength(2);
      expect(Number(response.body.totalPrice)).toBe(1029.98);
    });

    it('should return 400 when customerId is not a UUID', async () => {
      const productResponse = await request(app.getHttpServer())
        .post('/product')
        .send({
          name: 'Laptop',
          description: 'High-performance laptop',
          price: 999.99,
        });

      const createDto = {
        customerId: 'invalid-uuid',
        productIds: [productResponse.body.id],
      };

      await request(app.getHttpServer())
        .post('/order')
        .send(createDto)
        .expect(400);
    });

    it('should return 404 when product does not exist', async () => {
      const customerResponse = await request(app.getHttpServer())
        .post('/customer')
        .send({
          name: 'John Doe',
          email: 'john@example.com',
          password: 'password123',
        });

      const createDto = {
        customerId: customerResponse.body.id,
        productIds: ['00000000-0000-0000-0000-000000000000'],
      };

      await request(app.getHttpServer())
        .post('/order')
        .send(createDto)
        .expect(400);
    });

    it('should return 400 when productIds is empty', async () => {
      const customerResponse = await request(app.getHttpServer())
        .post('/customer')
        .send({
          name: 'John Doe',
          email: 'john@example.com',
          password: 'password123',
        });

      const createDto = {
        customerId: customerResponse.body.id,
        productIds: [],
      };

      await request(app.getHttpServer())
        .post('/order')
        .send(createDto)
        .expect(400);
    });
  });

  describe('GET /order', () => {
    it('should return an empty array when no orders exist', async () => {
      const response = await request(app.getHttpServer())
        .get('/order')
        .expect(200);

      expect(response.body).toEqual([]);
    });

    it('should return all orders with relations', async () => {
      const customerResponse = await request(app.getHttpServer())
        .post('/customer')
        .send({
          name: 'John Doe',
          email: 'john@example.com',
          password: 'password123',
        });

      const productResponse = await request(app.getHttpServer())
        .post('/product')
        .send({
          name: 'Laptop',
          description: 'High-performance laptop',
          price: 999.99,
        });

      await request(app.getHttpServer())
        .post('/order')
        .send({
          customerId: customerResponse.body.id,
          productIds: [productResponse.body.id],
        });

      const response = await request(app.getHttpServer())
        .get('/order')
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].customer).toBeDefined();
      expect(response.body[0].products).toBeDefined();
      expect(response.body[0].customer.id).toBe(customerResponse.body.id);
    });
  });

  describe('GET /order/:id', () => {
    it('should return an order by id with relations', async () => {
      const customerResponse = await request(app.getHttpServer())
        .post('/customer')
        .send({
          name: 'John Doe',
          email: 'john@example.com',
          password: 'password123',
        });

      const productResponse = await request(app.getHttpServer())
        .post('/product')
        .send({
          name: 'Laptop',
          description: 'High-performance laptop',
          price: 999.99,
        });

      const orderResponse = await request(app.getHttpServer())
        .post('/order')
        .send({
          customerId: customerResponse.body.id,
          productIds: [productResponse.body.id],
        });

      const response = await request(app.getHttpServer())
        .get(`/order/${orderResponse.body.id}`)
        .expect(200);

      expect(response.body.id).toBe(orderResponse.body.id);
      expect(response.body.customer).toBeDefined();
      expect(response.body.products).toBeDefined();
      expect(response.body.products).toHaveLength(1);
    });

    it('should return 404 when order does not exist', async () => {
      await request(app.getHttpServer())
        .get('/order/00000000-0000-0000-0000-000000000000')
        .expect(404);
    });
  });

  describe('PATCH /order/:id', () => {
    it('should update an order and recalculate total price', async () => {
      const customerResponse = await request(app.getHttpServer())
        .post('/customer')
        .send({
          name: 'John Doe',
          email: 'john@example.com',
          password: 'password123',
        });

      const product1Response = await request(app.getHttpServer())
        .post('/product')
        .send({
          name: 'Laptop',
          description: 'High-performance laptop',
          price: 999.99,
        });

      const product2Response = await request(app.getHttpServer())
        .post('/product')
        .send({
          name: 'Mouse',
          description: 'Wireless mouse',
          price: 29.99,
        });

      const orderResponse = await request(app.getHttpServer())
        .post('/order')
        .send({
          customerId: customerResponse.body.id,
          productIds: [product1Response.body.id],
        });

      const updateDto = {
        productIds: [product1Response.body.id, product2Response.body.id],
      };

      const response = await request(app.getHttpServer())
        .patch(`/order/${orderResponse.body.id}`)
        .send(updateDto)
        .expect(200);

      expect(response.body.products).toHaveLength(2);
      expect(Number(response.body.totalPrice)).toBe(1029.98);
    });

    it('should return 400 when trying to update with empty body', async () => {
      const customerResponse = await request(app.getHttpServer())
        .post('/customer')
        .send({
          name: 'John Doe',
          email: 'john@example.com',
          password: 'password123',
        });

      const productResponse = await request(app.getHttpServer())
        .post('/product')
        .send({
          name: 'Laptop',
          description: 'High-performance laptop',
          price: 999.99,
        });

      const orderResponse = await request(app.getHttpServer())
        .post('/order')
        .send({
          customerId: customerResponse.body.id,
          productIds: [productResponse.body.id],
        });

      const response = await request(app.getHttpServer())
        .patch(`/order/${orderResponse.body.id}`)
        .send({})
        .expect(200);

      expect(Number(response.body.totalPrice)).toBe(999.99);
      expect(response.body.products).toHaveLength(1);
    });

    it('should return 404 when updating with non-existent product', async () => {
      const customerResponse = await request(app.getHttpServer())
        .post('/customer')
        .send({
          name: 'John Doe',
          email: 'john@example.com',
          password: 'password123',
        });

      const productResponse = await request(app.getHttpServer())
        .post('/product')
        .send({
          name: 'Laptop',
          description: 'High-performance laptop',
          price: 999.99,
        });

      const orderResponse = await request(app.getHttpServer())
        .post('/order')
        .send({
          customerId: customerResponse.body.id,
          productIds: [productResponse.body.id],
        });

      await request(app.getHttpServer())
        .patch(`/order/${orderResponse.body.id}`)
        .send({ productIds: ['00000000-0000-0000-0000-000000000000'] })
        .expect(400);
    });

    it('should return 404 when updating non-existent order', async () => {
      await request(app.getHttpServer())
        .patch('/order/00000000-0000-0000-0000-000000000000')
        .send({ productIds: [] })
        .expect(404);
    });
  });

  describe('DELETE /order/:id', () => {
    it('should delete an order', async () => {
      const customerResponse = await request(app.getHttpServer())
        .post('/customer')
        .send({
          name: 'John Doe',
          email: 'john@example.com',
          password: 'password123',
        });

      const productResponse = await request(app.getHttpServer())
        .post('/product')
        .send({
          name: 'Laptop',
          description: 'High-performance laptop',
          price: 999.99,
        });

      const orderResponse = await request(app.getHttpServer())
        .post('/order')
        .send({
          customerId: customerResponse.body.id,
          productIds: [productResponse.body.id],
        });

      await request(app.getHttpServer())
        .delete(`/order/${orderResponse.body.id}`)
        .expect(200);

      await request(app.getHttpServer())
        .get(`/order/${orderResponse.body.id}`)
        .expect(404);
    });

    it('should return 404 when deleting non-existent order', async () => {
      await request(app.getHttpServer())
        .delete('/order/00000000-0000-0000-0000-000000000000')
        .expect(404);
    });
  });
});
