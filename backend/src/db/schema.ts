import { sql } from 'drizzle-orm';
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const User = pgTable('users', {
  id: text('id')
    .notNull()
    .primaryKey()
    .default(sql`uuid(4)`),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  username: text('username').notNull().unique(),
  displayName: text('display_name').notNull(),
  avatar: text('avatar'),
  bio: text('bio'),
  createdAt: timestamp('created_at', { precision: 3 }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { precision: 3 }).notNull(),
});
