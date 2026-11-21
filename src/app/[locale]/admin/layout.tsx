import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminShell from "@/components/admin/admin-shell";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const [session, pendingOrders] = await Promise.all([
    auth(),
    prisma.order.count({ where: { status: "PENDING" } }),
  ]);

  return (
    <AdminShell
      user={{ name: session?.user?.name, email: session?.user?.email }}
      pendingOrders={pendingOrders}
    >
      {children}
    </AdminShell>
  );
}
