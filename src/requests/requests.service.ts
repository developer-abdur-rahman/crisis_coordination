import { Injectable } from '@nestjs/common';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { Repository } from 'typeorm';
import { User } from 'src/users/User.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from './entities/request.entity';
import { RequestStatus } from 'src/common/enums/RequestStatus.enum';

@Injectable()
export class RequestsService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Request)
    private readonly requestRepo: Repository<Request>,
  ) {}

  async create(createRequestDto: CreateRequestDto, user) {
    const requestPromise = this.requestRepo.create({
      title: createRequestDto.title,
      description: createRequestDto.description,
      location: createRequestDto.location,
      priority: createRequestDto.priority,
      status: RequestStatus.OPEN,
      createdById: user.sub,
    });

    const request = await this.requestRepo.save(requestPromise);

    return request;
  }

  findAll() {
    return `This action returns all requests`;
  }

  findOne(id: number) {
    return `This action returns a #${id} request`;
  }

  update(id: number, updateRequestDto: UpdateRequestDto) {
    return `This action updates a #${id} request`;
  }

  remove(id: number) {
    return `This action removes a #${id} request`;
  }
}
