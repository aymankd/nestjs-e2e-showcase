import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { Database } from '../database/connection';
import { DATABASE_CONNECTION } from '../database/database.module';
import { teachers, Teacher, NewTeacher } from '../database/schema';

@Injectable()
export class TeacherRepository {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: Database,
  ) {}

  async findAll(): Promise<Teacher[]> {
    return this.db.select().from(teachers);
  }

  async findById(id: number): Promise<Teacher | null> {
    const result = await this.db
      .select()
      .from(teachers)
      .where(eq(teachers.id, id));
    return result[0] || null;
  }

  async findBySchoolId(schoolId: number): Promise<Teacher[]> {
    return this.db
      .select()
      .from(teachers)
      .where(eq(teachers.schoolId, schoolId));
  }

  async create(teacher: NewTeacher): Promise<Teacher> {
    const result = await this.db.insert(teachers).values(teacher).returning();
    return result[0];
  }

  async update(
    id: number,
    teacher: Partial<NewTeacher>,
  ): Promise<Teacher | null> {
    const result = await this.db
      .update(teachers)
      .set({ ...teacher, updatedAt: new Date() })
      .where(eq(teachers.id, id))
      .returning();
    return result[0] || null;
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.db.delete(teachers).where(eq(teachers.id, id));
    return result.length > 0;
  }
}
