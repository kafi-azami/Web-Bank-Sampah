import { IsNotEmpty, MinLength } from 'class-validator';

export class CreateNasabahDto {
  @IsNotEmpty()
  username: string;

  @MinLength(6)
  password: string;

  @IsNotEmpty()
  namaNasabah: string;

  @IsNotEmpty()
  alamat: string;

  @IsNotEmpty()
  telp: string;
}