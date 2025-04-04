import { forwardRef, Module } from '@nestjs/common';
import { DepartmentService } from './department.service';
import { DepartmentController } from './department.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Department } from './entities/department.entity';
import { AuthModule } from 'auth/auth.module';
import { User } from 'auth/entity/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Department, User]), AuthModule],
  controllers: [DepartmentController],
  providers: [DepartmentService],
  exports: [DepartmentService]
})
export class DepartmentModule {}
