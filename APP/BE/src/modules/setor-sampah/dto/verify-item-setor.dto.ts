import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class VerifyItemSetorDto {
  @IsNotEmpty()
  kategoriSampahId: string;

  @IsNumber()
  @Min(0)
  beratKgReal: number;
}