import { InputType, Int, Field } from '@nestjs/graphql';
import { Column } from 'typeorm';
import { CartridgeAction } from '../entities/log.entity';

@InputType()
export class CreateLogInput {
  @Field({ nullable: true })
  description: string;

  @Field((type) => Int)
  amount: number;

  @Field((type) => CartridgeAction)
  type: CartridgeAction;
}
