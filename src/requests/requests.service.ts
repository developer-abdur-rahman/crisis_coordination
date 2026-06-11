import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { Repository } from 'typeorm';
import { User } from 'src/users/User.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from './entities/request.entity';
import { RequestStatus } from 'src/common/enums/RequestStatus.enum';
import { UserRole } from 'src/common/enums/userRole.enum';

@Injectable()
export class RequestsService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Request)
    private readonly requestRepo: Repository<Request>,
  ) {}

  async create(createRequestDto: CreateRequestDto, user) {
    const userData = await this.userRepo.findOneBy({ id: user.sub });

    if (!userData || userData.role !== UserRole.VICTIM)
      throw new HttpException(
        'User does not have the permission',
        HttpStatus.FORBIDDEN,
      );

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

  async findAll(user) {
    const query = this.requestRepo
      .createQueryBuilder('request')
      .leftJoinAndSelect('request.createdBy', 'createdBy')
      .leftJoinAndSelect('request.claimedBy', 'claimedBy');

    switch (user.role) {
      case UserRole.VOLUNTEER:
        query.where('request.status = :status', {
          status: RequestStatus.OPEN,
        });
        break;

      case UserRole.VICTIM:
        query.where('request.createdById = :userId', {
          userId: user.sub,
        });
        break;

      case UserRole.ADMIN:
        break;
    }

    return query.getMany();
  }

  async claimRequest(user, id) {
    const request = await this.requestRepo.findOneBy({ id });

    if (request?.status !== RequestStatus.OPEN)
      throw new HttpException(
        'This request already claimed',
        HttpStatus.BAD_REQUEST,
      );

    request.status = RequestStatus.CLAIMED;
    request.claimedById = user.sub;

    await this.requestRepo.save(request);
  }

  async startRequest(user, id) {
    const request = await this.requestRepo.findOneBy({ id });

    if (request?.status !== RequestStatus.CLAIMED)
      throw new HttpException(
        'This request Does not claimed yet or already resolved.',
        HttpStatus.BAD_REQUEST,
      );

    request.status = RequestStatus.IN_PROGRESS;

    await this.requestRepo.save(request);
    return true;
  }

  async resolveRequest(user, id) {
    const request = await this.requestRepo.findOneBy({ id });

    console.log({ request: request?.status });

    if (request?.status !== RequestStatus.IN_PROGRESS)
      throw new HttpException(
        'This request Does not start yet',
        HttpStatus.BAD_REQUEST,
      );
    if (request.claimedById !== user.sub)
      throw new HttpException(
        'You do not anuthz to resolve this request',
        HttpStatus.BAD_REQUEST,
      );

    request.status = RequestStatus.IN_PROGRESS;

    await this.requestRepo.save(request);
    return true;
  }

  findOne(id: number) {
    return `This action returns a #${id} request`;
  }

  async update(id: string, updateRequestDto: UpdateRequestDto, user) {
    const request = await this.requestRepo.findOneBy({ id });

    if (request?.createdById !== user.sub && user.role !== UserRole.ADMIN)
      throw new HttpException("You aren't authz", HttpStatus.BAD_REQUEST);

    if (request?.status && user.role !== UserRole.ADMIN)
      throw new HttpException(
        "You can't change the status",
        HttpStatus.BAD_REQUEST,
      );

    const updatedRequest = await this.requestRepo.update(
      { id },
      { ...updateRequestDto },
    );

    return updatedRequest;
  }

  remove(id: number) {
    return `This action removes a #${id} request`;
  }
}
