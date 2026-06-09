import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  register() {
    console.log('Registering user...');
  }
}
