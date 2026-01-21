import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import dotenv from 'dotenv'

dotenv.config()
const connectionString = `${process.env.DATABASE_URL}`

const globalForPrisma = global as unknown as { prisma: PrismaClient };

let adapter: PrismaNeon | PrismaBetterSqlite3;


if (connectionString.startsWith('postgres') || connectionString.startsWith('postgresql')) {
  adapter = new PrismaNeon({ connectionString });
} else {
  // For SQLite, use better-sqlite3 adapter
  adapter = new PrismaBetterSqlite3({ url: 'dev.db' });
}

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
