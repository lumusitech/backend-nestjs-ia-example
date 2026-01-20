import { Injectable } from '@nestjs/common';
import { AskDto } from './dtos';
import { conversationUseCase } from './use-cases';
import OpenAI from 'openai';

@Injectable()
export class SamAssistantService {
  private openai: OpenAI = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  async ask({ prompt, conversationId }: AskDto) {
    return conversationUseCase(this.openai, { prompt, conversationId });
  }
}
