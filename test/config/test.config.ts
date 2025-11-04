import { Config } from '../../src/config/config';

/**
 * Test-specific configuration that overrides default config for testing
 */
export const testConfig = (): Config => ({
  app: {
    NODE_ENV: 'test',
    PORT: 0, // Use random port for tests
  },
  database: {
    DB_HOST: process.env.TEST_DB_HOST || process.env.DB_HOST || 'localhost',
    DB_PORT: parseInt(
      process.env.TEST_DB_PORT || process.env.DB_PORT || '5432',
      10,
    ),
    DB_USER: process.env.TEST_DB_USER || process.env.DB_USER!,
    DB_PASSWORD: process.env.TEST_DB_PASSWORD || process.env.DB_PASSWORD!,
    DB_NAME:
      process.env.TEST_DB_NAME ||
      `${process.env.DB_NAME}_test` ||
      'nestjs_db_test',
  },
});
