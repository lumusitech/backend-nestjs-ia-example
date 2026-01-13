import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';

export class TextToAudioDto {
  // Transform always run before validation, no matter decorators order
  @Transform(({ value }: TransformFnParams): unknown => {
    return typeof value === 'string' ? value.trim() : value;
  })
  @IsString()
  @IsNotEmpty()
  readonly prompt: string;

  @IsString()
  @Transform(({ value }: { value: any }): unknown =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsOptional()
  readonly voice?: string;
}
