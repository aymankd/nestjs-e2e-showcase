import request from 'supertest';
import { E2ETestSetup } from '../utils/test-setup';
import { describe, beforeAll, afterAll, beforeEach, it, expect } from 'vitest';

describe('School E2E', () => {
  let testSetup: E2ETestSetup;

  beforeAll(async () => {
    testSetup = await new E2ETestSetup()
      .withAppModule() // Use full AppModule for complete E2E testing (default)
      .setupApp(); // Build and initialize the app
  });

  beforeEach(async () => {
    await testSetup.cleanup();
  });

  afterAll(async () => {
    await testSetup.teardown();
  });

  it('GET /schools should return empty array when no schools exist', async () => {
    const response = await request(testSetup.serverHttp)
      .get('/schools')
      .expect(200);

    expect(response.body).toEqual([]);
  });

  it('GET /schools should return array of schools when schools exist', async () => {
    // Create test data via HTTP POST (uses same database as GET)
    const school1Data = {
      name: 'Test School 1',
      address: '123 Test Street',
      phone: '+1234567890',
      email: 'school1@test.com',
    };

    const school2Data = {
      name: 'Test School 2',
      address: '456 Another Street',
      phone: '+1234567891',
      email: 'school2@test.com',
    };

    // Create schools via HTTP POST to ensure same database connection
    const createResponse1 = await request(testSetup.serverHttp)
      .post('/schools')
      .send(school1Data)
      .expect(201);

    const createResponse2 = await request(testSetup.serverHttp)
      .post('/schools')
      .send(school2Data)
      .expect(201);

    // Now test GET endpoint
    const response = await request(testSetup.serverHttp)
      .get('/schools')
      .expect(200);

    expect(response.body).toHaveLength(2);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: createResponse1.body.id,
          name: 'Test School 1',
          address: '123 Test Street',
        }),
        expect.objectContaining({
          id: createResponse2.body.id,
          name: 'Test School 2',
          address: '456 Another Street',
        }),
      ]),
    );
  });

  it('GET /schools/:id should return specific school', async () => {
    // This test demonstrates the factory pattern working correctly
    // Note: Single record access works with factories, but listing doesn't
    // due to potential database connection differences between factory and app
    const schoolFactory = testSetup.getFactory('school');

    const school = await schoolFactory.create({
      name: 'Specific Test School',
      address: '789 Specific Street',
      phone: '+1234567890',
      email: 'specific@test.com',
    });

    const response = await request(testSetup.serverHttp)
      .get(`/schools/${school.id}`)
      .expect(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        id: school.id,
        name: 'Specific Test School',
        address: '789 Specific Street',
        phone: '+1234567890',
        email: 'specific@test.com',
      }),
    );
  });

  it('should demonstrate factory pattern for test data setup', async () => {
    // This test shows how factories can be used for setup,
    // then HTTP for verification (hybrid approach)
    const schoolFactory = testSetup.getFactory('school');

    const school = await schoolFactory.create({
      name: 'Factory Created School',
      address: '456 Factory Street',
      email: 'factory@test.com',
    });

    // Verify via HTTP that the school exists
    const response = await request(testSetup.serverHttp)
      .get(`/schools/${school.id}`)
      .expect(200);

    expect(response.body.name).toBe('Factory Created School');
    expect(response.body.id).toBe(school.id);
  });

  it('GET /schools - should work with factory-created data', async () => {
    // Now that explicit transactions are implemented, this should work!
    const schoolFactory = testSetup.getFactory('school');

    const school1 = await schoolFactory.create({
      name: 'Factory School 1',
      address: '123 Factory Street',
    });
    const school2 = await schoolFactory.create({
      name: 'Factory School 2',
      address: '456 Factory Avenue',
    });

    // Get schools via API - should now see factory-created data
    const response = await request(testSetup.serverHttp)
      .get('/schools')
      .expect(200);

    expect(response.body).toHaveLength(2);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: school1.id,
          name: 'Factory School 1',
          address: '123 Factory Street',
        }),
        expect.objectContaining({
          id: school2.id,
          name: 'Factory School 2',
          address: '456 Factory Avenue',
        }),
      ]),
    );
  });
});
