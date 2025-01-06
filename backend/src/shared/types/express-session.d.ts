import 'express-session';

import type { SessionMetadata } from './session-metadata.types';

declare module 'express-session' {
  interface SessionData {
    userId?: number;
    createdAt?: Data | string;
    metadata: SessionMetadata;
  }
}
