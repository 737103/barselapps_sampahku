
"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { StatCard } from "@/components/stat-card";
import { ResidentsTable } from "@/components/rt/residents-table";
import { DollarSign, Users, AlertTriangle, PieChart } from "lucide-react";
import { type Citizen, type RTAccount } from "@/lib/data";
import { getCitizensByRT, getRTAccountById } from "@/lib/firebase/firestore";

export default function RTDashboardPage() {
  const [residents, setResidents] = useState<Citizen[]>([]);
  const [loading, setLoading] = useState(true);
  const [rtAccount, setRtAccount] = useState<RTAccount | null>(null);
  const searchParams = useSearchParams();
  const accountId = searchParams.get('accountId');

  useEffect(() => {
    const fetchAccountAndCitizens = async () => {
      if (accountId) {
        setLoading(true);
        const account = await getRTAccountById(accountId);
        setRtAccount(account);
        if (account) {
          const fetchedCitizens = await getCitizensByRT(account.rt, account.rw);
          setResidents(fetchedCitizens);
        }
        setLoading(false);
      }
    };
    fetchAccountAndCitizens();
  }, [accountId]);


  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <StatCard 
            title="Warga di RT Anda" 
            value={loading ? '...' : residents.length.toString()} 
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
        <ResidentsTable 
            residents={residents} 
            setResidents={setResidents} 
            loading={loading}
            rtAccount={rtAccount}
        />
      </div>
    </>
  );
}
