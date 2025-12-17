export default async function globalTeardown() {
  const container = (global as any).__POSTGRES_CONTAINER__;

  if (container) {
    await container.stop();
    console.log('Test database container stopped');
  }
}
