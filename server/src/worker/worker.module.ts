import { Module } from '@nestjs/common';
import { WorkerService } from './worker.service';
import { WorkerResolver } from './worker.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Worker } from './entities/worker.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Worker])],
  providers: [WorkerResolver, WorkerService],
})
export class WorkerModule {}
