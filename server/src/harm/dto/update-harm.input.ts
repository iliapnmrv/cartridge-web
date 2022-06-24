import { CreateHarmInput } from './create-harm.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateHarmInput extends PartialType(CreateHarmInput) {
  @Field(() => Int)
  id: number;
}
