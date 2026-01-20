import { Injectable } from '@nestjs/common';
import { AskDto, GetConversationDto } from './dtos';
import { conversationUseCase, getConversationUseCase } from './use-cases';
import OpenAI from 'openai';

@Injectable()
export class SamAssistantService {
  private openai: OpenAI = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  async ask({ prompt, conversationId }: AskDto) {
    return conversationUseCase(this.openai, { prompt, conversationId });
  }

  async getConversation({ conversationId }: GetConversationDto) {
    return getConversationUseCase({ conversationId });
  }
}
