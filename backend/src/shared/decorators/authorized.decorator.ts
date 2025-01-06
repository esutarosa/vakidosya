import {
  createParamDecorator,
  UnauthorizedException,
  type ExecutionContext,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

import type { User } from '../types/user.type';

export const Authorized = createParamDecorator(
  (data: keyof User, ctx: ExecutionContext) => {
    const context =
      ctx.getType() === 'http'
        ? ctx.switchToHttp().getRequest()
        : GqlExecutionContext.create(ctx).getContext().req;

    const user = context.user;

    if (!user) {
      throw new UnauthorizedException('User not found in request');
    }

    return data ? user[data] : user;
  },
);
