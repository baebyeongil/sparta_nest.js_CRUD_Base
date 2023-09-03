import { IsNumber, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  readonly userId: string;

  @IsString()
  readonly name: string;

  @IsNumber()
  readonly password: number;
}
