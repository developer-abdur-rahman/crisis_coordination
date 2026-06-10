/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './users.dto';
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

    const { password, ...user } = await this.userRepo.save(userPromise);
    return user;
  }

  async findAll() {
    const users = await this.userRepo.find();
    return users;
  }

  async findOne(email: string) {
    if (!email)
      throw new HttpException(
        'Email does not provided',
        HttpStatus.BAD_REQUEST,
      );

    const user = await this.userRepo.findOne({
      where: { email: email },
    });

    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    return user;
  }

  async updateUser(user, body: UpdateUserDto) {
    if (user.role !== UserRole.ADMIN && body.role)
      throw new HttpException(
        "You can't change your role dude.",
        HttpStatus.BAD_REQUEST,
      );

    if (body.email)
      throw new HttpException(
        "You can't change these fields.",
        HttpStatus.BAD_REQUEST,
      );

    const updatedUser = await this.userRepo.update(
      { id: user.sub },
      { ...body },
    );

    return updatedUser;
  }

  async delete(param) {
    await this.userRepo.delete({ id: param.id });
    return true;
  }
}
