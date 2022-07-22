import { Resolver, Query } from '@nestjs/graphql';
import { Harm } from './entities/harm.entity';
import { HarmService } from './harm.service';

@Resolver(() => Harm)
export class HarmResolver {
  constructor(private readonly harmService: HarmService) {}

  @Query(() => [Harm])
  harms(): Promise<Harm[]> {
    return this.harmService.findAllHarms();
  }
}
