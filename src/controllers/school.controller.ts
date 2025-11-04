import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { SchoolService } from '../services/school.service';
import { CreateSchoolDto, UpdateSchoolDto } from '../dto/school.dto';
import { School } from '../database/schema';

@Controller('schools')
export class SchoolController {
  constructor(private readonly schoolService: SchoolService) {}

  @Get()
  async findAll(): Promise<School[]> {
    return this.schoolService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<School> {
    return this.schoolService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createSchoolDto: CreateSchoolDto): Promise<School> {
    return this.schoolService.create(createSchoolDto);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSchoolDto: UpdateSchoolDto,
  ): Promise<School> {
    return this.schoolService.update(id, updateSchoolDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.schoolService.delete(id);
  }
}
