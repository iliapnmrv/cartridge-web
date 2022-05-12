import { ObjectType, Field, Int, registerEnumType } from '@nestjs/graphql';
import { Cartridge } from 'src/cartridge/entities/cartridge.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum CartridgeAction {
  add,
  sub,
}
registerEnumType(CartridgeAction, {
  name: 'CartridgeAction',
});

@Entity('logs', {})
@ObjectType()
export class Log {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column()
  @Field(() => Int)
  cartridgeId: number;

  // @ManyToOne(() => Cartridge, (cartridge) => cartridge.id)
  // @Field(() => Cartridge)
  // cartridge: Cartridge;

  @Column({ nullable: true })
  @Field({ nullable: true })
  description: string;

  @Column()
  @Field(() => Int)
  amount: number;

  @Column({ type: 'enum', enum: ['add', 'sub'], default: 'add' })
  @Field(() => CartridgeAction)
  type: CartridgeAction;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_at: Date;
}
