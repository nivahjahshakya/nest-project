import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { SignInUserDto } from './dto/signin-user.dto';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { Roles } from './decorator/roles.decorator';
import { Role } from './enum/role.enum';
import { RolesGuard } from './guard/roles.guard';
import { User } from './entity/user.entity';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}
    
    @Post('signin')
    signin(@Body() signInUserDto: SignInUserDto):Promise<string>{
        return this.authService.signIn(signInUserDto)
    }
    
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Post('createuser')
    createUser(@Body() createUserDto:CreateUserDto):Promise<string>{
        return this.authService.createUser(createUserDto)
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Req() req){
        return this.authService.findOne(+req.user.userId)
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Get('getuser')
    getUser():Promise<User[]>{
        return this.authService.getUser()
    }

    @UseGuards(JwtAuthGuard,RolesGuard)
    @Roles(Role.Admin)
    @Get('getuser/:id')
    getUserById(@Param('id') id:string):Promise<User>{
        return this.authService.findOne(+id)
    }



}
