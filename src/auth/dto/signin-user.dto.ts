import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class SignInUserDto{
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @MinLength(8)
    password: string;
}