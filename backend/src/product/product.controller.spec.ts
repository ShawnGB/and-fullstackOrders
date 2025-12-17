import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import request from 'supertest';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { Product } from './entities/product.entity';
import { Order } from '../order/entities/order.entity';
import { Customer } from '../customer/entities/customer.entity';
import { getTestDatabaseConfig, cleanupDatabase } from '../test-utils/test-db.config';

describe('ProductController (Integration)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(getTestDatabaseConfig()),
        TypeOrmModule.forFeature([Product, Order, Customer]),
      ],
      controllers: [ProductController],
      providers: [ProductService],
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

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  describe('POST /product', () => {
    it('should create a new product', async () => {
      const createDto = {
        name: 'Laptop',
        description: 'High-performance laptop',
        price: 999.99,
      };

      const response = await request(app.getHttpServer())
        .post('/product')
        .send(createDto)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(createDto.name);
      expect(response.body.description).toBe(createDto.description);
      expect(Number(response.body.price)).toBe(createDto.price);
    });

    it('should return 400 when name is missing', async () => {
      const createDto = {
        description: 'High-performance laptop',
        price: 999.99,
      };

      await request(app.getHttpServer())
        .post('/product')
        .send(createDto)
        .expect(400);
    });

    it('should return 400 when price is negative', async () => {
      const createDto = {
        name: 'Laptop',
        description: 'High-performance laptop',
        price: -100,
      };

      await request(app.getHttpServer())
        .post('/product')
        .send(createDto)
        .expect(400);
    });

    it('should return 400 when description is missing', async () => {
      const createDto = {
        name: 'Laptop',
        price: 999.99,
      };

      await request(app.getHttpServer())
        .post('/product')
        .send(createDto)
        .expect(400);
    });
  });

  describe('GET /product', () => {
    it('should return an empty array when no products exist', async () => {
      const response = await request(app.getHttpServer())
        .get('/product')
        .expect(200);

      expect(response.body).toEqual([]);
    });

    it('should return all products', async () => {
      await request(app.getHttpServer()).post('/product').send({
        name: 'Laptop',
        description: 'High-performance laptop',
        price: 999.99,
      });

      await request(app.getHttpServer()).post('/product').send({
        name: 'Mouse',
        description: 'Wireless mouse',
        price: 29.99,
      });

      const response = await request(app.getHttpServer())
        .get('/product')
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body[0].name).toBe('Laptop');
      expect(response.body[1].name).toBe('Mouse');
    });
  });

  describe('GET /product/:id', () => {
    it('should return a product by id', async () => {
      const createResponse = await request(app.getHttpServer())
        .post('/product')
        .send({
          name: 'Laptop',
          description: 'High-performance laptop',
          price: 999.99,
        });

      const response = await request(app.getHttpServer())
        .get(`/product/${createResponse.body.id}`)
        .expect(200);

      expect(response.body.id).toBe(createResponse.body.id);
      expect(response.body.name).toBe('Laptop');
    });

    it('should return 404 when product does not exist', async () => {
      await request(app.getHttpServer())
        .get('/product/00000000-0000-0000-0000-000000000000')
        .expect(404);
    });
  });

  describe('PATCH /product/:id', () => {
    it('should update a product', async () => {
      const createResponse = await request(app.getHttpServer())
        .post('/product')
        .send({
          name: 'Laptop',
          description: 'High-performance laptop',
          price: 999.99,
        });

      const updateDto = {
        name: 'Gaming Laptop',
        description: 'High-performance gaming laptop',
        price: 1299.99,
      };

      const response = await request(app.getHttpServer())
        .patch(`/product/${createResponse.body.id}`)
        .send(updateDto)
        .expect(200);

      expect(response.body.name).toBe(updateDto.name);
      expect(response.body.description).toBe(updateDto.description);
      expect(Number(response.body.price)).toBe(updateDto.price);
    });

    it('should partially update a product', async () => {
      const createResponse = await request(app.getHttpServer())
        .post('/product')
        .send({
          name: 'Laptop',
          description: 'High-performance laptop',
          price: 999.99,
        });

      const response = await request(app.getHttpServer())
        .patch(`/product/${createResponse.body.id}`)
        .send({ price: 899.99 })
        .expect(200);

      expect(response.body.name).toBe('Laptop');
      expect(Number(response.body.price)).toBe(899.99);
    });

    it('should return 404 when updating non-existent product', async () => {
      await request(app.getHttpServer())
        .patch('/product/00000000-0000-0000-0000-000000000000')
        .send({ name: 'Updated' })
        .expect(404);
    });
  });

  describe('DELETE /product/:id', () => {
    it('should delete a product', async () => {
      const createResponse = await request(app.getHttpServer())
        .post('/product')
        .send({
          name: 'Laptop',
          description: 'High-performance laptop',
          price: 999.99,
        });

      await request(app.getHttpServer())
        .delete(`/product/${createResponse.body.id}`)
        .expect(200);

      await request(app.getHttpServer())
        .get(`/product/${createResponse.body.id}`)
        .expect(404);
    });

    it('should return 404 when deleting non-existent product', async () => {
      await request(app.getHttpServer())
        .delete('/product/00000000-0000-0000-0000-000000000000')
        .expect(404);
    });
  });
});
