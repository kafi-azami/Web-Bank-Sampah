import { IsNotEmpty, MinLength } from 'class-validator';

export class RegisterAdminDto {
  @IsNotEmpty()
  username: string;

  @MinLength(6)
  password: string;

  @IsNotEmpty()
  namaUnit: string;

  @IsNotEmpty()
  namaPengelola: string;

  @IsNotEmpty()
  telp: string;
}