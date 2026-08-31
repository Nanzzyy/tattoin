import "dotenv/config";
import { createHash, randomUUID } from "node:crypto";
import { existsSync, mkdirSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";

const databaseUrl = process.env.DATABASE_URL ?? "file:./dev.db";
if (!databaseUrl.startsWith("file:")) {
  throw new Error("The local migration runner only supports SQLite file: URLs.");
}

const configuredPath = databaseUrl.slice("file:".length);
const databasePath = path.isAbsolute(configuredPath)
  ? configuredPath
  : path.resolve(process.cwd(), "prisma", configuredPath.replace(/^\.\//, ""));
const migrationsPath = path.resolve(process.cwd(), "prisma", "migrations");

mkdirSync(path.dirname(databasePath), { recursive: true });
const database = new Database(databasePath);
database.pragma("foreign_keys = ON");
database.pragma("journal_mode = WAL");

database.exec(`
  CREATE TABLE IF NOT EXISTS "_prisma_migrations" (
    "id" TEXT PRIMARY KEY NOT NULL,
    "checksum" TEXT NOT NULL,
    "finished_at" DATETIME,
    "migration_name" TEXT NOT NULL,
    "logs" TEXT,
    "rolled_back_at" DATETIME,
    "started_at" DATETIME NOT NULL DEFAULT current_timestamp,
    "applied_steps_count" INTEGER UNSIGNED NOT NULL DEFAULT 0
  );
`);

const applied = database.prepare("SELECT checksum FROM _prisma_migrations WHERE migration_name = ? AND rolled_back_at IS NULL");
const record = database.prepare(`
  INSERT INTO "_prisma_migrations"
    ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
  VALUES (?, ?, CURRENT_TIMESTAMP, ?, CURRENT_TIMESTAMP, 1)
`);

const migrationNames = existsSync(migrationsPath)
  ? readdirSync(migrationsPath, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .sort()
  : [];

let appliedCount = 0;
for (const migrationName of migrationNames) {
  const sqlPath = path.join(migrationsPath, migrationName, "migration.sql");
  if (!existsSync(sqlPath)) continue;

  const sql = readFileSync(sqlPath, "utf8");
  const checksum = createHash("sha256").update(sql).digest("hex");
  const existing = applied.get(migrationName) as { checksum: string } | undefined;

  if (existing) {
    if (existing.checksum !== checksum) {
      throw new Error(`Migration checksum mismatch: ${migrationName}`);
    }
    console.info(`Already applied: ${migrationName}`);
    continue;
  }

  database.transaction(() => {
    database.exec(sql);
    record.run(randomUUID(), checksum, migrationName);
  })();
  appliedCount += 1;
  console.info(`Applied: ${migrationName}`);
}

database.close();
console.info(appliedCount ? `${appliedCount} migration(s) applied.` : "Database is up to date.");
