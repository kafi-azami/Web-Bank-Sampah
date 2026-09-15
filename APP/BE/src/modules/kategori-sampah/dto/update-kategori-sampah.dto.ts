import { PartialType } from '@nestjs/mapped-types';
import { CreateKategoriSampahDto } from './create-kategori-sampah.dto.js';

export class UpdateKategoriSampahDto extends PartialType(CreateKategoriSampahDto) {}