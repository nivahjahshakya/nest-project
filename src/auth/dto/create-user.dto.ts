import { Match } from 'auth/decorator/match.decorator';
import { Role } from 'auth/enum/role.enum';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
    message: 'Password must be at least 8 characters long, include uppercase, lowercase, number, and special character.',
  })
  password: string;

  @IsString()
  @IsNotEmpty()
  @Match('password', {
    message: 'Password and confirmPassword does not match',
  })
  confirmPassword: string;

  @IsOptional()
  role: Role[];

  @IsOptional()
  departmentId: number;
}
