import { Field, InputType } from '@nestjs/graphql';
import { CartridgeAction } from 'src/logs/entities/log.entity';

@InputType()
export class UpdateCartridgeInput {
  @Field()
  id: number;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  amount?: number;

  @Field(() => CartridgeAction, { nullable: true })
  type?: CartridgeAction;
}
