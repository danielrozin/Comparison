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

// Mirror the vercel-build.mjs logic at runtime: prisma/schema.prisma declares
// `directUrl = env("DIRECT_URL")` (required for safe migrations via the direct
// non-pooled Neon endpoint — DAN-1512). Prisma Client reads DIRECT_URL at
// initialization time; if it is missing the client throws "Environment variable
// not found: DIRECT_URL", crashing every DB-backed page. The vercel-build.mjs
// wrapper sets DIRECT_URL during the build step but the Vercel runtime env may
// not have it as a permanent variable. Derive it from DATABASE_URL here so the
// server process always has a valid DIRECT_URL regardless of whether the Vercel
// dashboard env var was configured explicitly.
function ensureDirectUrl(): void {
  if (process.env.DIRECT_URL) return;
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) return;
  // Neon pooler host: ep-xxxx-pooler.<region>.aws.neon.tech
  // Direct host:      ep-xxxx.<region>.aws.neon.tech
  process.env.DIRECT_URL = databaseUrl.replace("-pooler.", ".");
}

function createPrismaClient(): PrismaClient | null {
  if (!isValidDatabaseUrl()) return null;
  ensureDirectUrl();
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
  if (client) {
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
