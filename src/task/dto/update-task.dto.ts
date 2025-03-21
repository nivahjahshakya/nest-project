import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { TaskStatus } from 'task/enum/status.enum';

export class UpdateTaskDto {
    @IsNotEmpty()
  @IsOptional()
  title: string;

  @IsNotEmpty()
  @IsOptional()
  description: string;

  @IsOptional()
  @IsEnum(TaskStatus, {message: "The status must be either 'OPEN', 'IN_PROGRESS', or 'DONE'"})
  status: TaskStatus;

  @IsOptional()
  user_id: number;
}
