import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './User.entity';
import { Request } from 'src/requests/entities/request.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Request])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
