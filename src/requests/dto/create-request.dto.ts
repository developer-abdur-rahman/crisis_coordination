import {
  IsDefined,
  IsEnum,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { RequestPriority } from 'src/common/enums/requestPriority.enum';

export class CreateRequestDto {
  @IsDefined()
  @IsString()
  @MinLength(5)
  @MaxLength(50)
  title: string;

  @IsString()
  @MaxLength(300)
  description: string;

  @IsDefined()
  @IsString()
  @MaxLength(200)
  location: string;

  @IsEnum(RequestPriority)
  priority: RequestPriority;
}
