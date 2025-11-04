import request from 'supertest';
import { E2ETestSetup } from '../utils/test-setup';
import { SchoolService } from '../../src/services/school.service';
import { describe, beforeAll, afterAll, beforeEach, it, expect } from 'vitest';

describe('E2E Test Setup Examples', () => {
  describe('Full AppModule (Default E2E)', () => {
    let testSetup: E2ETestSetup;

    beforeAll(async () => {
      // Simple E2E setup with full AppModule
      testSetup = await new E2ETestSetup()
        .withAppModule() // Default behavior, can be omitted
        .setupApp();
    });

    afterAll(async () => {
      await testSetup.teardown();
    });

    beforeEach(async () => {
      await testSetup.cleanup();
    });

    it('should have access to all app functionality', async () => {
      const response = await request(testSetup.serverHttp)
        .get('/schools')
        .expect(200);

      expect(response.body).toEqual([]);
    });
  });

  describe('AppModule with Mocked Service', () => {
    let testSetup: E2ETestSetup;
    const mockSchoolService = {
      findAll: () => Promise.resolve([{ id: 1, name: 'Mock School' }]),
      findById: () => Promise.resolve({ id: 1, name: 'Mock School' }),
      create: () => Promise.resolve({ id: 1, name: 'Mock School' }),
      update: () => Promise.resolve({ id: 1, name: 'Mock School' }),
      delete: () => Promise.resolve(),
    };

    beforeAll(async () => {
      // E2E with mocked service for testing specific scenarios
      testSetup = await new E2ETestSetup()
        .withAppModule()
        .overrideProvider(SchoolService, mockSchoolService)
        .setupApp();
    });

    afterAll(async () => {
      await testSetup.teardown();
    });

    it('should use mocked service', async () => {
      const response = await request(testSetup.serverHttp)
        .get('/schools')
        .expect(200);

      expect(response.body).toEqual([{ id: 1, name: 'Mock School' }]);
    });
  });

  describe.skip('Custom Module Configuration', () => {
    let testSetup: E2ETestSetup;

    beforeAll(async () => {
      // Custom module for more targeted testing
      // Note: This would require proper module imports including DatabaseModule
      // for the factories to work correctly
      testSetup = await new E2ETestSetup()
        .withCustomModule()
        // .withImports(ConfigModule.forRoot(...), DatabaseModule, SchoolModule)
        .setupApp();
    });

    afterAll(async () => {
      if (testSetup) {
        await testSetup.teardown();
      }
    });

    beforeEach(async () => {
      if (testSetup) {
        await testSetup.cleanup();
      }
    });

    it('should work with custom module configuration', () => {
      // Custom module tests would go here
      // Note: Factories won't be available without DatabaseModule
      expect(testSetup.app).toBeDefined();
    });
  });
});
