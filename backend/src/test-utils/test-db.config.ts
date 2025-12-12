import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { Customer } from '../customer/entities/customer.entity';
import { Order } from '../order/entities/order.entity';
import { Product } from '../product/entities/product.entity';

let postgresContainer: StartedPostgreSqlContainer;

export const startTestDatabase = async (): Promise<void> => {
  if (!postgresContainer) {
    postgresContainer = await new PostgreSqlContainer('postgres:16-alpine')
      .withExposedPorts(5432)
      .start();
  }
};

export const stopTestDatabase = async (): Promise<void> => {
  if (postgresContainer) {
    await postgresContainer.stop();
    postgresContainer = undefined;
  }
};

export const getTestDatabaseConfig = (): TypeOrmModuleOptions => {
  if (!postgresContainer) {
    throw new Error('Test database not started. Call startTestDatabase() first.');
  }

  return {
    type: 'postgres',
    host: postgresContainer.getHost(),
    port: postgresContainer.getPort(),
    username: postgresContainer.getUsername(),
    password: postgresContainer.getPassword(),
    database: postgresContainer.getDatabase(),
    entities: [Customer, Order, Product],
    synchronize: true,
    dropSchema: true,
    logging: false,
  };
};
