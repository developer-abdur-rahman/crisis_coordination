import { Body, Controller, Post } from '@nestjs/common';
import { RegisterDto } from './auth.dto';

@Controller({
  version: '1',
  path: 'auth',
})
export class AuthController {
  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    console.log(registerDto);
    return 'register route';
  }
}
