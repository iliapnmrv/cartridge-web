import { Module } from '@nestjs/common';
import { Cartridge } from './entities/cartridge.entity';
import { CartridgeService } from './cartridge.service';
import { CartridgeResolver } from './cartridge.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Cartridge])],
  providers: [CartridgeService, CartridgeResolver],
})
export class CartridgeModule {}
