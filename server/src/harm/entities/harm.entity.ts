import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Worker } from 'src/worker/entities/worker.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('harm', {})
@ObjectType()
export class Harm {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column()
  @Field(() => String, { nullable: true })
  position: string;

  @Column()
  @Field(() => String)
  harm: string;

  @Column()
  @Field(() => String)
  harmNum: string;

  @OneToMany(() => Worker, (worker) => worker.harm)
  @Field(() => [Worker], { nullable: true })
  workers: Worker[];
}
