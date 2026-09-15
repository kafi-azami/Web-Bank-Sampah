import { IsNotEmpty } from 'class-validator';

export class CreatePenukaranPoinDto {
  @IsNotEmpty()
  hadiahId: string;
}