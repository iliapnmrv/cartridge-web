import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository, Like, Not, IsNull } from 'typeorm';
import { FilterWorkersInput } from './dto/filter-workers.input';
import { UpdateWorkerInput } from './dto/update-worker.input';
import { Worker } from './entities/worker.entity';
import { IShifts } from './worker.resolver';

@Injectable()
export class WorkerService {
  constructor(
    @InjectRepository(Worker, 'med')
    private workerRepository: Repository<Worker>,
  ) {}

  async findAll(offset: number, limit: number): Promise<Worker[]> {
    const workers = await this.workerRepository.find({
      relations: { harm: true },
      order: { name: 1, isException: 1 },
      skip: offset,
      take: limit,
      // order: { isException: 1, name: 1 },
    });
    return workers;
  }

  async findAllShifts(): Promise<IShifts[]> {
    return await this.workerRepository
      .createQueryBuilder()
      .select('shift')
      .distinct(true)
      .getRawMany();
  }

  async filterWorkers(filters: FilterWorkersInput): Promise<Worker[]> {
    const { name, shifts, date } = filters;
    const workers = await this.workerRepository.find({
      where: {
        name: Like(`%${name}%`),
        shift: shifts && shifts.length ? In([shifts]) : Not(IsNull()),
      },
      relations: { harm: true },
    });

    return workers;
  }

  async update(
    id: number,
    updateWorkerInput: UpdateWorkerInput,
  ): Promise<Worker> {
    const worker = await this.workerRepository.update(id, {
      ...updateWorkerInput,
    });

    return await this.workerRepository.findOne({
      where: { id },
      relations: { harm: true },
    });
  }
}
