// Set test timeout for Testcontainers
jest.setTimeout(60000);

// Set Testcontainers environment variables
process.env.TESTCONTAINERS_RYUK_DISABLED = 'true';
