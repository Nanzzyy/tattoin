import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { getPrisma } from "@/lib/prisma";

const SESSION_COOKIE = "tattoin_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7;
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_MINUTES = 15;
const DUMMY_PASSWORD_HASH = "$2b$12$v0kV9a6klwGho4UqQrGmeuOqobIOtl9QP4OtROmXEgZZmWpqlv9Ja";

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function createSession(adminId: number) {
  const prisma = await getPrisma();
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_DURATION_SECONDS * 1000);

  await prisma.$transaction([
    prisma.session.deleteMany({ where: { expiresAt: { lt: new Date() } } }),
    prisma.session.create({ data: { tokenHash: hashToken(token), adminId, expiresAt } }),
  ]);

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_DURATION_SECONDS,
  });
}

export async function destroySession() {
  const prisma = await getPrisma();
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (token) {
    await prisma.session.deleteMany({ where: { tokenHash: hashToken(token) } });
  }

  cookieStore.delete(SESSION_COOKIE);
}

export async function getCurrentAdmin() {
  const prisma = await getPrisma();
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const session = await prisma.session.findUnique({
    where: { tokenHash: hashToken(token) },
    include: { admin: { select: { id: true, username: true } } },
  });

  if (!session || session.expiresAt <= new Date()) return null;
  return session.admin;
}

export async function requireAdmin() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}

export type LoginResult =
  | { ok: true; adminId: number }
  | { ok: false; message: string };

export async function verifyLogin(username: string, password: string): Promise<LoginResult> {
  const prisma = await getPrisma();
  const normalizedUsername = username.trim().toLowerCase();
  const admin = await prisma.adminUser.findUnique({ where: { username: normalizedUsername } });

  if (!admin) {
    await bcrypt.compare(password, DUMMY_PASSWORD_HASH);
    return { ok: false, message: "Username atau password tidak valid." };
  }

  if (admin.lockedUntil && admin.lockedUntil > new Date()) {
    return { ok: false, message: "Terlalu banyak percobaan. Coba lagi dalam 15 menit." };
  }

  const valid = await bcrypt.compare(password, admin.passwordHash);
  if (!valid) {
    const attempts = admin.failedLoginCount + 1;
    await prisma.adminUser.update({
      where: { id: admin.id },
      data: attempts >= MAX_LOGIN_ATTEMPTS
        ? { failedLoginCount: 0, lockedUntil: new Date(Date.now() + LOCKOUT_MINUTES * 60_000) }
        : { failedLoginCount: attempts, lockedUntil: null },
    });
    return { ok: false, message: "Username atau password tidak valid." };
  }

  await prisma.adminUser.update({
    where: { id: admin.id },
    data: { failedLoginCount: 0, lockedUntil: null },
  });

  return { ok: true, adminId: admin.id };
}
