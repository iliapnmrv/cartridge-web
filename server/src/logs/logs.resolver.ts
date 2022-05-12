import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { LogsService } from './logs.service';
import { Log } from './entities/log.entity';
import { CreateLogInput } from './dto/create-log.input';
import { UpdateLogInput } from './dto/update-log.input';

@Resolver(() => Log)
export class LogsResolver {
  constructor(private readonly logsService: LogsService) {}

  @Mutation(() => Log)
  createLog(@Args('createLogInput') createLogInput: CreateLogInput) {
    return this.logsService.create(createLogInput);
  }

  @Query(() => [Log], { name: 'logs' })
  findAll() {
    return this.logsService.findAll();
  }

  @Query(() => Log, { name: 'log' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.logsService.findOne(id);
  }

  @Mutation(() => Log)
  updateLog(@Args('updateLogInput') updateLogInput: UpdateLogInput) {
    return this.logsService.update(updateLogInput.id, updateLogInput);
  }

  @Mutation(() => Log)
  removeLog(@Args('id', { type: () => Int }) id: number) {
    return this.logsService.remove(id);
  }
}
