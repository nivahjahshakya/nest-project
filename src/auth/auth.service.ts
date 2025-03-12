import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';

import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async signUp(createUserDto: CreateUserDto): Promise<string> {
    const newUser = new User();
    newUser.email = createUserDto.email;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);
    newUser.password = hashedPassword;

    try {
      await this.userRepository.save(newUser);
      return "User successfully created"
    } catch (error) {
      throw new ConflictException('Email already exists');
    }
  }
}
