import { Body, Controller, Post } from '@nestjs/common';
import { AiService } from './ai.service';
import { OrthographyDto } from './dtos';
import { OrthographyResponse } from './use-cases';

@Controller('ai')
export class IaController {
  constructor(private readonly aiService: AiService) {}

  @Post('orthography-check')
  async orthographyCheck(
    @Body() orthographyDto: OrthographyDto,
  ): Promise<OrthographyResponse> {
    return await this.aiService.orthographyCheck(orthographyDto);
  }
}
