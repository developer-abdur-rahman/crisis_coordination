import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { RequestsService } from './requests.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { UserRole } from 'src/common/enums/userRole.enum';

@Controller({
  version: '1',
  path: 'requests',
})
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

  @Roles(UserRole.VICTIM)
  @Post()
  async create(@Body() createRequestDto: CreateRequestDto, @Req() request) {
    const user = request.user;
    return await this.requestsService.create(createRequestDto, user);
  }

  @Roles(UserRole.ADMIN, UserRole.COORDINATOR, UserRole.VOLUNTEER)
  @Get()
  async findAll(@Req() request) {
    const user = request.user;
    return await this.requestsService.findAll(user);
  }

  @Roles(UserRole.VOLUNTEER)
  @Post('/claim/:id')
  async claimRequest(@Req() request) {
    const id = request?.params?.id;
    const user = request.user;
    return await this.requestsService.claimRequest(user, id);
  }

  @Roles(UserRole.VOLUNTEER, UserRole.ADMIN, UserRole.COORDINATOR)
  @Post('/start/:id')
  async startRequest(@Req() request) {
    const id = request?.params?.id;
    const user = request.user;
    return await this.requestsService.startRequest(user, id);
  }

  @Roles(UserRole.VOLUNTEER)
  @Post('/resolve/:id')
  async resolveRequest(@Req() request) {
    const id = request?.params?.id;
    const user = request.user;
    return await this.requestsService.resolveRequest(user, id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.requestsService.findOne(+id);
  }

  @Roles(UserRole.ADMIN, UserRole.VICTIM)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateRequestDto: UpdateRequestDto,
    @Req() request,
  ) {
    const user = request.user;
    return await this.requestsService.update(id, updateRequestDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.requestsService.remove(+id);
  }
}
