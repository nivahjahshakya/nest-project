import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
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

@Controller('task')
export class TaskController {
  constructor(private taskService: TaskService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Post('create-task')
  createTask(@Body() createTaskDto: CreateTaskDto) {
    return this.taskService.createTask(createTaskDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Get('get-all-tasks')
  getAllTasks() {
    return this.taskService.getAllTasks();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Get('get-task/:id')
  getTask(@Param('id') id: string) {
    return this.taskService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update-task/:id')
  updateTask(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto, @Req() req) {
    return this.taskService.updateTask(+id, req.user, updateTaskDto);
  }

  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles(Role.Admin)
  @Delete('delete-task/:id')
  deleteTask(@Param('id') id: string) {
    return this.taskService.deleteTask(+id);
  }
}
