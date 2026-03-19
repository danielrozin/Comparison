/**
 * Prisma Client — lazy initialization
 * Only creates PrismaClient when DATABASE_URL is a real connection string.
 * Falls back to null so the app works without a database (mock data).
 */

import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function isValidDatabaseUrl(): boolean {
  const url = process.env.DATABASE_URL;
  if (!url) return false;
  // Skip placeholder/dummy URLs
  if (url.includes("user:password@") || url === "") return false;
  return true;
}

function createPrismaClient(): PrismaClient | null {
  if (!isValidDatabaseUrl()) return null;
  try {
    return new PrismaClient();
  } catch {
    console.warn("Failed to create PrismaClient");
    return null;
  }
}

export function getPrisma(): PrismaClient | null {
  if (globalForPrisma.prisma) return globalForPrisma.prisma;
  const client = createPrismaClient();
  if (client && process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = client;
  }
  return client;
}

// For backwards compatibility — lazy getter
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = getPrisma();
    if (!client) throw new Error("Database not available");
    return (client as unknown as Record<string | symbol, unknown>)[prop];
  },
});

export default prisma;
