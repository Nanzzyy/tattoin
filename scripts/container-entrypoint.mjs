import { spawnSync } from "node:child_process";
import path from "node:path";

function run(binary, args) {
  const command = path.resolve(process.cwd(), "node_modules", ".bin", binary);
  const result = spawnSync(command, args, { stdio: "inherit", env: process.env });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}

run("prisma", ["migrate", "deploy"]);

if (process.env.RUN_DB_SEED === "true") {
  run("tsx", ["prisma/seed.ts"]);
}

const server = spawnSync(process.execPath, ["server.js"], { stdio: "inherit", env: process.env });
process.exit(server.status ?? 1);
