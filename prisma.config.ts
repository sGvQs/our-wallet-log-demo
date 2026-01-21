import { defineConfig, env } from 'prisma/config';

const isSQLite = process.env.DATABASE_URL?.startsWith('file:');

export default defineConfig({
  schema: isSQLite ? "prisma/sqlite/schema.prisma" : "prisma/schema.prisma",
  datasource: {
    url: isSQLite ? process.env.DATABASE_URL : (process.env.DIRECT_URL ?? env('DIRECT_URL')),
  },
});
