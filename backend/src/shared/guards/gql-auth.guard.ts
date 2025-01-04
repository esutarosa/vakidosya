import {
  type CanActivate,
  type ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

import { DRIZZLE_ORM } from 'src/shared/constants/db.constants';
import * as schema from 'src/core/drizzle/schemas/drizzle.schemas';
import { UnauthorizedException } from 'src/core/exceptions';

@Injectable()
export class GqlAuthGuard implements CanActivate {
  public constructor(
    @Inject(DRIZZLE_ORM)
    private readonly db: PostgresJsDatabase<typeof schema>,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;

    if (!request.session?.userId) {
      throw new UnauthorizedException({
        message: 'User is not authorized',
      });
    }

    const user = await this.db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, request.session.userId),
    });

    if (!user) {
      throw new UnauthorizedException({
        message: 'User not found',
      });
    }

    request.user = user;

    return true;
  }
}
