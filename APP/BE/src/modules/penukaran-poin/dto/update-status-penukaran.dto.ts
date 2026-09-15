import { IsIn } from 'class-validator';

export class UpdateStatusPenukaranDto {
  @IsIn(['diproses', 'selesai'])
  status: string;
}