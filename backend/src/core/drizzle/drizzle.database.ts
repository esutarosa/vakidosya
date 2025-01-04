import { Inject, Injectable } from '@nestjs/common';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

import { DRIZZLE_ORM } from 'src/shared/constants/db.constants';
import * as schema from 'src/core/drizzle/schemas/drizzle.schemas';

@Injectable()
export class DrizzleDatabase {
  protected readonly db: PostgresJsDatabase<typeof schema>;

  public constructor(
    @Inject(DRIZZLE_ORM) db: PostgresJsDatabase<typeof schema>,
  ) {
    this.db = db;
  }
}
