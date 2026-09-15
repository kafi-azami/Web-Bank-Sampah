import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateNasabahDto {
  @IsOptional()
  @IsNotEmpty()
  namaNasabah?: string;

  @IsOptional()
  @IsNotEmpty()
  alamat?: string;

  @IsOptional()
  @IsNotEmpty()
  telp?: string;
}