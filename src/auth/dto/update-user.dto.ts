import { Match } from 'auth/decorator/match.decorator';
import { Role } from 'auth/enum/role.enum';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  ValidateIf,
} from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  firstName: string;

  @IsString()
  @IsOptional()
  lastName: string;

  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        'Password must be at least 8 characters long, include uppercase, lowercase, number, and special character.',
    },
  )
  password: string;

  @ValidateIf(o => o.password)  
  @IsString()
  @IsNotEmpty()
  @Match('password', {
    message: 'Password and confirmPassword does not match',
  })
  confirmPassword: string;

  @IsOptional()
  role: Role[];

  @IsOptional()
  task: number[];

  @IsOptional()
  departmentId: number;
}
