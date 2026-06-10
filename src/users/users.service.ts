import { HttpException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './users.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './User.entity';
import { Repository } from 'typeorm';
import { UserRole } from 'src/common/enums/userRole.enum';
import bcrypt from 'bcrypt';

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

    const salt = await bcrypt.genSalt();

    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    const userPromise = this.userRepo.create({
      name: createUserDto.name,
      email: createUserDto.email,
      password: hashedPassword,
      role: createUserDto.role,
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...user } = await this.userRepo.save(userPromise);
    return user;
  }

  async findOne(email: string) {
    return await this.userRepo.findOne({ where: { email: email } });
  }
}
