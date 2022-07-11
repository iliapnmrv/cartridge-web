import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Worker } from 'src/worker/entities/worker.entity';
import { Harm } from './entities/harm.entity';
import { HarmResolver } from './harm.resolver';
import { HarmService } from './harm.service';

@Module({
  imports: [TypeOrmModule.forFeature([Worker, Harm], 'med')],
  providers: [HarmResolver, HarmService],
})
export class HarmModule {}
