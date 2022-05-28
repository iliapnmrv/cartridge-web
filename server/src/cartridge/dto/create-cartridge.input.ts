import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateCartridgeInput {
  @Field()
  name: string;

  @Field()
  amount: number;

  @Field({ nullable: true })
  info?: string;
}
