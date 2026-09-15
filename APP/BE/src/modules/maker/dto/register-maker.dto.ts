import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterMakerDto {
  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;

  @IsNotEmpty()
  namaSiswa: string;

  @IsNotEmpty()
  kelas: string;

  @IsNotEmpty()
  namaApp: string;
}