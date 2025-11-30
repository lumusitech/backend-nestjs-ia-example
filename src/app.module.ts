import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { IaModule } from './ia/ia.module';

@Module({
  imports: [ConfigModule.forRoot(), IaModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
