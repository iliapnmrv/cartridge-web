import { CreateLogInput } from './create-log.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateLogInput extends PartialType(CreateLogInput) {
  @Field(() => Int)
  id: number;
}
