import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/database/schema/*',
  out: './drizzle',
  dbCredentials: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    user: process.env.DB_USER || 'nestjs_user',
    password: process.env.DB_PASSWORD || 'nestjs_password',
    database: process.env.DB_NAME || 'nestjs_db',
  },
});
