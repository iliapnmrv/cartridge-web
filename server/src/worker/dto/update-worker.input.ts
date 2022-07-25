import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UpdateWorkerInput {
  @Field()
  id: number;

  @Field({ nullable: true })
  lastMed?: Date;

  @Field({ nullable: true })
  harmId?: number;

  @Field({ nullable: true })
  isException?: boolean;

  @Field({ nullable: true })
  comment?: string;
}
