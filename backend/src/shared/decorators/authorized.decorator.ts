import { createParamDecorator, type ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

import type { User } from '../types/user.type';

export const Authorized = createParamDecorator(
  (data: keyof User, ctx: ExecutionContext) => {
    let user: User;

    if (ctx.getType() === 'http') {
      user = ctx.switchToHttp().getRequest()?.user;
    } else {
      const context = GqlExecutionContext.create(ctx);
      user = context.getContext().req?.user;
    }

    if (!user) {
      throw new Error('User not found in request');
    }

    return data ? user[data] : user;
  },
);
