import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateCartridgeInput {
  @Field()
  name: string;

  @Field({ nullable: true })
  amount?: number;
}
