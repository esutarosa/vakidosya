import 'express-session';

declare module 'express-session' {
  interface SessionData {
    userId?: number;
    createdAt?: Data | string;
  }
}
