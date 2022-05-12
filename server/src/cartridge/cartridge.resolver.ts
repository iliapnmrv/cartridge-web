import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Cartridge } from './entities/cartridge.entity';
import { CartridgeService } from './cartridge.service';
import { CreateCartridgeInput } from './dto/create-cartridge.input';
import { UpdateCartridgeInput } from './dto/update-cartridge.input';
import { Log } from 'src/logs/entities/log.entity';
import { LogsService } from 'src/logs/logs.service';

@Resolver((of) => Cartridge)
export class CartridgeResolver {
  constructor(
    private сartridgeService: CartridgeService,
    private logsService: LogsService,
  ) {}

  @Query(() => [Cartridge])
  cartridge(): Promise<Cartridge[]> {
    return this.сartridgeService.findAll();
  }

  // @ResolveField(() => [Log])
  // logs(@Parent() cartridge: Cartridge): Promise<Cartridge[]> {
  //   const { id } = cartridge;
  //   return this.logsService.findAll();
  // }

  @Mutation(() => Cartridge)
  createCartridge(
    @Args('createCartridgeInput')
    createCartridgeInput: CreateCartridgeInput,
  ): Promise<Cartridge> {
    return this.сartridgeService.create(createCartridgeInput);
  }

  @Mutation(() => Cartridge)
  updateCartridge(
    @Args('updateCartridgeInput') updateCartridgeInput: UpdateCartridgeInput,
  ) {
    return this.сartridgeService.update(updateCartridgeInput);
  }

  @Mutation(() => Cartridge)
  removeCartridge(@Args('id', { type: () => Int }) id: number) {
    return this.сartridgeService.remove(id);
  }
}
