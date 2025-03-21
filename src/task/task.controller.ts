import { Body, Controller, Post } from "@nestjs/common";
import { TaskService } from "./task.service";
import { CreateTaskDto } from "./dto/create-task.dto";

@Controller('task')
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Post('create-task')
  createTask(@Body() createTaskDto: CreateTaskDto){
    return this.taskService.createTask(createTaskDto);
  }
}