import 'express-session';

declare module 'express-session' {
  interface SessionData {
    usersId?: number;
    createdAt?: Data | string;
  }
}
