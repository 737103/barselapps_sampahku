
"use client";

import { usePathname, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { DashboardHeader } from "@/components/dashboard-header";
import { HorizontalNav } from "@/components/horizontal-nav";
import { LayoutDashboard, Users, DollarSign, Settings, LifeBuoy, FileText } from "lucide-react";
import { type RTAccount } from "@/lib/data";
import { getRTAccountById } from "@/lib/firebase/firestore";

function RTLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const accountId = searchParams.get('accountId');

  const [rtUser, setRtUser] = useState<RTAccount | null>(null);

  useEffect(() => {
    if (accountId) {
      const fetchAccount = async () => {
        const account = await getRTAccountById(accountId);
        setRtUser(account);
      };
      fetchAccount();
    }
  }, [accountId]);

  const navItems = [
    { href: `/rt?accountId=${accountId}`, label: "Dashboard", icon: LayoutDashboard, isActive: pathname === '/rt' },
    { href: `/rt/pembayaran?accountId=${accountId}`, label: "Pembayaran", icon: DollarSign, isActive: pathname.startsWith('/rt/pembayaran') },
    { href: `/rt/data-warga?accountId=${accountId}`, label: "Data Warga", icon: Users, isActive: pathname.startsWith('/rt/data-warga') },
    { href: `/rt/laporan?accountId=${accountId}`, label: "Laporan", icon: FileText, isActive: pathname.startsWith('/rt/laporan') },
  ];

  const user = {
    name: rtUser ? `${rtUser.name} (RT ${rtUser.rt}/${rtUser.rw})` : "Ketua RT",
    email: rtUser ? rtUser.username : "memuat...",
    role: "Ketua RT" as const,
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <DashboardHeader user={user} title="RT Dashboard" />
      <HorizontalNav items={navItems} />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 bg-muted/40">
        {children}
      </main>
    </div>
  );
}

export default function RTLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <RTLayoutContent>{children}</RTLayoutContent>
    </React.Suspense>
  )
}
