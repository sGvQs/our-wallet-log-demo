import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import dotenv from 'dotenv'

dotenv.config()
const connectionString = `${process.env.DATABASE_URL}`

const globalForPrisma = global as unknown as { prisma: PrismaClient };

let adapter: any;

if (connectionString.startsWith('postgres') || connectionString.startsWith('postgresql')) {
  // Use @neondatabase/serverless with Pool and WebSockets for production performance
  const { Pool, neonConfig } = require('@neondatabase/serverless');
  const ws = require('ws');
  neonConfig.webSocketConstructor = ws;
  const pool = new Pool({ connectionString });
  adapter = new PrismaNeon(pool as any);
} else {
  // Local development uses better-sqlite3
  adapter = new PrismaBetterSqlite3({ url: 'dev.db' });
}

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
