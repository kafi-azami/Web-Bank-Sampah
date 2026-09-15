import { Type } from 'class-transformer';
import {
  IsArray,
  IsIn,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { VerifyItemSetorDto } from './verify-item-setor.dto.js';

export class VerifySetorSampahDto {
  @IsIn(['diverifikasi', 'ditolak', 'selesai'])
  status: string;

  @IsOptional()
  catatanAdmin?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VerifyItemSetorDto)
  itemsReal?: VerifyItemSetorDto[];
}