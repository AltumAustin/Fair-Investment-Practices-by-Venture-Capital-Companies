import { PrismaClient } from "@/generated/prisma";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

function createPrismaClient(): PrismaClient {
  // Vercel Postgres (Neon) sets POSTGRES_URL automatically when linked.
  // Use the Neon serverless adapter for production on Vercel.
  if (process.env.POSTGRES_URL) {
    const adapter = new PrismaNeon({
      connectionString: process.env.POSTGRES_URL,
    });
    return new PrismaClient({ adapter });
  }

  // Local development: use pg (node-postgres) with Docker Compose PostgreSQL
  const connectionString =
    process.env.DATABASE_URL ||
    "postgresql://postgres:postgres@localhost:5432/vc_compliance?schema=public";
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["query"] : [],
  });
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
