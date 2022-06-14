import { Injectable } from '@nestjs/common';
import { CreateLogInput } from './dto/create-log.input';
import { UpdateLogInput } from './dto/update-log.input';

@Injectable()
export class LogsService {
  create(createLogInput: CreateLogInput) {
    return 'This action adds a new log';
  }

  findAll() {
    return `This action returns all logs`;
  }

  findOne(id: number) {
    return `This action returns a #${id} log`;
  }

  update(id: number, updateLogInput: UpdateLogInput) {
    return `This action updates a #${id} log`;
  }

  remove(id: number) {
    return `This action removes a #${id} log`;
  }
}
