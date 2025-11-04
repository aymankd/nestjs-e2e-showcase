import { Module } from '@nestjs/common';
import { SchoolController } from '../controllers/school.controller';
import { SchoolService } from '../services/school.service';
import { SchoolRepository } from '../repositories/school.repository';

@Module({
  controllers: [SchoolController],
  providers: [SchoolService, SchoolRepository],
  exports: [SchoolService, SchoolRepository],
})
export class SchoolModule {}
