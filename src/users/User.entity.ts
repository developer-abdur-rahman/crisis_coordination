import { UserRole } from 'src/common/enums/userRole.enum';
import { Request } from 'src/requests/entities/request.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.VICTIM })
  role: UserRole;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Request, (request) => request.createdBy)
  createdRequests: Request[];

  @OneToMany(() => Request, (request) => request.claimedBy)
  claimedRequest: Request[];
}
