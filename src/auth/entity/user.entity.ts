import { Role } from 'auth/enum/role.enum';
import { IsEnum } from 'class-validator';
import { Department } from 'department/entities/department.entity';
import { Task } from 'task/entity/task.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: [Role.User],
    array: true,
  })
  @IsEnum(Role, { message: 'Invalid role' })
  role: Role[];

  @ManyToOne(() => Department, (department) => department.users, {
    nullable: true,
  })
  @JoinColumn({ name: 'department_id' })
  department: Department|null;

  @Column({ name: 'department_id', type: 'int', nullable: true })
  departmentId: number|null;

  @OneToMany(() => Task, (task) => task.user, { cascade: true })
  tasks: Task[];

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    select: false,
  })
  created_at: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
    select: false,
  })
  updated_at: Date;

  @DeleteDateColumn({ select: false })
  deleted_at: Date;
}
