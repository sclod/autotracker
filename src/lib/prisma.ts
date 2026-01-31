import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import Database from "better-sqlite3";
import { ensureSchema } from "@/lib/db-bootstrap";
import { seedDemoOrders } from "@/lib/seed";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };
function createPrismaClient() {
  const databaseUrl = process.env.DATABASE_URL ?? "file:./dev.db";
  if (!process.env.DATABASE_URL) {
    process.env.DATABASE_URL = databaseUrl;
  }
  const dbPath = databaseUrl.startsWith("file:")
    ? databaseUrl.slice("file:".length)
    : databaseUrl;
  const db = new Database(dbPath);
  ensureSchema(db);
  db.close();
  const adapter = new PrismaBetterSqlite3({ url: databaseUrl });
  return new PrismaClient({ adapter });
}

const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

if (process.env.NODE_ENV !== "production" && process.env.SEED_DEMO === "true") {
  void seedDemoOrders(prisma);
}

export default prisma;
