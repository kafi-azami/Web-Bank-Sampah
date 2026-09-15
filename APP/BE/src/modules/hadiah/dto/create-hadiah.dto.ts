import { IsNotEmpty, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateHadiahDto {
  @IsNotEmpty()
  namaHadiah: string;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  poinDibutuhkan: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  stok: number;
}