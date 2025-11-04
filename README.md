# NestJS E2E & Integration Testing Showcase 🧪

A comprehensive showcase of **End-to-End (E2E) and Integration testing** in NestJS applications, featuring real database connections, factory patterns, and production-like testing scenarios.

## 🎯 What This Project Demonstrates

This project showcases **advanced E2E and Integration testing patterns** for NestJS applications:

- ✅ **Real Application Testing** - Tests against the complete application stack (E2E)
- ✅ **Module Integration Testing** - Test specific modules with real database connections
- ✅ **Database Integration** - Uses real PostgreSQL database connections in tests
- ✅ **Factory Pattern** - Generates realistic test data with database persistence
- ✅ **Builder Pattern** - Flexible test setup with chainable configuration
- ✅ **Test Isolation** - Proper cleanup and data management between tests
- ✅ **HTTP Testing** - Full request/response cycle testing with Supertest

## 🚀 Quick Start

### Prerequisites
- Node.js (use version specified in `.nvmrc`)
- pnpm
- Docker & Docker Compose

### Setup

1. **Install dependencies**
   ```bash
   pnpm install
   ```

2. **Environment setup**
   ```bash
   cp .env.example .env
   ```

3. **Start database**
   ```bash
   pnpm run docker-compose:up
   ```

4. **Setup database schema**
   ```bash
   pnpm run db:push
   ```

5. **Run E2E tests** (Main feature!)
   ```bash
   pnpm run test:e2e:vitest
   ```

## 🧪 E2E Testing Features

### 1. **Complete E2E Flow Example**

Here's a complete example showing **database factory → HTTP endpoint → real application testing**:

```typescript
// test/e2e/school.e2e.spec.ts
describe('School E2E', () => {
  let testSetup: E2ETestSetup;

  beforeAll(async () => {
    // 🚀 Sets up REAL NestJS application with ALL modules
    testSetup = await new E2ETestSetup()
      .withAppModule() // Uses complete AppModule - no mocking!
      .setupApp();
  });

  beforeEach(async () => {
    // 🧹 Clean database before each test
    await testSetup.cleanup();
  });

  it('should handle complete CRUD operations', async () => {
    // 🏭 Step 1: Get database-connected factory
    const schoolFactory = testSetup.getFactory('school');

    // 📝 Step 2: Create test data in REAL database
    const school1 = await schoolFactory.create({
      name: 'Harvard University',
      address: '25 Harvard Way, Cambridge, MA',
      email: 'info@harvard.edu',
    });

    const school2 = await schoolFactory.create({
      name: 'MIT',
      address: '77 Massachusetts Ave, Cambridge, MA',
      email: 'info@mit.edu',
    });

    // 🌐 Step 3: Test GET ALL endpoint
    const listResponse = await request(testSetup.serverHttp)
      .get('/schools')
      .expect(200);

    expect(listResponse.body).toHaveLength(2);
    expect(listResponse.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: 'Harvard University' }),
        expect.objectContaining({ name: 'MIT' }),
      ]),
    );

    // 🎯 Step 4: Test GET by ID endpoint
    const getResponse = await request(testSetup.serverHttp)
      .get(`/schools/${school1.id}`)
      .expect(200);

    expect(getResponse.body).toEqual({
      id: school1.id,
      name: 'Harvard University',
      address: '25 Harvard Way, Cambridge, MA',
      email: 'info@harvard.edu',
      phone: expect.any(String),
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });

    // ✏️ Step 5: Test UPDATE endpoint
    const updateResponse = await request(testSetup.serverHttp)
      .put(`/schools/${school1.id}`)
      .send({ name: 'Harvard University (Updated)' })
      .expect(200);

    expect(updateResponse.body.name).toBe('Harvard University (Updated)');

    // 🗑️ Step 6: Test DELETE endpoint
    await request(testSetup.serverHttp)
      .delete(`/schools/${school2.id}`)
      .expect(204);

    // ✅ Step 7: Verify deletion worked
    const finalListResponse = await request(testSetup.serverHttp)
      .get('/schools')
      .expect(200);

    expect(finalListResponse.body).toHaveLength(1);
    expect(finalListResponse.body[0].name).toBe('Harvard University (Updated)');
  });
});
```

### 2. **Real Application Testing Benefits**

Unlike unit tests that mock dependencies, our E2E tests run against the **complete application**:

### 3. **Database Factory Pattern with Real Connections**

