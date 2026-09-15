import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginMakerDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}