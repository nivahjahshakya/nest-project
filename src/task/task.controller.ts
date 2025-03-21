import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('task')
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Post('create-task')
  createTask(@Body() createTaskDto: CreateTaskDto) {
    return this.taskService.createTask(createTaskDto);
  }
  @Get('get-all-tasks')
  getAllTasks() {
    return this.taskService.getAllTasks();
  }

  @Get('get-task/:id')
  getTask(@Param('id') id: string) {
    return this.taskService.findOne(+id);
  }

  @Patch('update-task/:id')
  updateTask(@Param('id') id:string, @Body() updateTaskDto: UpdateTaskDto){
    return this.taskService.updateTask(+id, updateTaskDto)
  }

  @Delete('delete-task/:id')
  deleteTask(@Param('id') id: string) {
    return this.taskService.deleteTask(+id);
  }
}
