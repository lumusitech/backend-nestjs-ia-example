import { Body, Controller, Get, Post } from '@nestjs/common';
import { SamAssistantService } from './sam-assistant.service';
import { AskDto, GetConversationDto } from './dtos';

@Controller('sam-assistant')
export class SamAssistantController {
  constructor(private readonly samAssistantService: SamAssistantService) {}

  @Post('ask')
  async ask(@Body() askDto: AskDto) {
    return this.samAssistantService.ask(askDto);
  }

  @Get('get-conversation')
  async getConversation(@Body() getConversationDto: GetConversationDto) {
    return this.samAssistantService.getConversation(getConversationDto);
  }
}
