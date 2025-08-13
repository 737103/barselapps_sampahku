
"use client";

import { useState } from "react";
import { StatCard } from "@/components/stat-card";
import { ResidentsTable } from "@/components/rt/residents-table";
import { DollarSign, Users, AlertTriangle, PieChart } from "lucide-react";
import { rtResidents, type Citizen } from "@/lib/data";

export default function RTDashboardPage() {
  const [residents, setResidents] = useState<Citizen[]>(rtResidents);

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <StatCard 
            title="Warga di RT Anda" 
            value="45" 
            icon={Users}
            description="25 Pria, 20 Wanita" 
        />
        <StatCard 
            title="Iuran Terkumpul (Juni)" 
            value="Rp 950.000" 
            icon={DollarSign}
            description="dari target Rp 1.125.000" 
        />
        <StatCard 
            title="Tunggakan Bulan Ini" 
            value="7 Warga" 
            icon={AlertTriangle}
            description="Total Rp 175.000"
        />
        <StatCard 
            title="Tingkat Kepatuhan" 
            value="84.4%" 
            icon={PieChart}
            description="Naik 2% dari bulan lalu"
        />
      </div>
      <div className="grid gap-4 md:gap-8">
        <ResidentsTable residents={residents} setResidents={setResidents} />
      </div>
    </>
  );
}
