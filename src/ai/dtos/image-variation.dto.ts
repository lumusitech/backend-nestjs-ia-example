import { Transform, TransformFnParams } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class ImageVariationDto {
  @Transform(({ value }: TransformFnParams): unknown => {
    return typeof value === 'string' ? value.trim() : value;
  })
  @IsNotEmpty()
  @IsString()
  baseImage: string;
}
