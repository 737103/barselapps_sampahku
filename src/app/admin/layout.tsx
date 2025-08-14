"use client";

import { usePathname } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard-header";
import { HorizontalNav } from "@/components/horizontal-nav";
import { LayoutDashboard, Users, MessageSquareWarning, Settings, LifeBuoy, KeyRound, History } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const adminUser = {
    name: "Admin Kelurahan",
    email: "admin@wastepay.app",
    role: "Admin" as const,
  };

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard, isActive: pathname === '/admin' },
    { href: "/admin/manajemen-warga", label: "Manajemen Warga", icon: Users, isActive: pathname.startsWith('/admin/manajemen-warga') },
    { href: "/admin/manajemen-akun-rt", label: "Manajemen Akun RT", icon: KeyRound, isActive: pathname.startsWith('/admin/manajemen-akun-rt') },
    { href: "/admin/manajemen-pencatatan", label: "Manajemen Pencatatan", icon: History, isActive: pathname.startsWith('/admin/manajemen-pencatatan') },
    { href: "/admin/sanggahan", label: "Sanggahan", icon: MessageSquareWarning, isActive: pathname.startsWith('/admin/sanggahan') },
    { href: "/admin/settings", label: "Settings", icon: Settings, isActive: pathname.startsWith('/admin/settings') },
    { href: "/admin/support", label: "Support", icon: LifeBuoy, isActive: pathname.startsWith('/admin/support') },
  ];

  return (
    <div className="flex min-h-screen w-full flex-col">
      <DashboardHeader user={adminUser} title="Admin Dashboard" />
      <HorizontalNav items={navItems} />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 bg-muted/40">
        {children}
      </main>
    </div>
  );
}
