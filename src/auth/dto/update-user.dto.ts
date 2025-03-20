import { IsEmail, IsNotEmpty, IsOptional, MinLength } from "class-validator";

export class UpdateUserDto{
    @IsEmail()
    @IsOptional()
    email: string;

    @IsNotEmpty()
    @IsOptional()
    @MinLength(8)
    password: string;

    @IsOptional()
    role: string;
}