The factory pattern creates **real data in your PostgreSQL database** - not mocks or stubs:

```typescript
describe('Factory Database Integration', () => {
  it('demonstrates real database connection in tests', async () => {
    // 🔌 Factory gets REAL database connection from testSetup
    const schoolFactory = testSetup.getFactory('school');
    
    // 💾 This creates ACTUAL records in PostgreSQL
    const school = await schoolFactory.create({
      name: 'Stanford University',
      address: '450 Serra Mall, Stanford, CA',
      email: 'info@stanford.edu',
    });

    // ✅ Data exists in database with real ID and timestamps
    expect(school.id).toBeGreaterThan(0);
    expect(school.createdAt).toBeInstanceOf(Date);

    // 🔍 You can even query the database directly to verify
    const dbRecord = await testSetup.db
      .select()
      .from(schools)
      .where(eq(schools.id, school.id));
    
    expect(dbRecord[0].name).toBe('Stanford University');

    // 🌐 HTTP endpoint sees the SAME data
    const response = await request(testSetup.serverHttp)
      .get(`/schools/${school.id}`)
      .expect(200);

    expect(response.body.name).toBe('Stanford University');
  });

  it('shows factory data generation capabilities', async () => {
    const schoolFactory = testSetup.getFactory('school');

    // 📊 Create multiple records with realistic data
    const schools = await schoolFactory.createMany(10, {
      address: 'California, USA', // Common override
    });

    // 🎯 Each record has unique, realistic data
    expect(schools).toHaveLength(10);
    expect(schools[0].name).not.toBe(schools[1].name);
    expect(schools[0].email).not.toBe(schools[1].email);
    
    // 🔗 All records are linked to the same address override
    schools.forEach(school => {
      expect(school.address).toBe('California, USA');
    });
  });
});
```

### Key Factory Benefits:

- **🔌 Real Database Connection**: Uses the same PostgreSQL instance as your app
- **📝 Persistent Data**: Records are actually stored and can be queried
- **🎯 Realistic Data**: Generates unique, production-like test data
- **🧹 Automatic Cleanup**: Data is cleaned between tests for isolation
- **🔄 Reusable**: Same factories work across all your E2E tests

### 4. **Builder Pattern for E2E and Integration Testing**

The same builder pattern works for **both E2E and Integration testing** scenarios:

```typescript
// 🌐 FULL E2E TESTING - Complete application with all modules
const e2eSetup = await new E2ETestSetup()
  .withAppModule() // Uses complete AppModule - tests everything
  .setupApp();

// 🔧 INTEGRATION TESTING - Specific modules with real database
const integrationSetup = await new E2ETestSetup()
  .withCustomModule()
  .withImports(
    ConfigModule.forRoot({...}),
    DatabaseModule,     // Real database connection
    SchoolModule       // Only the module you want to test
  )
  .setupApp();

// 🎭 E2E WITH SELECTIVE MOCKING - Full app but mock external services
const mockingSetup = await new E2ETestSetup()
  .withAppModule()
  .overrideProvider(EmailService, mockEmailService)
  .overrideProvider(PaymentService, mockPaymentService)
  .setupApp();

// 🧪 INTEGRATION WITH SERVICE TESTING - Test service layer with real DB
const serviceSetup = await new E2ETestSetup()
  .withCustomModule()
  .withImports(DatabaseModule)
  .withProviders(SchoolService, SchoolRepository)
  .setupApp();
```

### E2E vs Integration Testing Use Cases

| Test Type | When to Use | Setup Pattern | Benefits |
|-----------|-------------|---------------|----------|
| **🌐 Full E2E** | Complete user journeys | `withAppModule()` | Tests entire application stack |
| **🔧 Module Integration** | Specific feature testing | `withCustomModule() + specific imports` | Faster, focused testing |
| **🎭 Selective Mocking** | External service isolation | `withAppModule() + overrides` | Real app, controlled externals |
| **🧪 Service Integration** | Business logic + DB testing | `withCustomModule() + service layer` | Test core logic with real data |

### 4. **Automatic Test Isolation**

Each test runs with a **clean database state**:

```typescript
beforeEach(async () => {
  // Automatically cleans ALL test data
  await testSetup.cleanup();
});

afterAll(async () => {
  // Properly closes database connections
  await testSetup.teardown();
});
```

### 5. **Real HTTP Request Testing**

Test your **actual API endpoints** with real HTTP requests:

