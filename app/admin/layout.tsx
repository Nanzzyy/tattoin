import type { Metadata } from "next";
import "./admin.css";

export const metadata: Metadata = {
  title: "Studio CMS",
  robots: { index: false, follow: false, noarchive: true },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
