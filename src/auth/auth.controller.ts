import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { SignInUserDto } from './dto/signin-user.dto';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { Roles } from './decorator/roles.decorator';
import { Role } from './enum/role.enum';
import { RolesGuard } from './guard/roles.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}

    @Post('signup')
    signUp(@Body() createUserDto:CreateUserDto):Promise<string>{
        return this.authService.signUp(createUserDto)
    }

    @Post('signin')
    signin(@Body() signInUserDto: SignInUserDto):Promise<string>{
        return this.authService.signIn(signInUserDto)
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Get('profile')
    getProfile(){
        return "This is protected route"
    }

}
