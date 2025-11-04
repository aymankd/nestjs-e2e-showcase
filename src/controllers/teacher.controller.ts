import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { TeacherService } from '../services/teacher.service';
import { CreateTeacherDto, UpdateTeacherDto } from '../dto/teacher.dto';
import { Teacher } from '../database/schema';

@Controller('teachers')
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {}

  @Get()
  async findAll(): Promise<Teacher[]> {
    return this.teacherService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Teacher> {
    return this.teacherService.findById(id);
  }

  @Get('school/:schoolId')
  async findBySchool(
    @Param('schoolId', ParseIntPipe) schoolId: number,
  ): Promise<Teacher[]> {
    return this.teacherService.findBySchoolId(schoolId);
  }

  @Post()
  async create(@Body() createTeacherDto: CreateTeacherDto): Promise<Teacher> {
    return this.teacherService.create(createTeacherDto);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTeacherDto: UpdateTeacherDto,
  ): Promise<Teacher> {
    return this.teacherService.update(id, updateTeacherDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.teacherService.delete(id);
  }
}
