import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { WorkerService } from './worker.service';
import { Worker } from './entities/worker.entity';
import { UpdateWorkerInput } from './dto/update-worker.input';
import { FilterWorkersInput } from './dto/filter-workers.input';

export type IShifts = {
  shift: string;
};
@Resolver(() => Worker)
export class WorkerResolver {
  constructor(private readonly workerService: WorkerService) {}

  @Query(() => [Worker])
  workers(
    @Args('offset', { type: () => Int, nullable: true })
    offset: number,
    @Args('limit', { type: () => Int, nullable: true })
    limit: number,
  ): Promise<Worker[]> {
    return this.workerService.findAll(offset, limit);
  }

  @Query(() => [Worker])
  shifts(): Promise<IShifts[]> {
    return this.workerService.findAllShifts();
  }

  @Query(() => [Worker], { nullable: true })
  filterWorkers(
    @Args('filters', { type: () => FilterWorkersInput, nullable: true })
    filters: FilterWorkersInput,
  ): Promise<Worker[]> {
    return this.workerService.filterWorkers(filters);
  }

  @Mutation(() => Worker)
  updateWorker(
    @Args('updateWorkerInput') updateWorkerInput: UpdateWorkerInput,
  ) {
    return this.workerService.update(updateWorkerInput.id, updateWorkerInput);
  }
}
