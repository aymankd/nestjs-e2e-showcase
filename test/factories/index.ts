import { Database } from '../../src/database/connection';
import { SchoolFactory } from './school.factory';
import { TeacherFactory } from './teacher.factory';

// Factory registry - add new factories here
const FACTORY_REGISTRY = {
  school: SchoolFactory,
  teacher: TeacherFactory,
} as const;

type FactoryType = keyof typeof FACTORY_REGISTRY;
type FactoryMap = {
  [K in FactoryType]: InstanceType<(typeof FACTORY_REGISTRY)[K]>;
};

// Base factory interface for cleanup
interface IFactory {
  cleanup(): Promise<void>;
}

export class TestFactories {
  private factories = new Map<FactoryType, IFactory>();

  constructor(private db: Database) {}

  get<T extends FactoryType>(factoryType: T): FactoryMap[T] {
    if (!this.factories.has(factoryType)) {
      const FactoryClass = FACTORY_REGISTRY[factoryType];
      if (!FactoryClass) {
        throw new Error(`Unknown factory type: ${factoryType}`);
      }
      this.factories.set(factoryType, new FactoryClass(this.db));
    }

    return this.factories.get(factoryType) as FactoryMap[T];
  }

  getMultiple<T extends FactoryType[]>(
    ...factoryTypes: T
  ): { [K in T[number]]: FactoryMap[K] } {
    const result = {} as { [K in T[number]]: FactoryMap[K] };
    for (const factoryType of factoryTypes) {
      result[factoryType] = this.get(factoryType);
    }
    return result;
  }

  async cleanup() {
    try {
      // Use a single TRUNCATE command to clean all tables and reset sequences
      // CASCADE ensures foreign key constraints are handled properly
      await this.db.execute(`
        TRUNCATE TABLE teachers, schools RESTART IDENTITY CASCADE
      `);
    } catch (error) {
      console.warn('Bulk cleanup failed, trying individual cleanup:', error);

      // Fallback: clean up in reverse order of dependencies
      const cleanupOrder: FactoryType[] = ['teacher', 'school'];

      for (const factoryType of cleanupOrder) {
        const factory = this.factories.get(factoryType);
        if (factory) {
          await factory.cleanup();
        }
      }
    }
  }
}