```typescript
it('GET /schools should return all schools', async () => {
  // Setup test data
  await schoolFactory.createMany(3);

  // Make REAL HTTP request to running application
  const response = await request(testSetup.serverHttp)
    .get('/schools')
    .expect(200);

  expect(response.body).toHaveLength(3);
});

it('POST /schools should create new school', async () => {
  const newSchool = {
    name: 'New University',
    address: '456 College Ave',
    email: 'info@newuni.edu',
  };

  // Test POST endpoint
  const response = await request(testSetup.serverHttp)
    .post('/schools')
    .send(newSchool)
    .expect(201);

  // Verify data was actually saved to database
  const savedSchool = await schoolFactory.findById(response.body.id);
  expect(savedSchool.name).toBe('New University');
});
```

## 📁 E2E Test Structure

```
test/
├── e2e/                          # E2E test files
│   ├── school.e2e.spec.ts       # School API E2E tests
│   ├── app.e2e.spec.ts          # Basic app E2E tests
│   └── test-setup-examples.e2e.spec.ts  # Usage examples
├── factories/                    # Test data factories
│   ├── index.ts                  # Factory registry
│   ├── school.factory.ts         # School data factory
│   └── teacher.factory.ts        # Teacher data factory
├── utils/                        # Test utilities
│   ├── test-setup.ts            # E2E test builder
│   └── test-data-generator.ts   # Data generation helpers
└── config/
    └── test.config.ts           # Test-specific configuration
```

## 🛠️ Available Scripts

```bash
# E2E Testing (Main Focus)
pnpm run test:e2e:vitest         # Run E2E tests with Vitest
pnpm run test:e2e:vitest:watch   # Watch mode for E2E tests
pnpm run test:e2e:vitest:ui      # UI mode for E2E tests
pnpm run test:e2e                # Run E2E tests with Jest

# Development
pnpm run start:dev               # Start with hot reload
pnpm run start                   # Start production build

# Database
pnpm run db:push                 # Push schema to database
pnpm run db:generate             # Generate migrations
pnpm run db:studio               # Open database GUI

# Docker
pnpm run docker-compose:up       # Start PostgreSQL
pnpm run docker-compose:down     # Stop PostgreSQL
```

## 🏗️ Tech Stack

### Core Technologies
- **Framework**: NestJS - Enterprise-grade Node.js framework
- **Database**: PostgreSQL - Production-grade relational database
- **ORM**: Drizzle ORM - Type-safe database access
- **Configuration**: Joi - Environment validation

### Testing Stack
- **E2E Framework**: Vitest/Jest - Fast, modern testing
- **HTTP Testing**: Supertest - HTTP assertion library
- **Factories**: Custom factory pattern for test data
- **Builder Pattern**: Flexible test setup configuration

## 🚀 Try It Yourself

### Run the E2E Tests

1. **Start the database**:
   ```bash
   pnpm run docker-compose:up
   ```

2. **Setup schema**:
   ```bash
   pnpm run db:push
   ```

3. **Run E2E tests**:
   ```bash
   # Run all E2E tests
   pnpm run test:e2e:vitest

   # Watch mode (re-runs on file changes)
   pnpm run test:e2e:vitest:watch

   # Interactive UI mode
   pnpm run test:e2e:vitest:ui
   ```

### Explore the Test Files

#### E2E Test Examples
- **`test/e2e/school.e2e.spec.ts`** - Complete CRUD operations testing with real database
- **`test/e2e/test-setup-examples.e2e.spec.ts`** - Different test setup patterns and service mocking
- **`test/e2e/app.e2e.spec.ts`** - Basic application health check testing

#### Integration Testing Ready
The same utilities can be used for integration tests:

```typescript
// Example: Integration test for SchoolService with real database
describe('SchoolService Integration', () => {
  let testSetup: E2ETestSetup;
  let schoolService: SchoolService;

  beforeAll(async () => {
    // 🔧 Integration setup - only the modules we need
    testSetup = await new E2ETestSetup()
      .withCustomModule()
      .withImports(
        ConfigModule.forRoot({...}),
        DatabaseModule,           // Real PostgreSQL connection
        SchoolModule             // Module under test
      )
      .setupApp();

    // Get the service instance for direct testing
    schoolService = testSetup.app.get(SchoolService);
  });

  it('should create school with real database persistence', async () => {
    // 🧪 Test service directly (no HTTP layer)
    const school = await schoolService.create({
      name: 'Integration Test School',
      address: '123 Test Ave',
      email: 'test@school.edu'
    });

    // ✅ Verify with direct database query
    const dbRecord = await testSetup.db
      .select()
      .from(schools)
      .where(eq(schools.id, school.id));

    expect(dbRecord[0].name).toBe('Integration Test School');
  });
});
```

