import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdmin } from "@/lib/auth";

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  return <AdminShell username={admin.username}>{children}</AdminShell>;
}
