import { Module } from '@nestjs/common';
import { WorkerService } from './worker.service';
import { WorkerResolver } from './worker.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Harm } from 'src/harm/entities/harm.entity';
import { Worker } from './entities/worker.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Worker, Harm], 'med')],
  providers: [WorkerResolver, WorkerService],
})
export class WorkerModule {}