#### Supporting Files
- **`test/factories/school.factory.ts`** - Database factory implementation with PostgreSQL
- **`test/factories/teacher.factory.ts`** - Related entity factory with foreign key relationships
- **`test/utils/test-setup.ts`** - Builder pattern test setup utility (200+ lines of examples!)
- **`test/utils/test-data-generator.ts`** - Realistic test data generation helpers

### What Each Test Demonstrates

1. **Real Database Operations**: See how factories create actual PostgreSQL records
2. **HTTP Endpoint Testing**: Complete request/response cycle validation  
3. **Service Mocking**: How to mock specific services while keeping database real
4. **Relationship Testing**: Foreign key relationships between schools and teachers
5. **Data Cleanup**: Automatic test isolation and cleanup strategies
6. **Builder Pattern**: Flexible test configuration with method chaining

### Key Commands for Development

```bash
# Watch database changes in real-time
pnpm run db:studio

# View test output with details
pnpm run test:e2e:vitest -- --reporter=verbose

# Run specific test file
pnpm run test:e2e:vitest test/e2e/school.e2e.spec.ts
```

## 🎓 Key Learning Points

### Why This Testing Approach is Superior

#### 🌐 E2E Testing Benefits
1. **🔗 Complete Stack Testing**: Tests the entire application from HTTP to database
2. **📡 API Contract Validation**: Ensures endpoints work as expected
3. **🎯 End-User Perspective**: Tests what users actually experience
4. **🛡️ Regression Prevention**: Catches integration issues across modules

#### 🔧 Integration Testing Benefits  
1. **⚡ Focused Testing**: Test specific modules without full application overhead
2. **🎯 Isolated Scope**: Test business logic with real database persistence
3. **🚀 Faster Execution**: Lighter setup for quicker feedback loops
4. **� Precise Debugging**: Easier to pinpoint issues in specific components

#### 🏭 Shared Benefits (Both Approaches)
1. **💾 Database Confidence**: Validates actual data persistence and retrieval
2. **🏭 Production Similarity**: Tests mirror production environment  
3. **� Real Relationships**: Tests foreign keys and database constraints
4. **🧹 Test Isolation**: Proper cleanup ensures reliable test results

### Factory Pattern Benefits

- **🎲 Realistic Data**: Generates production-like test data with real constraints
- **♻️ DRY Principle**: Reusable data creation across all test scenarios  
- **🔧 Flexibility**: Easy customization with overrides and relationships
- **💾 Database Integration**: Works with real foreign keys and constraints
- **🧹 Clean State**: Automatic cleanup ensures test isolation

### Builder Pattern Advantages

- **🔗 Fluent API**: Readable, chainable configuration methods
- **⚙️ Flexibility**: Mix and match testing approaches as needed
- **🎯 Default Behavior**: Sensible defaults for common E2E scenarios
- **📈 Extensibility**: Easy to add new configuration options
- **🎭 Service Mocking**: Option to mock specific services when needed

### What Makes This Different

This project demonstrates **flexible, real-world testing approaches**:

#### 🌐 True E2E Testing
- ✅ **Complete Stack**: Full request → controller → service → database → response cycle
- ✅ **Production-Like**: Same exact stack as production environment
- ✅ **User Confidence**: If E2E tests pass, the feature works for real users
- ✅ **HTTP Layer**: Tests actual API endpoints and HTTP responses

#### 🔧 Real Integration Testing  
- ✅ **Module Focus**: Test specific modules with real database persistence
- ✅ **Service Layer**: Direct testing of business logic with actual data
- ✅ **Database Integration**: Real foreign keys, constraints, and relationships
- ✅ **Faster Feedback**: Lighter setup for quicker development cycles

#### ❌ What We Avoid
- ❌ **Fake Unit Tests**: No database or HTTP mocking where it matters
- ❌ **Isolated Silos**: Components tested together, not in complete isolation
- ❌ **Mock Everything**: Real database ensures actual data behavior
- ❌ **False Confidence**: Tests prove the system actually works together

#### 🎯 Flexible Approach
Choose the right tool for the job:
- **E2E** for complete user journeys and API validation
- **Integration** for focused module testing with real data
- **Both** using the same builder pattern and factory system
