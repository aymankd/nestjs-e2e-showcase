import { Database } from '../../src/database/connection';
import {
  teachers,
  type NewTeacher,
} from '../../src/database/schema/teacher.schema';
import { type School } from '../../src/database/schema/school.schema';

export class TeacherFactory {
  constructor(private db: Database) {}

  private getDefaultData(schoolId?: number): NewTeacher {
    return {
      firstName: `Teacher${Date.now()}`,
      lastName: 'Doe',
      email: `teacher${Date.now()}@test.com`,
      phone: '+1234567890',
      subject: 'Mathematics',
      schoolId: schoolId || null,
    };
  }

  async create(overrides?: Partial<NewTeacher> & { school?: School }) {
    const { school, ...teacherData } = overrides || {};
    const data = {
      ...this.getDefaultData(school?.id),
      ...teacherData,
    };
    if (school?.id) {
      data.schoolId = school.id;
    }
    // Use explicit transaction to ensure commit
    return await this.db.transaction(async (tx) => {
      const [teacher] = await tx.insert(teachers).values(data).returning();
      return teacher;
    });
  }

  async createMany(
    count: number,
    overrides?: Partial<NewTeacher> & { school?: School },
  ) {
    const { school, ...teacherData } = overrides || {};
    const teachersData = Array.from({ length: count }, (_, index) => {
      const data = {
        ...this.getDefaultData(school?.id),
        firstName: `Teacher${Date.now()}_${index}`,
        email: `teacher${Date.now()}_${index}@test.com`,
        ...teacherData,
      };
      if (school?.id) {
        data.schoolId = school.id;
      }
      return data;
    });

    // Use explicit transaction to ensure commit
    return await this.db.transaction(async (tx) => {
      return tx.insert(teachers).values(teachersData).returning();
    });
  }

  async cleanup() {
    try {
      // Use TRUNCATE to delete all records and reset sequence
      await this.db.execute(`TRUNCATE TABLE teachers RESTART IDENTITY`);
    } catch (error) {
      console.warn('Error cleaning up teachers:', error);
      // Fallback: try manual cleanup
      try {
        await this.db.delete(teachers);
        await this.db.execute(`ALTER SEQUENCE teachers_id_seq RESTART WITH 1`);
      } catch (fallbackError) {
        console.warn('Fallback cleanup also failed:', fallbackError);
      }
    }
  }
}
