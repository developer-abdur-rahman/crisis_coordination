/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './users.dto';
import { Public } from 'src/decorators/public.decorator';
import { Roles } from 'src/decorators/roles.decorator';
import { UserRole } from 'src/common/enums/userRole.enum';

@Controller({
  version: '1',
  path: 'users',
})
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Post('register')
  async createUser(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.createUser(createUserDto);
  }

  @Roles(UserRole.ADMIN)
  @Get()
  async findAll() {
    return await this.usersService.findAll();
  }

  @Get('me')
  async getProfile(@Request() request) {
    const { password, ...user } = await this.usersService.findOne(
      request?.user?.email,
    );
    return user;
  }

  @Patch()
  async update(@Body() updateUserDto: UpdateUserDto, @Req() request) {
    const user = request.user;
    const body = updateUserDto;

    return await this.usersService.updateUser(user, body);
  }

  @Roles(UserRole.ADMIN)
  @Delete(':id')
  async delete(@Param() param: any) {
    return await this.usersService.delete(param);
  }
}
