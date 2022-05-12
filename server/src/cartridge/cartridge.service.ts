import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cartridge } from './entities/cartridge.entity';
import { CreateCartridgeInput } from './dto/create-cartridge.input';

@Injectable()
export class CartridgeService {
  constructor(
    @InjectRepository(Cartridge)
    private cartridgeRepository: Repository<Cartridge>,
  ) {}

  async findAll(): Promise<Cartridge[]> {
    return await this.cartridgeRepository.find();
  }

  async create(createCartridgeInput: CreateCartridgeInput): Promise<Cartridge> {
    const newCartridge = this.cartridgeRepository.create(createCartridgeInput);
    return this.cartridgeRepository.save(newCartridge);
  }
}
