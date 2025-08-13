"use client";

import { usePathname } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard-header";
import { HorizontalNav } from "@/components/horizontal-nav";
import { LayoutDashboard, History, MessageSquarePlus, Settings, LifeBuoy } from "lucide-react";

export default function WargaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const wargaUser = {
    name: "Budi Santoso",
    email: "budi.s@example.com",
    role: "Warga" as const,
  };

  const navItems = [
    { href: "/warga", label: "Dashboard", icon: LayoutDashboard, isActive: pathname === '/warga' },
    { href: "/warga/riwayat-pembayaran", label: "Riwayat Pembayaran", icon: History, isActive: pathname.startsWith('/warga/riwayat-pembayaran') },
    { href: "/warga/ajukan-sanggahan", label: "Ajukan Sanggahan", icon: MessageSquarePlus, isActive: pathname.startsWith('/warga/ajukan-sanggahan') },
    { href: "/warga/profile", label: "Profile", icon: Settings, isActive: pathname.startsWith('/warga/profile') },
    { href: "/warga/support", label: "Support", icon: LifeBuoy, isActive: pathname.startsWith('/warga/support') },
  ];

  return (
    <div className="flex min-h-screen w-full flex-col">
       <DashboardHeader user={wargaUser} title="Warga Dashboard" />
       <HorizontalNav items={navItems} />
       <main className="flex flex-1 flex-col">
        {children}
      </main>
    </div>
  );
}
