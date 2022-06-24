import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateWorkerInput } from './dto/update-worker.input';
import { Worker } from './entities/worker.entity';

@Injectable()
export class WorkerService {
  constructor(
    @InjectRepository(Worker, 'med')
    private workerRepository: Repository<Worker>,
  ) {}

  async findAll(): Promise<Worker[]> {
    return await this.workerRepository.find({
      order: { name: 1 },
    });
  }

  async update(id: number, updateWorkerInput: UpdateWorkerInput) {
    return `This action updates a #${id} worker`;
  }
}
