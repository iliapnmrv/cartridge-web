import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Harm } from 'src/harm/entities/harm.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('workers', {})
@ObjectType()
export class Worker {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column()
  @Field(() => String)
  tabNom: string;

  @Column()
  @Field(() => String)
  name: string;

  @Column()
  @Field(() => String)
  position: string;

  // @Column({ nullable: true })
  // @Field(() => Date, { nullable: true })
  // dateOfBirth: Date;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  shift?: string;

  @Column({ type: 'timestamp', nullable: true })
  @Field(() => Date, { nullable: true })
  lastMed?: Date;

  @Column({ default: false })
  @Field(() => Boolean)
  isException: boolean;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  comment: string;

  @Column({ nullable: true })
  harmId?: number;

  @ManyToOne(() => Harm, (harm) => harm.workers)
  @Field(() => Harm, { nullable: true })
  harm: Harm;
}
