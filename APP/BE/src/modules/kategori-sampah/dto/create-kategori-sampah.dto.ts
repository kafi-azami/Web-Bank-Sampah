import { IsIn, IsNotEmpty, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateKategoriSampahDto {
  @IsNotEmpty()
  namaKategori: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  hargaPerKg: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  poinPerKg: number;

  @IsIn(['plastik', 'kertas', 'logam', 'kaca'])
  jenis: string;
}