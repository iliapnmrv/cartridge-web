import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cartridge } from './entities/cartridge.entity';
import { CreateCartridgeInput } from './dto/create-cartridge.input';
import { UpdateCartridgeInput } from './dto/update-cartridge.input';
import { CartridgeAction, Log } from 'src/logs/entities/log.entity';

@Injectable()
export class CartridgeService {
  constructor(
    @InjectRepository(Cartridge)
    private cartridgeRepository: Repository<Cartridge>,
    @InjectRepository(Log)
    private logRepository: Repository<Log>,
  ) {}

  async findAll(): Promise<Cartridge[]> {
    return await this.cartridgeRepository.find({
      relations: { logs: true },
      order: { id: 1, logs: { id: 1 } },
    });
  }

  async create(createCartridgeInput: CreateCartridgeInput): Promise<Cartridge> {
    const newCartridge = this.cartridgeRepository.create(createCartridgeInput);
    return this.cartridgeRepository.save(newCartridge);
  }

  async update(updateCartridgeInput: UpdateCartridgeInput): Promise<Cartridge> {
    const { id, amount, name, description, type, info } = updateCartridgeInput;
    const cartridge = await this.cartridgeRepository.findOne({ where: { id } });
    console.log(id, amount, name, description, type, info);

    if (amount && type !== undefined) {
      const log = await this.logRepository.create({
        amount,
        type,
        description: description
          ? description
          : type === CartridgeAction.add
          ? `Поставка ${amount} картриджей ${cartridge.amount}->${
              cartridge.amount + amount
            }`
          : `Списание ${amount} картриджей ${cartridge.amount}->${
              cartridge.amount - amount
            }`,
        cartridge,
      });
      await this.logRepository.save(log);
      return this.cartridgeRepository.save({
        id,
        amount:
          type === CartridgeAction.add
            ? cartridge.amount + amount
            : cartridge.amount - amount,
      });
    }
    if (info !== undefined) {
      return this.cartridgeRepository.save({
        ...cartridge,
        id,
        info,
      });
    }
    if (name !== undefined) {
      return this.cartridgeRepository.save({
        ...cartridge,
        id,
        name,
      });
    }
    if (amount !== undefined) {
      return this.cartridgeRepository.save({
        ...cartridge,
        id,
        amount,
      });
    }
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
