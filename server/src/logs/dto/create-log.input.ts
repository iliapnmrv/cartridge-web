import { InputType, Int, Field } from '@nestjs/graphql';
import { Column } from 'typeorm';
import { CartridgeAction } from '../entities/log.entity';

@InputType()
export class CreateLogInput {
  @Field({ nullable: true })
  description: string;

  @Field(() => Int)
  amount: number;

  @Field(() => CartridgeAction)
  type: CartridgeAction;
}
