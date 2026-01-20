import { Body, Controller, Post } from '@nestjs/common';
import { SamAssistantService } from './sam-assistant.service';
import { AskDto } from './dtos';

@Controller('sam-assistant')
export class SamAssistantController {
  constructor(private readonly samAssistantService: SamAssistantService) {}

  @Post('ask')
  async ask(@Body() askDto: AskDto) {
    return this.samAssistantService.ask(askDto);
  }
}
