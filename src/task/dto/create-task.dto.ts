import { IsDefined, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateTaskDto {
  @IsDefined()
  @IsNotEmpty()
  title: string;

  @IsDefined()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  user_id: number;
}
