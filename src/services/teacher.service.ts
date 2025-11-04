import { Injectable, NotFoundException } from '@nestjs/common';
import { TeacherRepository } from '../repositories/teacher.repository';
import { CreateTeacherDto, UpdateTeacherDto } from '../dto/teacher.dto';
import { Teacher } from '../database/schema';

@Injectable()
export class TeacherService {
  constructor(private readonly teacherRepository: TeacherRepository) {}

  async findAll(): Promise<Teacher[]> {
    return this.teacherRepository.findAll();
  }

  async findById(id: number): Promise<Teacher> {
    const teacher = await this.teacherRepository.findById(id);
    if (!teacher) {
      throw new NotFoundException(`Teacher with ID ${id} not found`);
    }
    return teacher;
  }

  async findBySchoolId(schoolId: number): Promise<Teacher[]> {
    return this.teacherRepository.findBySchoolId(schoolId);
  }

  async create(createTeacherDto: CreateTeacherDto): Promise<Teacher> {
    return this.teacherRepository.create(createTeacherDto);
  }

  async update(
    id: number,
    updateTeacherDto: UpdateTeacherDto,
  ): Promise<Teacher> {
    const updatedTeacher = await this.teacherRepository.update(
      id,
      updateTeacherDto,
    );
    if (!updatedTeacher) {
      throw new NotFoundException(`Teacher with ID ${id} not found`);
    }
    return updatedTeacher;
  }

  async delete(id: number): Promise<void> {
    const deleted = await this.teacherRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException(`Teacher with ID ${id} not found`);
    }
  }
}
