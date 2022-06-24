import { Module } from '@nestjs/common';
import { HarmService } from './harm.service';
import { HarmResolver } from './harm.resolver';

@Module({
  providers: [HarmResolver, HarmService]
})
export class HarmModule {}
