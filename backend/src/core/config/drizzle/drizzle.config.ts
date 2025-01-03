import type { NestDrizzleOptions } from 'src/core/drizzle/interfaces/drizzle.interfaces';

import { ConfigService } from '@nestjs/config';

import * as schema from 'src/core/drizzle/schemas/drizzle.schemas';

export function getDrizzleConfig(
  configService: ConfigService,
): NestDrizzleOptions {
  return {
    driver: 'postgres-js',
    url: configService.getOrThrow<string>('DATABASE_URL'),
    options: { schema },
    migrationOptions: { migrationsFolder: './migration' },
  };
}
