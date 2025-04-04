import { User } from 'auth/entity/user.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Department {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ unique: true })
  code: string;

  @Column({ nullable: true, unique: true })
  phone: string;

  @Column({ nullable: true , unique: true})
  email: string;

  @Column({ nullable: true })
  location: string;

  @OneToMany(() => User, (user) => user.department, {cascade: true})
  users: User[];

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

  @DeleteDateColumn({select: false,})
  deleted_at: Date;
}
