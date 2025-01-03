import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './migration',
  schema: './src/core/drizzle/schemas/drizzle.schemas.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
