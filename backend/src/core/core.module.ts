import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver } from '@nestjs/apollo';

import { NestDrizzleModule } from 'src/core/drizzle/drizzle.module';
import { getGraphQLConfig, getDrizzleConfig } from 'src/core/config';

import { IS_DEV_ENV } from 'src/shared/utils/is-dev.util';

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: !IS_DEV_ENV,
      isGlobal: true,
    }),
    NestDrizzleModule.forRootAsync({
      useFactory: getDrizzleConfig,
      inject: [ConfigService],
    }),
    GraphQLModule.forRootAsync({
      driver: ApolloDriver,
      useFactory: getGraphQLConfig,
      inject: [ConfigService],
    }),
  ],
})
export class CoreModule {}
