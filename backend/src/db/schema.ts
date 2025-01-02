import { pgTable, integer, text, timestamp } from 'drizzle-orm/pg-core';

export const Users = pgTable('users', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  username: text('username').notNull().unique(),
  displayName: text('display_name').notNull(),

  avatar: text('avatar'),
  bio: text('bio'),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
