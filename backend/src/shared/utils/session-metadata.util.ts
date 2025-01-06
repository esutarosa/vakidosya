/* eslint-disable */

import type { Request } from 'express';
import { lookup } from 'geoip-lite';
import * as countries from 'i18n-iso-countries';

import type { SessionMetadata } from '../types/session-metadata.types';
import { IS_DEV_ENV } from './is-dev.util';

import DeviceDetector = require('device-detector-js');

countries.registerLocale(require('i18n-iso-countries/langs/en.json'));

export function getSessionMetadata(
  req: Request,
  userAgent: string,
): SessionMetadata {
  const getClientIp = (req: Request) => {
    if (IS_DEV_ENV) return '173.166.164.121';

    const cfIp = Array.isArray(req.headers['cf-connecting-ip'])
      ? req.headers['cf-connecting-ip'][0]
      : req.headers['cf-connecting-ip'];

    if (cfIp) return cfIp;

    const xForwardedFor = req.headers['x-forwarded-for'];
    if (typeof xForwardedFor === 'string') {
      return xForwardedFor.split(',')[0].trim();
    }

    return req.ip || 'Unknown IP';
  };

  const ip = getClientIp(req);
  const location = lookup(ip);
  const device = new DeviceDetector().parse(userAgent);

  return {
    location: {
      country: countries.getName(location.country, 'en') || 'Unknown',
      city: location.city,
      latitude: location.ll[0] || 0,
      longitude: location.ll[1] || 0,
    },
    device: {
      browser: device.client.name,
      os: device.os.name,
      type: device.device.type,
    },
    ip,
  };
}
