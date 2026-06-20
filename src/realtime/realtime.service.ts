import { Injectable } from '@nestjs/common';
import { RealtimeGateway } from './realtime.gateway';
import { UserRole } from 'src/common/enums/userRole.enum';

@Injectable()
export class RealtimeService {
  constructor(private readonly realtimeGateway: RealtimeGateway) {}

  notifyRequestCreation(request) {
    this.realtimeGateway.server
      .to(`role:${UserRole.COORDINATOR}`)
      .to(`role:${UserRole.VOLUNTEER}`)
      .to(`role:${UserRole.ADMIN}`)
      .emit('request.created', request);
  }

  notifyRequestClaimed(request) {
    console.log(request);
    this.realtimeGateway.server
      .to(`user:${request.createdById}`)
      .to(`role:${UserRole.ADMIN}`)
      .emit('request.claimed', request);
  }
}
