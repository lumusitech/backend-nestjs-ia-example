import { Body, Controller, Post } from '@nestjs/common';
import { IaService } from './ia.service';
import { OrthographyDto } from './dtos';
import { OrthographyResponse } from './use-cases';

@Controller('ia')
export class IaController {
  constructor(private readonly iaService: IaService) {}

  @Post('orthography-check')
  async orthographyCheck(
    @Body() orthographyDto: OrthographyDto,
  ): Promise<OrthographyResponse> {
    return await this.iaService.orthographyCheck(orthographyDto);
  }
}
