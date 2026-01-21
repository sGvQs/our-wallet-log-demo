import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import Database from 'better-sqlite3';

import dotenv from 'dotenv'

dotenv.config()
const connectionString = `${process.env.DATABASE_URL}`

const globalForPrisma = global as unknown as { prisma: PrismaClient };

let prismaInstance: PrismaClient;

if (connectionString.startsWith('postgres') || connectionString.startsWith('postgresql')) {
  const adapter = new PrismaNeon({ connectionString });
  prismaInstance = new PrismaClient({ adapter });
} else {
  // For SQLite, use better-sqlite3 adapter
  const adapter = new PrismaBetterSqlite3({ url: 'dev.db' });
  prismaInstance = new PrismaClient({ adapter });
}

export const prisma =
  globalForPrisma.prisma ||
  prismaInstance;

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
