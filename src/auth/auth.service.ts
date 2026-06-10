import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LoginDto } from 'src/auth/auth.dto';
import { UsersService } from 'src/users/users.service';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findOne(loginDto.email);

    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
    }

    const isMatched = await bcrypt.compare(
      loginDto.password,
      user?.password as string,
    );

    if (isMatched === false) {
      throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
    }

    const payload = { sub: user?.id, email: user?.email };

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '4d',
      secret: this.configService.get('ACCESS_TOKEN'),
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '4d',
      secret: this.configService.get('REFRESH_TOKEN'),
    });

    return { accessToken, refreshToken };
  }
}
