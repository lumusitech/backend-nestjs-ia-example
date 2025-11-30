import { Injectable } from '@nestjs/common';
import { orthographyCheckUseCase, OrthographyResponse } from './use-cases';
import { OrthographyDto } from './dtos';
import OpenAI from 'openai';

@Injectable()
export class IaService {
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
}
