import type { Request } from 'express';

import { verify } from 'argon2';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { DRIZZLE_ORM } from 'src/shared/constants/db.constants';
import { getSessionMetadata } from 'src/shared/utils/session-metadata.util';
import * as schema from 'src/core/drizzle/schemas/drizzle.schemas';
import { RedisService } from 'src/core/redis/redis.service';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { LoginInput } from './inputs/login.inputs';

@Injectable()
export class SessionService {
  public constructor(
    @Inject(DRIZZLE_ORM)
    private readonly db: PostgresJsDatabase<typeof schema>,
    private readonly redisService: RedisService,
    private readonly configService: ConfigService,
  ) {}

  public async findByUser(req: Request) {
    const userId = req.session.userId;

    if (!userId) {
      throw new NotFoundException('User not found in the session.');
    }

    const keys = await this.redisService.get('*');
    const userSessions = [];

    for (const key of keys) {
      const sessionData = await this.redisService.get(key);

      if (sessionData) {
        const session = JSON.parse(sessionData);

        if (session.userId === userId) {
          userSessions.push({
            ...session,
            id: key.split(':')[1],
          });
        }
      }
    }

    userSessions.sort((a, b) => b.createdAt - a.createdAt);

    return userSessions.filter((session) => session.id === req.session.id);
  }

  public async findCurrent(req: Request) {
    const sessionId = req.session.id;

    const sessionData = await this.redisService.get(
      `${this.configService.getOrThrow<string>('SESSION_FOLDER')}:${sessionId}`,
    );

    const session = JSON.parse(sessionData);

    return {
      ...session,
      id: sessionId,
    };
  }

  public async login(req: Request, input: LoginInput, userAgent: string) {
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

    const metadata = getSessionMetadata(req, userAgent);

    return new Promise((resolve, reject) => {
      req.session.createdAt = new Date();
      req.session.userId = user.id;
      req.session.metadata = metadata;

      req.session.save((err) => {
        if (err) {
          return reject(
            new InternalServerErrorException(
              'A database error occurred while saving the session.',
            ),
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
            new InternalServerErrorException(
              'A database error occurred while destroying the session.',
            ),
          );
        }

        req.res.clearCookie(
          this.configService.getOrThrow<string>('SESSION_NAME'),
        );
        resolve(true);
      });
    });
  }

  public async clear(req: Request) {
    req.res.clearCookie(this.configService.getOrThrow<string>('SESSION_NAME'));

    return true;
  }

  public async remove(req: Request, id: number) {
    if (Number(req.session.id) === id) {
      throw new ConflictException('Cannot remove the current active session.');
    }

    await this.redisService.del(
      `${this.configService.getOrThrow<string>('SESSION_FOLDER')}:${id}`,
    );

    return true;
  }
}
