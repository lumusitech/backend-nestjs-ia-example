import { Transform, TransformFnParams } from 'class-transformer';
import { IsString } from 'class-validator';

export class ProsConsDiscussesDto {
  @Transform(({ value }: TransformFnParams): unknown => {
    return typeof value === 'string' ? value.trim() : value;
  })
  @IsString()
  readonly prompt: string;
}
