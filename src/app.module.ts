import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AiModule } from './ai/ai.module';
import { SamAssistantModule } from './sam-assistant/sam-assistant.module';

@Module({
  imports: [ConfigModule.forRoot(), AiModule, SamAssistantModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
