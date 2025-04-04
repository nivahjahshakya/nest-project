import { Match } from "auth/decorator/match.decorator";
import {IsDefined, IsNotEmpty,  IsString,  Matches,  MinLength } from "class-validator";

export class UpdatePasswordDto{
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    oldPassword: string;

    @IsString()
    @IsNotEmpty()
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
        message: 'Password must be at least 8 characters long, include uppercase, lowercase, number, and special character.',
      })
    newPassword: string;

    @IsString()
    @IsNotEmpty()
    @Match('newPassword', {message: 'Password and confirmPassword does not match'})
    confirmPassword: string;
}