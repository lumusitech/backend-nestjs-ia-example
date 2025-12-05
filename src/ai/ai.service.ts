import { Injectable } from '@nestjs/common';
import {
  orthographyCheckUseCase,
  OrthographyResponse,
  prosConsDiscussesUseCase,
} from './use-cases';
import { OrthographyDto, ProsConsDiscussesDto } from './dtos';
import OpenAI from 'openai';
import { prosConsDiscussesStreamUseCase } from './use-cases/pros-cons-discusses-stream.use-case';

@Injectable()
export class AiService {
  private openai: OpenAI = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  async orthographyCheck(
    orthographyDto: OrthographyDto,
  ): Promise<OrthographyResponse> {
    return await orthographyCheckUseCase(this.openai, {
      prompt: orthographyDto.prompt,
    });
  }

  async prosConsDiscusses({ prompt }: ProsConsDiscussesDto) {
    return await prosConsDiscussesUseCase(this.openai, { prompt });
  }

  async prosConsDiscussesStream({ prompt }: ProsConsDiscussesDto) {
    return await prosConsDiscussesStreamUseCase(this.openai, { prompt });
  }
}
