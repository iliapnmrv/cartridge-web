import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Harm } from './entities/harm.entity';

@Injectable()
export class HarmService {
  constructor(
    @InjectRepository(Harm, 'med')
    private harmRepository: Repository<Harm>,
  ) {}

  async findAll(): Promise<Harm[]> {
    return await this.harmRepository.find();
  }
}
