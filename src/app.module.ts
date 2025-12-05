import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { IaModule } from './ai/ai.module';

@Module({
  imports: [ConfigModule.forRoot(), IaModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
