import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';

import * as bcrypt from 'bcryptjs';
import { SignInUserDto } from './dto/signin-user.dto';
import { JwtService } from '@nestjs/jwt';
import { NotFoundError } from 'rxjs';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}
  
  async signIn(signInUserDto: SignInUserDto): Promise<string> {
    const user = await this.userRepository.findOne({
      where: { email: signInUserDto.email },
    });

    if (user) {
      const IsValidPassword = await bcrypt.compare(
        signInUserDto.password,
        user.password,
      );
      if (IsValidPassword) {
        const payload = { email: user.email, sub: user.id, role: user.role };
        const accessToken = this.jwtService.sign(payload);
        return accessToken;
      }else{
        throw new UnauthorizedException('Invalid login credentials')
      }
    }else{
        throw new UnauthorizedException('User not found')
    }
  }

  async createUser(createUserDto: CreateUserDto): Promise<string> {
    const newUser = new User();
    newUser.email = createUserDto.email;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);
    newUser.password = hashedPassword;

    if(createUserDto.role){
      newUser.role = createUserDto.role;
    }
    try {
      await this.userRepository.save(newUser);
      return 'User successfully created';
    } catch (error) {
      throw new ConflictException('Email already exists');
    }
  }

  getUser(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(_id:number):Promise<User>{
    const user= await this.userRepository.findOne({where: {
      id: _id
    }})
    if(!user){
      throw new NotFoundException(`User with id ${_id} not found`)
    }
    return user
  }

}
