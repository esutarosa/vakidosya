import { Injectable, ConflictException } from '@nestjs/common';
import { hash } from 'argon2';

import { CreateUserInput } from './inputs/create-user.input';

import { DrizzleDatabase } from 'src/core/drizzle/drizzle.database';
import * as schema from 'src/core/drizzle/schemas/drizzle.schemas';

@Injectable()
export class AccountService extends DrizzleDatabase {
  public async findAll() {
    return await this.db.query.users.findMany();
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
