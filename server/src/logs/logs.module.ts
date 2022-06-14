import { Module } from '@nestjs/common';
import { LogsService } from './logs.service';
import { LogsResolver } from './logs.resolver';

@Module({
  providers: [LogsResolver, LogsService],
})
export class LogsModule {}
