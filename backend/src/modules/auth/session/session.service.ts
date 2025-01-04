import type { Request } from 'express';

import { verify } from 'argon2';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { ConfigService } from '@nestjs/config';
import { Inject } from '@nestjs/common';
import { LoginInput } from './inputs/login.inputs';

import { DRIZZLE_ORM } from 'src/shared/constants/db.constants';
import * as schema from 'src/core/drizzle/schemas/drizzle.schemas';
import { InternalServerErrorException } from 'src/core/exceptions';
import { ExceptionConstants } from 'src/shared/constants/exceptions.constants';

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
          return reject(
            new InternalServerErrorException({
              message: 'A database error occurred while saving the session.',
              code: ExceptionConstants.InternalServerErrorCodes.DATABASE_ERROR,
              cause: err,
              description:
                'Failed to save session in the database. Please check the session storage configuration.',
            }),
          );
        }

        resolve(user);
      });
    });
  }

  public async logout(req: Request) {
    return new Promise((resolve, reject) => {
      req.session.destroy((err) => {
        if (err) {
          return reject(
            new InternalServerErrorException({
              message:
                'A database error occurred while destroying the session.',
              code: ExceptionConstants.InternalServerErrorCodes.DATABASE_ERROR,
              cause: err,
              description:
                'Failed to destroy the session in the database. Please check the session storage configuration or ensure the session still exists.',
            }),
          );
        }

        req.res.clearCookie(
          this.configService.getOrThrow<string>('SESSION_NAME'),
        );

        resolve(true);
      });
    });
  }
}
