import { PartialType } from '@nestjs/mapped-types';
import { CreateHadiahDto } from './create-hadiah.dto.js';

export class UpdateHadiahDto extends PartialType(CreateHadiahDto) {}