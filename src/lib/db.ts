// ============================================
// Echo Bank — Prisma Client Singleton
// Prevents multiple instances in Next.js dev mode (hot reload)
// Uses better-sqlite3 adapter for Prisma 7
// Returns null on Vercel (no writable filesystem for SQLite)
// ============================================

import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | null | undefined;
  prismaInitialized: boolean;
};

function createPrismaClient(): PrismaClient | null {
  // Skip SQLite on Vercel — serverless has no writable filesystem
  if (process.env.VERCEL) {
    return null;
  }

  try {
    const adapter = new PrismaBetterSqlite3({
      url: process.env.DATABASE_URL || "file:./prisma/dev.db",
    });
    return new PrismaClient({ adapter });
  } catch (error) {
    console.warn("[EchoBank] Failed to initialize database:", error);
    return null;
  }
}

function getPrismaClient(): PrismaClient | null {
  if (globalForPrisma.prismaInitialized) {
    return globalForPrisma.prisma ?? null;
  }
  globalForPrisma.prismaInitialized = true;
  globalForPrisma.prisma = createPrismaClient();
  return globalForPrisma.prisma ?? null;
}

export const prisma = getPrismaClient();
