import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { CartridgeModule } from './cartridge/cartridge.module';
import { LogsModule } from './logs/logs.module';
@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      database: 'cartridge',
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    CartridgeModule,
    LogsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
