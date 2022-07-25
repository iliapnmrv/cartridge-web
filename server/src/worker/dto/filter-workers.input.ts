import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class FilterWorkersInput {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  date?: Date;

  @Field(() => [String], { nullable: true })
  shifts?: string[];
}
