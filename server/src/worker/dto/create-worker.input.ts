import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateWorkerInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}