import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateHarmInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
