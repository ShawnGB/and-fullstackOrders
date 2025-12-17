import { PostgreSqlContainer } from '@testcontainers/postgresql';

export default async function globalSetup() {
  const container = await new PostgreSqlContainer('postgres:16-alpine')
    .withExposedPorts(5432)
    .start();

  // Store connection details in global variables
  (global as any).__POSTGRES_CONTAINER__ = container;
  process.env.TEST_DB_HOST = container.getHost();
  process.env.TEST_DB_PORT = container.getPort().toString();
  process.env.TEST_DB_USERNAME = container.getUsername();
  process.env.TEST_DB_PASSWORD = container.getPassword();
  process.env.TEST_DB_DATABASE = container.getDatabase();

  console.log('Test database container started');
}
