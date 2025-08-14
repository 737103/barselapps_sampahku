
"use client";

import { usePathname, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { DashboardHeader } from "@/components/dashboard-header";
import { HorizontalNav } from "@/components/horizontal-nav";
import { LayoutDashboard, History, MessageSquarePlus, Settings, LifeBuoy } from "lucide-react";
import type { Citizen } from "@/lib/data";
import { getCitizenById } from "@/lib/firebase/firestore";

function WargaLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const citizenId = searchParams.get("citizenId");

  const [citizen, setCitizen] = useState<Citizen | null>(null);

  useEffect(() => {
    const fetchCitizen = async () => {
      if (citizenId) {
        const citizenData = await getCitizenById(citizenId);
        setCitizen(citizenData);
      }
    };
    fetchCitizen();
  }, [citizenId]);

  const wargaUser = {
    name: citizen?.name || "Memuat...",
    email: citizen?.nik ? `NIK: ${citizen.nik}` : "memuat...",
    role: "Warga" as const,
  };

  const navItems = [
    { href: `/warga?citizenId=${citizenId}`, label: "Dashboard", icon: LayoutDashboard, isActive: pathname === '/warga' },
    { href: `/warga/riwayat-pembayaran?citizenId=${citizenId}`, label: "Riwayat Pembayaran", icon: History, isActive: pathname.startsWith('/warga/riwayat-pembayaran') },
    { href: `/warga/ajukan-sanggahan?citizenId=${citizenId}`, label: "Ajukan Sanggahan", icon: MessageSquarePlus, isActive: pathname.startsWith('/warga/ajukan-sanggahan') },
    { href: `/warga/profile?citizenId=${citizenId}`, label: "Profile", icon: Settings, isActive: pathname.startsWith('/warga/profile') },
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

export default function WargaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <WargaLayoutContent>{children}</WargaLayoutContent>
    </React.Suspense>
  )
}
