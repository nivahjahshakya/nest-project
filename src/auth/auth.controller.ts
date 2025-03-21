import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { SignInUserDto } from './dto/signin-user.dto';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { Roles } from './decorator/roles.decorator';
import { Role } from './enum/role.enum';
import { RolesGuard } from './guard/roles.guard';
import { User } from './entity/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}
    
    @Post('signin')
    signin(@Body() signInUserDto: SignInUserDto):Promise<string>{
        return this.authService.signIn(signInUserDto)
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Post('create-user')
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
    @Get('get-user')
    getUser():Promise<User[]>{
        return this.authService.getUser()
    }

    @UseGuards(JwtAuthGuard,RolesGuard)
    @Roles(Role.Admin)
    @Get('get-user/:id')
    getUserById(@Param('id') id:string):Promise<User>{
        return this.authService.findOne(+id)
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Patch('update-user/:id')
    updateUser(@Param('id') id:string, @Body() updatedUserDto: UpdateUserDto){
        return this.authService.updateUser(+id, updatedUserDto)
    }

    @UseGuards(JwtAuthGuard)
    @Patch('update-password')
    updatePassword(@Req() req, @Body() updatePasswordDto: UpdatePasswordDto){
        return this.authService.updatePassword(+req.user.userId,updatePasswordDto)
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Delete('delete-user/:id')
    async deleteUser(@Param('id') id:string){
        return await this.authService.deleteUser(+id)
    }

}
