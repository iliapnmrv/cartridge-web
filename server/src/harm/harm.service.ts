import { Injectable } from '@nestjs/common';
import { CreateHarmInput } from './dto/create-harm.input';
import { UpdateHarmInput } from './dto/update-harm.input';

@Injectable()
export class HarmService {
  create(createHarmInput: CreateHarmInput) {
    return 'This action adds a new harm';
  }

  findAll() {
    return `This action returns all harm`;
  }

  findOne(id: number) {
    return `This action returns a #${id} harm`;
  }

  update(id: number, updateHarmInput: UpdateHarmInput) {
    return `This action updates a #${id} harm`;
  }

  remove(id: number) {
    return `This action removes a #${id} harm`;
  }
}
