import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Cartridge } from './entities/cartridge.entity';
import { CartridgeService } from './cartridge.service';
import { CreateCartridgeInput } from './dto/create-cartridge.input';
import { UpdateCartridgeInput } from './dto/update-cartridge.input';

@Resolver((of) => Cartridge)
export class CartridgeResolver {
  constructor(
    private сartridgeService: CartridgeService, // private logsService: LogsService,
  ) {}

  @Query(() => [Cartridge])
  cartridge(): Promise<Cartridge[]> {
    return this.сartridgeService.findAll();
  }

  @Query(() => Cartridge, { nullable: true })
  findByName(
    @Args('name', { type: () => String }) name: string,
  ): Promise<Cartridge> {
    console.log(name);

    return this.сartridgeService.findByName(name);
  }

  @Query(() => [Cartridge])
  searchCartridges(
    @Args('field', { type: () => String }) field: string,
  ): Promise<Cartridge[]> {
    console.log(field);

    return this.сartridgeService.search(field);
  }

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

  @Mutation(() => String)
  removeCartridge(@Args('id', { type: () => Int }) id: number) {
    return this.сartridgeService.remove(id);
  }
}
