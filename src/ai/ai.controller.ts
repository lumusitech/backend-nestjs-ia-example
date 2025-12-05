import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { AiService } from './ai.service';
import { OrthographyDto, ProsConsDiscussesDto } from './dtos';
import { OrthographyResponse } from './use-cases';
import { Response } from 'express';

@Controller('ai')
export class IaController {
  constructor(private readonly aiService: AiService) {}

  @Post('orthography-check')
  async orthographyCheck(
    @Body() orthographyDto: OrthographyDto,
  ): Promise<OrthographyResponse> {
    return await this.aiService.orthographyCheck(orthographyDto);
  }

  @Post('pros-cons-discusses')
  async prosConsDiscusses(@Body() prosConsDiscussesDto: ProsConsDiscussesDto) {
    return await this.aiService.prosConsDiscusses(prosConsDiscussesDto);
  }

  @Post('pros-cons-discusses-stream')
  async prosConsDiscussesStream(
    @Body() prosConsDiscussesDto: ProsConsDiscussesDto,
    @Res() response: Response,
  ) {
    const stream =
      await this.aiService.prosConsDiscussesStream(prosConsDiscussesDto);

    response.setHeader('Content-Type', 'application/json');
    response.status(HttpStatus.OK);

    for await (const chunk of stream) {
      const piece = chunk.choices[0].delta.content ?? '';

      response.write(piece);
    }

    response.end();
  }
}
