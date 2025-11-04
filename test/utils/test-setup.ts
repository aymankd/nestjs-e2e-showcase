/**
 * E2E Test Setup Utility with Builder Pattern
 *
 * This utility provides a flexible builder pattern for setting up E2E tests in NestJS.
 * It supports various configuration options for different testing scenarios.
 *
 * @example
 * // Basic E2E test with full AppModule (recommended for most E2E tests)
 * const testSetup = await new E2ETestSetup()
 *   .withAppModule() // Default behavior, can be omitted
 *   .setupApp();
 *
 * @example
 * // E2E test with mocked service
 * const testSetup = await new E2ETestSetup()
 *   .withAppModule()
 *   .overrideProvider(SchoolService, mockSchoolService)
 *   .setupApp();
 *
 * @example
 * // Custom module configuration (for more targeted testing)
 * const testSetup = await new E2ETestSetup()
 *   .withCustomModule()
 *   .withImports(ConfigModule.forRoot(...), DatabaseModule, SchoolModule)
 *   .withControllers(SchoolController)
 *   .withProviders(SchoolService)
 *   .setupApp();
 *
 * @example
 * // Multiple provider overrides
 * const testSetup = await new E2ETestSetup()
 *   .withAppModule()
 *   .overrideProvider(SchoolService, mockSchoolService)
 *   .overrideProviderWithClass(AnotherService, MockAnotherService)
 *   .setupApp();
 */

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { DynamicModule, Type } from '@nestjs/common';
import { Database } from '../../src/database/connection';
import { TestFactories } from '../factories';
import { AppModule } from '../../src/app.module';

interface ProviderOverride {
  token: any;
  useValue?: any;
  useClass?: Type<any>;
  useFactory?: (...args: any[]) => any;
  inject?: any[];
}

export class E2ETestSetup {
  public app: INestApplication;
  public db: Database;
  public factories: TestFactories;
  public serverHttp: string;

  private imports: (Type<any> | DynamicModule)[] = [AppModule];
  private controllers: Type<any>[] = [];
  private providers: any[] = [];
  private providerOverrides: ProviderOverride[] = [];
  private useCustomModule = false;

  /**
   * Use the full AppModule (default behavior for E2E tests)
   * This provides complete integration testing with all modules, controllers, and services
   */
  withAppModule(): E2ETestSetup {
    this.imports = [AppModule];
    this.useCustomModule = false;
    return this;
  }

  /**
   * Use a custom module configuration instead of AppModule
   * This allows for more targeted testing with specific modules
   */
  withCustomModule(): E2ETestSetup {
    this.imports = [];
    this.useCustomModule = true;
    return this;
  }

  /**
   * Add imports to the testing module
   * When using AppModule, these are ignored (use overrideProvider instead)
   */
  withImports(...imports: (Type<any> | DynamicModule)[]): E2ETestSetup {
    if (this.useCustomModule) {
      this.imports.push(...imports);
    }
    return this;
  }

  /**
   * Add controllers to the testing module
   * Only used when withCustomModule() is called
   */
  withControllers(...controllers: Type<any>[]): E2ETestSetup {
    if (this.useCustomModule) {
      this.controllers.push(...controllers);
    }
    return this;
  }

  /**
   * Add providers to the testing module
   * Only used when withCustomModule() is called
   */
  withProviders(...providers: unknown[]): E2ETestSetup {
    if (this.useCustomModule) {
      this.providers.push(...providers);
    }
    return this;
  }

  /**
   * Override a provider with a mock value
   * Works with both AppModule and custom module configurations
   */
  overrideProvider(token: unknown, useValue: unknown): E2ETestSetup {
    this.providerOverrides.push({ token, useValue });
    return this;
  }

  /**
   * Override a provider with a mock class
   * Works with both AppModule and custom module configurations
   */
  overrideProviderWithClass(
    token: unknown,
    useClass: Type<unknown>,
  ): E2ETestSetup {
    this.providerOverrides.push({ token, useClass });
    return this;
  }

  /**
   * Override a provider with a factory function
   * Works with both AppModule and custom module configurations
   */
  overrideProviderWithFactory(
    token: unknown,
    useFactory: (...args: unknown[]) => any,
    inject: unknown[] = [],
  ): E2ETestSetup {
    this.providerOverrides.push({ token, useFactory, inject });
    return this;
  }

  /**
   * Build and initialize the testing application
   * This should be called last in the chain
   */
  async setupApp(): Promise<E2ETestSetup> {
    let moduleBuilder = Test.createTestingModule({
      imports: this.imports,
      controllers: this.controllers,
      providers: this.providers,
    });

    // Apply all provider overrides
    for (const override of this.providerOverrides) {
      if (override.useValue !== undefined) {
        moduleBuilder = moduleBuilder
          .overrideProvider(override.token)
          .useValue(override.useValue);
      } else if (override.useClass) {
        moduleBuilder = moduleBuilder
          .overrideProvider(override.token)
          .useClass(override.useClass);
      } else if (override.useFactory) {
        // For factory overrides, we'll use a simpler approach with useValue
        // since the testing module builder has different API for useFactory
        moduleBuilder = moduleBuilder
          .overrideProvider(override.token)
          .useValue(override.useFactory());
      }
    }

    const moduleFixture: TestingModule = await moduleBuilder.compile();
    this.app = moduleFixture.createNestApplication();
    await this.app.init();
    this.serverHttp = this.app.getHttpServer() as string;

    // Get database connection and factories (only if using AppModule or DatabaseModule)
    try {
      this.db = this.app.get<Database>('DATABASE_CONNECTION');
      this.factories = new TestFactories(this.db);
    } catch (error) {
      console.error(error);
      console.warn(
        'DATABASE_CONNECTION not found - factories will not be available',
      );
    }

    return this;
  }

  async cleanup() {
    if (this.factories) {
      await this.factories.cleanup();
    }
  }

  async teardown() {
    await this.cleanup();
    if (this.app) {
      await this.app.close();
    }
  }

  getFactory<T extends 'school' | 'teacher'>(factoryType: T) {
    if (!this.factories) {
      throw new Error(
        'Factories are not available. Make sure your test module includes DatabaseModule or use AppModule.',
      );
    }
    return this.factories.get(factoryType);
  }
}
