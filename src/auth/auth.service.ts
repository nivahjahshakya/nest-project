import {
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { IsNull, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';

import * as bcrypt from 'bcryptjs';
import { SignInUserDto } from './dto/signin-user.dto';
import { JwtService } from '@nestjs/jwt';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { Task } from 'task/entity/task.entity';
import { Role } from './enum/role.enum';
import { Department } from 'department/entities/department.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
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
        const payload = {
          email: user.email,
          sub: user.id,
          role: user.role,
          departmentId: user.departmentId,
        };
        const accessToken = this.jwtService.sign(payload);
        return accessToken;
      } else {
        throw new UnauthorizedException('Invalid login credentials');
      }
    } else {
      throw new UnauthorizedException('User not found');
    }
  }

  isRoleValid(role: string): boolean {
    return Object.values(Role).includes(role as Role);
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (existingUser)
      throw new ConflictException(
        'User with the provided email already exists',
      );
    const newUser = new User();
    newUser.firstName = createUserDto.firstName;
    newUser.lastName = createUserDto.lastName;
    newUser.email = createUserDto.email;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);
    newUser.password = hashedPassword;
    if (createUserDto.role && createUserDto.role.length > 0) {
      const roles = await Promise.all(
        createUserDto.role.map(async (role) => {
          if (this.isRoleValid(role)) return role;
          else throw new ForbiddenException('Invalid Role');
        }),
      );
      newUser.role = roles;
    }
    if (createUserDto.departmentId) {
      const department = await this.departmentRepository.findOne({
        where: { id: createUserDto.departmentId },
      });
      if (!department)
        throw new NotFoundException(
          `Department with ${createUserDto.departmentId} does not exist`,
        );
      newUser.department = department;
    }
    try {
      return await this.userRepository.save(newUser);
    } catch (error) {
      throw new InternalServerErrorException(
        'Cannot create user: ',
        error.message,
      );
    }
  }

  async getUser(page: number, limit: number, user: User): Promise<Object> {
    if (user.role.includes(Role.DepartmentHead)) {
      const [users, total] = await this.userRepository.findAndCount({
        where: {
          departmentId:
            user.departmentId !== null ? user.departmentId : IsNull(),
        },
        skip: (page - 1) * limit,
        take: limit,
        relations: { tasks: true },
      });
      return {
        data: users,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
      };
    }
    const [users, total] = await this.userRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      relations: { tasks: true },
    });
    return {
      data: users,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
    };
  }

  async findOne(_id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        id: _id,
      },
      relations: { tasks: true },
    });
    if (!user) {
      throw new NotFoundException(`User with id ${_id} not found`);
    }
    return user;
  }

  async updateUser(
    id: number,
    updatedUserDto: UpdateUserDto,
    user: User,
  ): Promise<User> {
    const existingUser = await this.findOne(id);
    if (!existingUser) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    if (user.role.includes(Role.DepartmentHead)) {
      if (user.departmentId !== existingUser.departmentId) {
        throw new ForbiddenException('You cannot update this user');
      }
    }
    if (updatedUserDto.firstName)
      existingUser.firstName = updatedUserDto.firstName;
    if (updatedUserDto.lastName)
      existingUser.lastName = updatedUserDto.lastName;
    if (updatedUserDto.email)
      existingUser.email = updatedUserDto.email ?? existingUser.email;

    if (updatedUserDto.password) {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(updatedUserDto.password, salt);
      existingUser.password = hashedPassword;
    }

    if (updatedUserDto.role && updatedUserDto.role.length > 0) {
      existingUser.role = await Promise.all(
        updatedUserDto.role.map(async (role) => {
          if (this.isRoleValid(role)) return role;
          else throw new ForbiddenException('Invalid Role');
        }),
      );
    }

    if (updatedUserDto.task && updatedUserDto.task.length > 0) {
      existingUser.tasks = await Promise.all(
        updatedUserDto.task.map(async (_id) => {
          const existingTask = await this.taskRepository.findOne({
            where: {
              id: _id,
            },
          });
          if (!existingTask)
            throw new NotFoundException(`Task with id ${_id} not found`);
          return existingTask;
        }),
      );
    }
    if (updatedUserDto.departmentId) {
      const department = await this.departmentRepository.findOne({
        where: { id: updatedUserDto.departmentId },
      });
      if (!department)
        throw new NotFoundException(
          `Department with ${updatedUserDto.departmentId} does not exist`,
        );
      existingUser.department = department;
    }
    try {
      return await this.userRepository.save(existingUser);
    } catch (error) {
      throw new ConflictException(
        'User with the provided email already exists',
      );
    }
  }

  async updatePassword(id: number, updatedPasswordDto: UpdatePasswordDto) {
    const existingUser = await this.findOne(id);
    if (!existingUser) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    const IsValidPassword = await bcrypt.compare(
      updatedPasswordDto.oldPassword,
      existingUser.password,
    );
    if (IsValidPassword) {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(
        updatedPasswordDto.newPassword,
        salt,
      );
      existingUser.password = hashedPassword;
      try {
        await this.userRepository.save(existingUser);
      } catch (error) {
        throw new ConflictException('Password not updated: ', error.message);
      }
      return 'Password updated successfully';
    } else {
      throw new UnauthorizedException('Invalid login credentials');
    }
  }

  async deleteUser(id: number) {
    const existingUser = await this.findOne(id);
    if (!existingUser) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    if (existingUser.role.includes(Role.SuperAdmin)) {
      throw new ForbiddenException('You cannot delete superadmin');
    }
    await this.userRepository.softRemove(existingUser);
    return 'User deleted successfully';
  }
}
