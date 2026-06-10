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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.requestsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRequestDto: UpdateRequestDto) {
    return this.requestsService.update(+id, updateRequestDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.requestsService.remove(+id);
  }
}
