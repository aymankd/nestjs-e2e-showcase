import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { schools, School, NewSchool } from '../database/schema';
import { BaseRepository } from './base.repository';

@Injectable()
export class SchoolRepository extends BaseRepository {
  async findAll(): Promise<School[]> {
    return this.db.select().from(schools);
  }

  async findById(id: number): Promise<School | null> {
    const result = await this.db
      .select()
      .from(schools)
      .where(eq(schools.id, id));
    return this.getFirstOrNull(result);
  }

  async create(school: NewSchool): Promise<School> {
    const result = await this.db.insert(schools).values(school).returning();
    return this.getFirst(result, 'School');
  }

  async update(id: number, school: Partial<NewSchool>): Promise<School | null> {
    const result = await this.db
      .update(schools)
      .set({ ...school, updatedAt: new Date() })
      .where(eq(schools.id, id))
      .returning();
    return this.getFirstOrNull(result);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.db.delete(schools).where(eq(schools.id, id));
    return this.wasAffected(result);
  }
}
