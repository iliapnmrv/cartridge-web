import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { HarmService } from './harm.service';
import { Harm } from './entities/harm.entity';
import { CreateHarmInput } from './dto/create-harm.input';
import { UpdateHarmInput } from './dto/update-harm.input';

@Resolver(() => Harm)
export class HarmResolver {
  constructor(private readonly harmService: HarmService) {}

  @Mutation(() => Harm)
  createHarm(@Args('createHarmInput') createHarmInput: CreateHarmInput) {
    return this.harmService.create(createHarmInput);
  }

  @Query(() => [Harm], { name: 'harm' })
  findAll() {
    return this.harmService.findAll();
  }

  @Query(() => Harm, { name: 'harm' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.harmService.findOne(id);
  }

  @Mutation(() => Harm)
  updateHarm(@Args('updateHarmInput') updateHarmInput: UpdateHarmInput) {
    return this.harmService.update(updateHarmInput.id, updateHarmInput);
  }

  @Mutation(() => Harm)
  removeHarm(@Args('id', { type: () => Int }) id: number) {
    return this.harmService.remove(id);
  }
}
