import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Task } from "./entity/task.entity";
import { Repository } from "typeorm";
import { CreateTaskDto } from "./dto/create-task.dto";
import { User } from "auth/entity/user.entity";
import { UpdateTaskDto } from "./dto/update-task.dto";

@Injectable()
export class TaskService {
    constructor(
        @InjectRepository(Task)
        private readonly taskRepository: Repository<Task>,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {}

    async createTask(createTaskDto: CreateTaskDto): Promise<Task>{
        const task = new Task();
        task.title = createTaskDto.title;
        task.description = createTaskDto.description;
        if(createTaskDto.user_id){
            const user = await this.findOne(+createTaskDto.user_id);
            if(!user){
                throw new NotFoundException('User not found');
            }
            task.user_id = createTaskDto.user_id;
        }
        return await this.taskRepository.save(task);
    }
    async findOne(id: number): Promise<Task>{
        const task = await this.taskRepository.findOne({where: {id}});
        if(!task){
            throw new NotFoundException('Task not found')
        }
        return task;
    }

    async getAllTasks(): Promise<Task[]>{
        return await this.taskRepository.find({relations: ['user']});
    }

    async updateTask(id: number, updateTaskDto: UpdateTaskDto){
        const existingTask = await this.findOne(id);
        if(!existingTask){
            throw new NotFoundException('Task not found')
        }
        if(updateTaskDto.title) existingTask.title = updateTaskDto.title;
        if(updateTaskDto.description) existingTask.description = updateTaskDto.description;
        if(updateTaskDto.status) existingTask.status = updateTaskDto.status;
        if(updateTaskDto.user_id){
            const user = this.userRepository.findOne({where: {id: updateTaskDto.user_id}});
            if(!user){
                throw new NotFoundException('User not found')
            }
            existingTask.user_id = updateTaskDto.user_id;
        }
        return this.taskRepository.save(existingTask);
    }

    async deleteTask(id: number){
        const task = await this.findOne(id);
        if(!task){      
            throw new NotFoundException('Task not found')
        }
        await this.taskRepository.softRemove(task);
        return 'Task deleted successfully';
    }
}