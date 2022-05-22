import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cartridge } from './entities/cartridge.entity';
import { CreateCartridgeInput } from './dto/create-cartridge.input';
import { UpdateCartridgeInput } from './dto/update-cartridge.input';
import { Log } from 'src/logs/entities/log.entity';

@Injectable()
export class CartridgeService {
  constructor(
    @InjectRepository(Cartridge)
    private cartridgeRepository: Repository<Cartridge>,
    @InjectRepository(Log)
    private logRepository: Repository<Log>,
  ) {}

  async findAll(): Promise<Cartridge[]> {
    return await this.cartridgeRepository.find({ relations: ['logs'] });
  }

  async create(createCartridgeInput: CreateCartridgeInput): Promise<Cartridge> {
    const newCartridge = this.cartridgeRepository.create(createCartridgeInput);
    return this.cartridgeRepository.save(newCartridge);
  }

  async update(updateCartridgeInput: UpdateCartridgeInput): Promise<Cartridge> {
    const { id, amount, name, description, type } = updateCartridgeInput;
    const cartridge = await this.cartridgeRepository.findOne(id);

    console.log(updateCartridgeInput);

    const log = await this.logRepository.create({
      amount,
      type,
      description,
      cartridge,
    });

    await this.logRepository.save(log);

    return this.cartridgeRepository.save({
      id,
      name,
      amount: cartridge.amount - amount,
    });
  }

  async remove(cartridgeId: number): Promise<string> {
    try {
      const cartridge = this.cartridgeRepository.delete({ id: cartridgeId });
      // const logs = this.logRepository.delete({ cartridgeId });
      return 'Удалено';
    } catch (e) {
      return 'Произошла ошибка';
    }
  }
}
