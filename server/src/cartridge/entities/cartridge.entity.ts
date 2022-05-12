import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { Log } from 'src/logs/entities/log.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity('cartridges')
export class Cartridge {
  @PrimaryGeneratedColumn()
  @Field((type) => Int)
  id: number;

  @Column()
  @Field()
  name: string;

  @Column({ default: 0 })
  @Field((type) => Int, { defaultValue: 0 })
  amount: number;

  @Column({ nullable: true })
  @Field({ nullable: true })
  info?: string;

  // @OneToMany(() => Log, (log) => log.cartridgeId)
  @Field((type) => [Log], { nullable: true })
  logs?: Log[];
}
