import { execFileSync } from "node:child_process";
import path from "node:path";

const prismaBin = path.resolve(process.cwd(), "node_modules", ".bin", process.platform === "win32" ? "prisma.cmd" : "prisma");
execFileSync(prismaBin, ["migrate", "deploy"], { stdio: "inherit", env: process.env });
