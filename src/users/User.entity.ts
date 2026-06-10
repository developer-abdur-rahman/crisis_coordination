import { UserRole } from 'src/common/enums/userRole.enum';
import { Request } from 'src/requests/entities/request.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
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

  @ManyToOne(() => Request, (request) => request.createdBy)
  createdRequests: Request[];

  @ManyToOne(() => Request, (request) => request.claimedBy)
  claimedRequest: Request[];
}
