import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { Database } from '../database/connection';
import { DATABASE_CONNECTION } from '../database/database.module';
import { schools, School, NewSchool } from '../database/schema';

@Injectable()
export class SchoolRepository {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: Database,
  ) {}

  async findAll(): Promise<School[]> {
    return this.db.select().from(schools);
  }

  async findById(id: number): Promise<School | null> {
    const result = await this.db
      .select()
      .from(schools)
      .where(eq(schools.id, id));
    return result[0] || null;
  }

  async create(school: NewSchool): Promise<School> {
    const result = await this.db.insert(schools).values(school).returning();
    return result[0];
  }

  async update(id: number, school: Partial<NewSchool>): Promise<School | null> {
    const result = await this.db
      .update(schools)
      .set({ ...school, updatedAt: new Date() })
      .where(eq(schools.id, id))
      .returning();
    return result[0] || null;
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.db.delete(schools).where(eq(schools.id, id));
    return result.length > 0;
  }
}
