/**
 * Prisma Client — lazy initialization
 * Currently unused (mock data), will be needed when DB is connected
 */

let prismaInstance: unknown = null;

export function getPrisma() {
  if (!prismaInstance) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { PrismaClient } = require("@prisma/client");
      prismaInstance = new PrismaClient();
    } catch {
      console.warn("Prisma Client not available — using mock data");
      prismaInstance = null;
    }
  }
  return prismaInstance;
}

export default getPrisma;
