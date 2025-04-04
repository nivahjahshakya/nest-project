import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from 'auth/guard/jwt-auth.guard';
import { RolesGuard } from 'auth/guard/roles.guard';
import { Roles } from 'auth/decorator/roles.decorator';
import { Role } from 'auth/enum/role.enum';
import { Task } from './entity/task.entity';

@Controller('task')
export class TaskController {
  constructor(private taskService: TaskService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.DepartmentHead||Role.SuperAdmin)
  @Post('create-task')
  createTask(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return this.taskService.createTask(createTaskDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.DepartmentHead||Role.SuperAdmin)
  @Get('get-all-tasks')
  getAllTasks(@Query('page') page: number = 1, @Query('limit') limit: number = 10): Promise<Object> {
    return this.taskService.getAllTasks(page, limit);
  }

  @UseGuards(JwtAuthGuard)
  @Get('get-task/:id')
  getTask(@Param('id') id: string): Promise<Task> {
    return this.taskService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update-task/:id')
  updateTask(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto, @Req() req): Promise<Task> {
    return this.taskService.updateTask(+id, req.user, updateTaskDto);
  }

  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles(Role.DepartmentHead||Role.SuperAdmin)
  @Delete('delete-task/:id')
  deleteTask(@Param('id') id: string): Promise<string> {
    return this.taskService.deleteTask(+id);
  }
}
