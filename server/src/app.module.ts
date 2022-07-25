import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { CartridgeModule } from './cartridge/cartridge.module';
import { LogsModule } from './logs/logs.module';
import { ConfigModule } from '@nestjs/config';
import { Cartridge } from './cartridge/entities/cartridge.entity';
import { Log } from './logs/entities/log.entity';
import { HarmModule } from './harm/harm.module';
import { WorkerModule } from './worker/worker.module';
import { Harm } from './harm/entities/harm.entity';
import { Worker } from './worker/entities/worker.entity';
@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.MYSQL_HOST,
      port: Number(process.env.MYSQL_PORT),
      username: process.env.MYSQL_USERNAME,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DB,
      entities: [Cartridge, Log],
      synchronize: true,
    }),
    // TypeOrmModule.forRoot({
    //   type: 'mysql',
    //   name: 'med',
    //   host: process.env.MYSQL_HOST,
    //   port: Number(process.env.MYSQL_PORT),
    //   username: process.env.MYSQL_USERNAME2,
    //   password: process.env.MYSQL_PASSWORD2,
    //   database: process.env.MYSQL_DB2,
    //   entities: [Worker, Harm],
    //   synchronize: true,
    // }),
    CartridgeModule,
    LogsModule,
    // HarmModule,
    // WorkerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
