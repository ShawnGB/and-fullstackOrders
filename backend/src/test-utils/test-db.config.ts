import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Customer } from '../customer/entities/customer.entity';
import { Order } from '../order/entities/order.entity';
import { Product } from '../product/entities/product.entity';

let dataSource: DataSource | undefined;

export const getTestDatabaseConfig = (): TypeOrmModuleOptions => {
  if (!process.env.TEST_DB_HOST) {
    throw new Error('Test database not configured. Environment variables missing.');
  }

  return {
    type: 'postgres',
    host: process.env.TEST_DB_HOST,
    port: parseInt(process.env.TEST_DB_PORT || '5432'),
    username: process.env.TEST_DB_USERNAME,
    password: process.env.TEST_DB_PASSWORD,
    database: process.env.TEST_DB_DATABASE,
    entities: [Customer, Order, Product],
    synchronize: true,
    logging: false,
  };
};

export const getDataSource = async (): Promise<DataSource> => {
  if (!dataSource) {
    dataSource = new DataSource({
      ...getTestDatabaseConfig(),
      entities: [Customer, Order, Product],
    } as any);
    await dataSource.initialize();
  }
  return dataSource;
};

export const cleanupDatabase = async (): Promise<void> => {
  const ds = await getDataSource();
  const entities = ds.entityMetadatas;

  // Disable foreign key checks temporarily and truncate tables
  const queryRunner = ds.createQueryRunner();
  try {
    await queryRunner.query('SET session_replication_role = replica;');

    for (const entity of entities) {
      const tableName = entity.tableName;
      await queryRunner.query(`TRUNCATE TABLE "${tableName}" CASCADE;`);
    }

    await queryRunner.query('SET session_replication_role = DEFAULT;');
  } finally {
    await queryRunner.release();
  }
};

export const closeDataSource = async (): Promise<void> => {
  if (dataSource && dataSource.isInitialized) {
    await dataSource.destroy();
    dataSource = undefined;
  }
};
