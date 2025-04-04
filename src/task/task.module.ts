import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entity/task.entity';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { AuthModule } from 'auth/auth.module';
import { User } from 'auth/entity/user.entity';
import { Department } from 'department/entities/department.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Task, User, Department]), AuthModule],
  controllers: [TaskController],
  providers: [TaskService],
  exports: [TaskService]
})
export class TaskModule {}
