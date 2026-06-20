import { IsDefined, IsEmail } from 'class-validator';

export class LoginDto {
  @IsDefined()
  @IsEmail()
  email: string;

  @IsDefined()
  password: string;
}
