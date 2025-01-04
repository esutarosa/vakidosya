import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

import Redis from 'ioredis';

@Injectable()
export class RedisService extends Redis {
  public constructor(configService: ConfigService) {
    super(configService.getOrThrow<string>('REDIS_URI'));
  }
}
