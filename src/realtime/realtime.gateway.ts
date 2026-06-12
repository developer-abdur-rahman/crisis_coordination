import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { HttpException, HttpStatus } from '@nestjs/common';

@WebSocketGateway(3001, {
  cors: {
    origin: '*',
  },
})
export class RealtimeGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(private readonly jwtService: JwtService) {}

  async handleConnection(client: Socket) {
    try {
      const token = client?.handshake.query.accessToken as string;

      if (!token)
        throw new HttpException('token does not found', HttpStatus.BAD_REQUEST);

      const payload = await this.jwtService.verifyAsync(token);

      client.data.user = payload;

      console.log(payload);

      // User-specific room
      await client.join(`user:${payload.sub}`);

      // Role-specific room
      await client.join(`role:${payload.role}`);

      console.log(`User ${payload.sub} connected`);
    } catch {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`Socket disconnected: ${client.id}`);
  }

  /**
   * Join an issue room
   */
  @SubscribeMessage('join-issue')
  handleJoinIssue(
    @ConnectedSocket() client: Socket,
    @MessageBody() issueId: string,
  ) {
    client.join(`issue:${issueId}`);

    return {
      success: true,
    };
  }

  /**
   * Leave an issue room
   */
  @SubscribeMessage('leave-issue')
  handleLeaveIssue(
    @ConnectedSocket() client: Socket,
    @MessageBody() issueId: string,
  ) {
    client.leave(`issue:${issueId}`);

    return {
      success: true,
    };
  }
}
