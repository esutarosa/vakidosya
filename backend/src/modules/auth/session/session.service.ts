import type { Request } from 'express';

import { verify } from 'argon2';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { ConfigService } from '@nestjs/config';
import { Inject } from '@nestjs/common';
import { LoginInput } from './inputs/login.inputs';

import { DRIZZLE_ORM } from 'src/shared/constants/db.constants';
import * as schema from 'src/core/drizzle/schemas/drizzle.schemas';

@Injectable()
export class SessionService {
  public constructor(
    private readonly configService: ConfigService,
    @Inject(DRIZZLE_ORM) private readonly db: PostgresJsDatabase<typeof schema>,
  ) {}

  public async login(req: Request, input: LoginInput) {
    const { login, password } = input;

    const user = await this.db.query.users.findFirst({
      where: (users, { or, eq }) =>
        or(eq(users.username, login), eq(users.email, login)),
    });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    const isValidPassword = await verify(user.password, password);

    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    return new Promise((resolve, reject) => {
      req.session.createdAt = new Date();
      req.session.usersId = user.id;

      req.session.save((err) => {
        if (err) {
          return reject(new InternalServerErrorException(''));
        }

        resolve({ user });
      });
    });
  }

  public async logout(req: Request) {
    return new Promise((resolve, reject) => {
      req.session.destroy((err) => {
        if (err) {
          return reject(new InternalServerErrorException(''));
        }

        req.res.clearCookie(this.configService.getOrThrow('SESSION_NAME'));
        resolve(true);
      });
    });
  }
}
