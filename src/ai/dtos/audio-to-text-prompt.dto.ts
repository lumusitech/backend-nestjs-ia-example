import { IsOptional, IsString } from 'class-validator';

export class AudioToTextPromptDto {
  @IsString()
  @IsOptional()
  readonly prompt?: string;
}
