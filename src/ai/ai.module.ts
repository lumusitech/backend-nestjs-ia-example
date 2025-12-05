import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { IaController } from './ai.controller';

@Module({
  controllers: [IaController],
  providers: [AiService],
})
export class IaModule {}
