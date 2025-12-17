import { IsNotEmpty, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class TranslateDto {
  @IsString()
  @Transform(({ value }: { value: string }) => value.trim())
  @IsNotEmpty()
  readonly prompt: string;

  @IsString()
  @Transform(({ value }: { value: string }) => value.trim())
  @IsNotEmpty()
  readonly lang: string;
}
