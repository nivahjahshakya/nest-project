import { Match } from "auth/decorator/match.decorator";
import {IsDefined, IsNotEmpty,  MinLength } from "class-validator";

export class UpdatePasswordDto{
    @IsDefined()
    @IsNotEmpty()
    @MinLength(8)
    oldPassword: string;

    @IsDefined()
    @IsNotEmpty()
    @MinLength(8)
    newPassword: string;

    @IsDefined()
    @IsNotEmpty()
    @Match('newPassword', {message: 'Password and confirmPassword does not match'})
    confirmPassword: string;
}