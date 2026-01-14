import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';

export class AudioToTextDto {
  // Transform always run before validation, no matter decorators order
  @Transform(({ value }: TransformFnParams): unknown => {
    return typeof value === 'string' ? value.trim() : value;
  })
  @IsString()
  @IsOptional()
  readonly prompt?: string;

  @IsString()
  @Transform(({ value }: { value: any }): unknown =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsNotEmpty()
  readonly audioFile: Express.Multer.File;
}
