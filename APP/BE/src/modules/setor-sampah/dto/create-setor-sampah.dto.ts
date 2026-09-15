import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { ItemSetorDto } from './item-setor.dto.js';

export class CreateSetorSampahDto {
  @IsDateString()
  tanggal: string;

  @IsOptional()
  catatan?: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ItemSetorDto)
  items: ItemSetorDto[];
}