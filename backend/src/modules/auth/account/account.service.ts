import { Injectable, ConflictException, Inject } from '@nestjs/common';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { hash } from 'argon2';

import { CreateUserInput } from './inputs/create-user.input';

import { DRIZZLE_ORM } from 'src/shared/constants/db.constants';
import * as schema from 'src/core/drizzle/schemas/drizzle.schemas';

@Injectable()
export class AccountService {
  public constructor(
    @Inject(DRIZZLE_ORM)
    private readonly db: PostgresJsDatabase<typeof schema>,
  ) {}

  public async me(id: number) {
    const user = await this.db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, id),
    });

    return user;
  }

  public async create(input: CreateUserInput) {
    const { email, username, password } = input;

    const existingUser = await this.db.query.users.findFirst({
      where: (users, { or, eq }) =>
        or(eq(users.username, username), eq(users.email, email)),
    });

    if (existingUser) {
      if (existingUser.username === username) {
        throw new ConflictException('This username already exists.');
      }
      if (existingUser.email === email) {
        throw new ConflictException('This email already exists.');
      }
    }

    await this.db
      .insert(schema.users)
      .values({
        email,
        username,
        password: await hash(password),
        displayName: username,
      })
      .returning();

    return true;
  }
}
