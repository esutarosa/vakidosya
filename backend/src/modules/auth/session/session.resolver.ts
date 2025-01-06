import type { GqlContext } from 'src/shared/types/gql-context.types';

import { Args, Context, Query, Mutation, Resolver } from '@nestjs/graphql';

import { SessionService } from './session.service';
import { UserModel } from '../account/models/user.model';
import { LoginInput } from './inputs/login.inputs';
import { SessionModel } from './models/session.model';

import { UserAgent } from 'src/shared/decorators/user-agent.decorator';
import { Authorization } from 'src/shared/decorators/auth.decorator';

@Resolver('Session')
export class SessionResolver {
  public constructor(private readonly sessionService: SessionService) {}

  @Authorization()
  @Query(() => [SessionModel], { name: 'findSessionsByUser' })
  public async findByUser(@Context() { req }: GqlContext) {
    return this.sessionService.findByUser(req);
  }

  @Authorization()
  @Query(() => SessionModel, { name: 'findCurrentSSession' })
  public async findCurrent(@Context() { req }: GqlContext) {
    return this.sessionService.findCurrent(req);
  }

  @Mutation(() => UserModel, { name: 'loginUser' })
  public async login(
    @Context() { req }: GqlContext,
    @Args('data') input: LoginInput,
    @UserAgent() userAgent: string,
  ) {
    return this.sessionService.login(req, input, userAgent);
  }

  @Authorization()
  @Mutation(() => Boolean, { name: 'logoutUser' })
  public async logout(@Context() { req }: GqlContext) {
    return this.sessionService.logout(req);
  }

  @Authorization()
  @Mutation(() => Boolean, { name: 'clearSessionCookie' })
  public async clear(@Context() { req }: GqlContext) {
    return this.sessionService.clear(req);
  }

  @Authorization()
  @Mutation(() => Boolean, { name: 'removeSession' })
  public async remove(@Context() { req }: GqlContext, @Args('id') id: number) {
    return this.sessionService.remove(req, id);
  }
}
