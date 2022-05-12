import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Cartridge } from './entities/cartridge.entity';
import { CartridgeService } from './cartridge.service';
import { CreateCartridgeInput } from './dto/create-cartridge.input';

@Resolver((of) => Cartridge)
export class CartridgeResolver {
  constructor(private сartridgeService: CartridgeService) {}

  @Query((returns) => [Cartridge])
  cartridge(): Promise<Cartridge[]> {
    return this.сartridgeService.findAll();
  }

  @Mutation((returns) => Cartridge)
  createCartridge(
    @Args('createCartridgeInput')
    createCartridgeInput: CreateCartridgeInput,
  ): Promise<Cartridge> {
    return this.сartridgeService.create(createCartridgeInput);
  }
}
