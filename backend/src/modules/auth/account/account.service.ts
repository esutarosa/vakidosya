import { Inject, Injectable } from '@nestjs/common';

import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

import { DRIZZLE_ORM } from 'src/shared/constants/db.constants';
import * as schema from 'src/core/drizzle/schemas/drizzle.schemas';

@Injectable()
export class AccountService {
  public constructor(
    @Inject(DRIZZLE_ORM)
    private readonly connect: PostgresJsDatabase<typeof schema>,
  ) {}

  public async findAll() {
    return await this.connect.query.users.findMany();
  }
}
