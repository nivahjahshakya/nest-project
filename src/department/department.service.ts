import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Department } from './entities/department.entity';
import { Repository } from 'typeorm';
import { User } from 'auth/entity/user.entity';
import { Role } from 'auth/enum/role.enum';

@Injectable()
export class DepartmentService {
  constructor(
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async create(createDepartmentDto: CreateDepartmentDto): Promise<Department>{
    const existingDepartment = await this.departmentRepository.findOne({
      where: { code: createDepartmentDto.code },
    });
    if (existingDepartment)
      throw new ConflictException(
        `Department with code ${createDepartmentDto.code} already exists`,
      );

    const department = new Department();
    department.name = createDepartmentDto.name;
    department.code = createDepartmentDto.code;

    if (createDepartmentDto.description)
      department.description = createDepartmentDto.description;
    if (createDepartmentDto.phone) department.phone = createDepartmentDto.phone;
    if (createDepartmentDto.email) department.email = createDepartmentDto.email;
    if (createDepartmentDto.location)
      department.location = createDepartmentDto.location;
    try {
      return await this.departmentRepository.save(department);
    } catch (error) {
      throw new ConflictException(`Department not created: ${error.message}`);
    }
  }

  async findAll() :Promise<Department[]>{
    try {
      return await this.departmentRepository.find();
    } catch (error) {
      throw new NotFoundException(`Departments not found`);
    }
  }

  async findOne(id: number): Promise<Department> {
    const department = await this.departmentRepository.findOne({
      where: { id },
    });
    if (!department) throw new NotFoundException(`Department with id ${id} not found`);
    return department;
  }

  async update(id: number, updateDepartmentDto: UpdateDepartmentDto): Promise<string> {
    const department = await this.findOne(id)
    if(!department) throw new NotFoundException(`Department with id ${id} not found`)
      if(updateDepartmentDto.code){
        if(department.code!==updateDepartmentDto.code){
          const existingDepartment = await this.departmentRepository.findOne({where: {code: updateDepartmentDto.code}})
          if (existingDepartment)
            throw new ConflictException(`Department with code ${updateDepartmentDto.code} already exists`)
          department.code = updateDepartmentDto.code
        } 
      }
      if(updateDepartmentDto.name){
        department.name = updateDepartmentDto.name
      }
      if(updateDepartmentDto.description){
        department.description = updateDepartmentDto.description
      }
      if(updateDepartmentDto.email){
        department.email = updateDepartmentDto.email
      }
      if(updateDepartmentDto.phone){
        department.phone = updateDepartmentDto.phone
      }
      if(updateDepartmentDto.location){
        department.location = updateDepartmentDto.location
      }
      try{
        await this.departmentRepository.save(department)
        return 'Department updated successfully'
      }catch(error){
        throw new ConflictException(`Department not updated: ${error.message}`);
      }
  }

  async remove(id: number): Promise<string> {
    const department = await this.findOne(id)
    if(!department) throw new NotFoundException(`Department with id ${id} not found`)
      const users = await this.userRepository.find({where: {departmentId: id}})
      if(users.length>0){
        users.map(async (user)=>{
          user.department = null
          user.departmentId = null
          if(user.role.includes(Role.DepartmentHead)){
            user.role = [...user.role.filter((role)=>role!==Role.DepartmentHead)]
            if(user.role.length===0){
              user.role = [Role.User]
            }
          }
          await this.userRepository.save(user)
        })
      }
    await this.departmentRepository.softRemove(department)
    return 'Department deleted successfully'
  }
}
