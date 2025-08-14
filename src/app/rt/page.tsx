
"use client";

import { useState, useEffect } from "react";
import { StatCard } from "@/components/stat-card";
import { ResidentsTable } from "@/components/rt/residents-table";
import { DollarSign, Users, AlertTriangle, PieChart } from "lucide-react";
import { type Citizen } from "@/lib/data";
import { getCitizensByRT } from "@/lib/firebase/firestore";

export default function RTDashboardPage() {
  const [residents, setResidents] = useState<Citizen[]>([]);
  const [loading, setLoading] = useState(true);
  const currentRT = "001"; // Assuming static RT for now
  const currentRW = "001"; // Assuming static RW for now

  useEffect(() => {
    const fetchCitizens = async () => {
      setLoading(true);
      const fetchedCitizens = await getCitizensByRT(currentRT, currentRW);
      setResidents(fetchedCitizens);
      setLoading(false);
    };
    fetchCitizens();
  }, [currentRT, currentRW]);


  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <StatCard 
            title="Warga di RT Anda" 
            value={residents.length.toString()} 
            icon={Users}
            description="Total warga terdaftar" 
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
        <ResidentsTable residents={residents} setResidents={setResidents} loading={loading}/>
      </div>
    </>
  );
}
