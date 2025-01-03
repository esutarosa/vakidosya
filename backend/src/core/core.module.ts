import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver } from '@nestjs/apollo';

import { NestDrizzleModule } from 'src/core/drizzle/drizzle.module';
import { getGraphQLConfig, getDrizzleConfig } from 'src/core/config';
import { AccountModule } from 'src/modules/auth/account/account.module';
import { RedisModule } from 'src/core/redis/redis.module';

import { IS_DEV_ENV } from 'src/shared/utils/is-dev.util';

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: !IS_DEV_ENV,
      isGlobal: true,
    }),
    GraphQLModule.forRootAsync({
      driver: ApolloDriver,
      imports: [ConfigModule],
      useFactory: getGraphQLConfig,
      inject: [ConfigService],
    }),
    NestDrizzleModule.forRootAsync({
      useFactory: getDrizzleConfig,
      inject: [ConfigService],
    }),
    RedisModule,
    AccountModule,
  ],
})
export class CoreModule {}
