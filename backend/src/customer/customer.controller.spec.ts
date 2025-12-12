import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import request from 'supertest';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { Customer } from './entities/customer.entity';
import { getTestDatabaseConfig, startTestDatabase, stopTestDatabase } from '../test-utils/test-db.config';

describe('CustomerController (Integration)', () => {
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
        TypeOrmModule.forFeature([Customer]),
      ],
      controllers: [CustomerController],
      providers: [CustomerService],
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

  describe('POST /customer', () => {
    it('should create a new customer', async () => {
      const createDto = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      };

      const response = await request(app.getHttpServer())
        .post('/customer')
        .send(createDto)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(createDto.name);
      expect(response.body.email).toBe(createDto.email);
    });

    it('should return 400 when email is invalid', async () => {
      const createDto = {
        name: 'John Doe',
        email: 'invalid-email',
        password: 'password123',
      };

      await request(app.getHttpServer())
        .post('/customer')
        .send(createDto)
        .expect(400);
    });

    it('should return 400 when password is too short', async () => {
      const createDto = {
        name: 'John Doe',
        email: 'john@example.com',
        password: '12345',
      };

      await request(app.getHttpServer())
        .post('/customer')
        .send(createDto)
        .expect(400);
    });

    it('should return 400 when name is missing', async () => {
      const createDto = {
        email: 'john@example.com',
        password: 'password123',
      };

      await request(app.getHttpServer())
        .post('/customer')
        .send(createDto)
        .expect(400);
    });
  });

  describe('GET /customer', () => {
    it('should return an empty array when no customers exist', async () => {
      const response = await request(app.getHttpServer())
        .get('/customer')
        .expect(200);

      expect(response.body).toEqual([]);
    });

    it('should return all customers', async () => {
      await request(app.getHttpServer()).post('/customer').send({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      });

      await request(app.getHttpServer()).post('/customer').send({
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: 'password456',
      });

      const response = await request(app.getHttpServer())
        .get('/customer')
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body[0].name).toBe('Jane Doe');
      expect(response.body[1].name).toBe('John Doe');
    });
  });

  describe('GET /customer/:id', () => {
    it('should return a customer by id', async () => {
      const createResponse = await request(app.getHttpServer())
        .post('/customer')
        .send({
          name: 'John Doe',
          email: 'john@example.com',
          password: 'password123',
        });

      const response = await request(app.getHttpServer())
        .get(`/customer/${createResponse.body.id}`)
        .expect(200);

      expect(response.body.id).toBe(createResponse.body.id);
      expect(response.body.name).toBe('John Doe');
    });

    it('should return 404 when customer does not exist', async () => {
      await request(app.getHttpServer())
        .get('/customer/00000000-0000-0000-0000-000000000000')
        .expect(404);
    });
  });

  describe('PATCH /customer/:id', () => {
    it('should update a customer', async () => {
      const createResponse = await request(app.getHttpServer())
        .post('/customer')
        .send({
          name: 'John Doe',
          email: 'john@example.com',
          password: 'password123',
        });

      const updateDto = {
        name: 'John Updated',
        email: 'john.updated@example.com',
      };

      const response = await request(app.getHttpServer())
        .patch(`/customer/${createResponse.body.id}`)
        .send(updateDto)
        .expect(200);

      expect(response.body.name).toBe(updateDto.name);
      expect(response.body.email).toBe(updateDto.email);
    });

    it('should partially update a customer', async () => {
      const createResponse = await request(app.getHttpServer())
        .post('/customer')
        .send({
          name: 'John Doe',
          email: 'john@example.com',
          password: 'password123',
        });

      const response = await request(app.getHttpServer())
        .patch(`/customer/${createResponse.body.id}`)
        .send({ name: 'John Updated' })
        .expect(200);

      expect(response.body.name).toBe('John Updated');
      expect(response.body.email).toBe('john@example.com');
    });

    it('should return 404 when updating non-existent customer', async () => {
      await request(app.getHttpServer())
        .patch('/customer/00000000-0000-0000-0000-000000000000')
        .send({ name: 'Updated' })
        .expect(404);
    });
  });

  describe('DELETE /customer/:id', () => {
    it('should delete a customer', async () => {
      const createResponse = await request(app.getHttpServer())
        .post('/customer')
        .send({
          name: 'John Doe',
          email: 'john@example.com',
          password: 'password123',
        });

      await request(app.getHttpServer())
        .delete(`/customer/${createResponse.body.id}`)
        .expect(200);

      await request(app.getHttpServer())
        .get(`/customer/${createResponse.body.id}`)
        .expect(404);
    });

    it('should return 404 when deleting non-existent customer', async () => {
      await request(app.getHttpServer())
        .delete('/customer/00000000-0000-0000-0000-000000000000')
        .expect(404);
    });
  });
});
