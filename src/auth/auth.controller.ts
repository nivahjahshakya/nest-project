import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entity/user.entity';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}

    @Post('signup')
    signUp(@Body() createUserDto:CreateUserDto):Promise<string>{
        return this.authService.signUp(createUserDto)
    }
}
