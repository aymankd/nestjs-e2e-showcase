import { Module } from '@nestjs/common';
import { TeacherController } from '../controllers/teacher.controller';
import { TeacherService } from '../services/teacher.service';
import { TeacherRepository } from '../repositories/teacher.repository';

@Module({
  controllers: [TeacherController],
  providers: [TeacherService, TeacherRepository],
  exports: [TeacherService, TeacherRepository],
})
export class TeacherModule {}
