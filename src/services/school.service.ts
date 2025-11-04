import { Injectable, NotFoundException } from '@nestjs/common';
import { SchoolRepository } from '../repositories/school.repository';
import { CreateSchoolDto, UpdateSchoolDto } from '../dto/school.dto';
import { School } from '../database/schema';

@Injectable()
export class SchoolService {
  constructor(private readonly schoolRepository: SchoolRepository) {}

  async findAll(): Promise<School[]> {
    return this.schoolRepository.findAll();
  }

  async findById(id: number): Promise<School> {
    const school = await this.schoolRepository.findById(id);
    if (!school) {
      throw new NotFoundException(`School with ID ${id} not found`);
    }
    return school;
  }

  async create(createSchoolDto: CreateSchoolDto): Promise<School> {
    return this.schoolRepository.create(createSchoolDto);
  }

  async update(id: number, updateSchoolDto: UpdateSchoolDto): Promise<School> {
    const updatedSchool = await this.schoolRepository.update(
      id,
      updateSchoolDto,
    );
    if (!updatedSchool) {
      throw new NotFoundException(`School with ID ${id} not found`);
    }
    return updatedSchool;
  }

  async delete(id: number): Promise<void> {
    const deleted = await this.schoolRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException(`School with ID ${id} not found`);
    }
  }
}
