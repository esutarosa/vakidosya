import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NestDrizzleModule } from './drizzle/drizzle.module';

import { IS_DEV_ENV } from 'src/shared/utils/is-dev.util';

import * as schema from './drizzle/schemas/drizzle.schemas';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver } from '@nestjs/apollo';
import { getGraphQLConfig } from './config/graphql.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: !IS_DEV_ENV,
      isGlobal: true,
    }),
    NestDrizzleModule.forRootAsync({
      useFactory: () => {
        return {
          driver: 'postgres-js',
          url: process.env.DATABASE_URL!,
          options: { schema },
          migrationOptions: { migrationsFolder: './migration' },
        };
      },
    }),
    GraphQLModule.forRootAsync({
      driver: ApolloDriver,
      useFactory: getGraphQLConfig,
    }),
  ],
})
export class CoreModule {}
