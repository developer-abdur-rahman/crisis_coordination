import { HttpException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './users.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './User.entity';
import { Repository } from 'typeorm';
import { UserRole } from 'src/common/enums/userRole.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    if (
      createUserDto.role === UserRole.ADMIN ||
      createUserDto.role === UserRole.COORDINATOR
    ) {
      throw new HttpException('Invalid user role', 400);
    }

    const user = this.userRepo.create({
      name: createUserDto.name,
      email: createUserDto.email,
      password: createUserDto.password,
      role: createUserDto.role,
    });
    return await this.userRepo.save(user);
  }
}
