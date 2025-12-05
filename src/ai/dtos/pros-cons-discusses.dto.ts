import { IsString } from 'class-validator';

export class ProsConsDiscussesDto {
  @IsString()
  readonly prompt: string;
}
