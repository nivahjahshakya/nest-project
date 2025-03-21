import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Task } from "./entity/task.entity";
import { Repository } from "typeorm";
import { CreateTaskDto } from "./dto/create-task.dto";
import { User } from "auth/entity/user.entity";

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
            const user = await this.userRepository.findOne({where: {id: createTaskDto.user_id}});
            if(!user){
                throw new NotFoundException('User not found');
            }
            task.user_id = createTaskDto.user_id;
        }
        return await this.taskRepository.save(task);
    }
}