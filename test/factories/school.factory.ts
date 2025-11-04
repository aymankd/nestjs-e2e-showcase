import { Database } from '../../src/database/connection';
import {
  schools,
  type NewSchool,
} from '../../src/database/schema/school.schema';
import { TestDataGenerator } from '../utils/test-data-generator';

export class SchoolFactory {
  constructor(private db: Database) {}

  private getDefaultData(): NewSchool {
    return {
      name: TestDataGenerator.generateName('Test School'),
      address: TestDataGenerator.generateAddress(),
      phone: TestDataGenerator.generatePhone(),
      email: TestDataGenerator.generateEmail('school'),
    };
  }

  async create(overrides?: Partial<NewSchool>) {
    const data = { ...this.getDefaultData(), ...overrides };
    // Use explicit transaction to ensure commit
    return await this.db.transaction(async (tx) => {
      const [school] = await tx.insert(schools).values(data).returning();
      return school;
    });
  }

  async createMany(count: number, overrides?: Partial<NewSchool>) {
    const schoolsData = Array.from({ length: count }, () => ({
      ...this.getDefaultData(),
      ...overrides,
    }));

    // Use explicit transaction to ensure commit
    return await this.db.transaction(async (tx) => {
      return tx.insert(schools).values(schoolsData).returning();
    });
  }

  async cleanup() {
    try {
      // Use TRUNCATE with CASCADE to handle foreign keys and reset sequence
      await this.db.execute(`TRUNCATE TABLE schools RESTART IDENTITY CASCADE`);
    } catch (error) {
      console.warn('Error cleaning up schools:', error);
      // Fallback: try manual cleanup
      try {
        await this.db.delete(schools);
        await this.db.execute(`ALTER SEQUENCE schools_id_seq RESTART WITH 1`);
      } catch (fallbackError) {
        console.warn('Fallback cleanup also failed:', fallbackError);
      }
    }
  }
}
