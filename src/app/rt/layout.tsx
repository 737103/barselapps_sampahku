
"use client";

import { usePathname } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard-header";
import { HorizontalNav } from "@/components/horizontal-nav";
import { LayoutDashboard, Users, DollarSign, Settings, LifeBuoy, FileText } from "lucide-react";

export default function RTLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const rtUser = {
    name: "Ahmad Subarjo",
    email: "rt001@wastepay.app",
    role: "Ketua RT" as const,
  };

  const navItems = [
    { href: "/rt", label: "Dashboard", icon: LayoutDashboard, isActive: pathname === '/rt' },
    { href: "/rt/pembayaran", label: "Pembayaran", icon: DollarSign, isActive: pathname.startsWith('/rt/pembayaran') },
    { href: "/rt/data-warga", label: "Data Warga", icon: Users, isActive: pathname.startsWith('/rt/data-warga') },
    { href: "/rt/laporan", label: "Laporan", icon: FileText, isActive: pathname.startsWith('/rt/laporan') },
    { href: "/rt/settings", label: "Settings", icon: Settings, isActive: pathname.startsWith('/rt/settings') },
    { href: "/rt/support", label: "Support", icon: LifeBuoy, isActive: pathname.startsWith('/rt/support') },
  ];

  return (
    <div className="flex min-h-screen w-full flex-col">
      <DashboardHeader user={rtUser} title="RT 001/001 Dashboard" />
      <HorizontalNav items={navItems} />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 bg-muted/40">
        {children}
      </main>
    </div>
  );
}
