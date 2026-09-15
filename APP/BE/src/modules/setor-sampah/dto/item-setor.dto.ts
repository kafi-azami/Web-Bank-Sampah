import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class ItemSetorDto {
  @IsNotEmpty()
  kategoriSampahId: string;

  @IsNumber()
  @Min(0.1)
  beratKg: number;
}