import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { WorkerService } from './worker.service';
import { Worker } from './entities/worker.entity';
import { UpdateWorkerInput } from './dto/update-worker.input';

@Resolver(() => Worker)
export class WorkerResolver {
  constructor(private readonly workerService: WorkerService) {}

  @Query(() => [Worker])
  workers(): Promise<Worker[]> {
    return this.workerService.findAll();
  }

  @Mutation(() => Worker)
  updateWorker(
    @Args('updateWorkerInput') updateWorkerInput: UpdateWorkerInput,
  ) {
    return this.workerService.update(updateWorkerInput.id, updateWorkerInput);
  }
}
