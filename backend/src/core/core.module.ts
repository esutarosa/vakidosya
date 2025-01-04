import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver } from '@nestjs/apollo';

import { NestDrizzleModule } from 'src/core/drizzle/drizzle.module';
import { getGraphQLConfig, getDrizzleConfig } from 'src/core/config';
import { RedisModule } from 'src/core/redis/redis.module';
import { AccountModule } from 'src/modules/auth/account/account.module';
import { SessionModule } from 'src/modules/auth/session/session.module';

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
    SessionModule,
  ],
})
export class CoreModule {}
