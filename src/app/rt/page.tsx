
"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { StatCard } from "@/components/stat-card";
import { ResidentsTable } from "@/components/rt/residents-table";
import { DollarSign, Users, AlertTriangle, PieChart } from "lucide-react";
import { type Citizen, type Payment, type RTAccount } from "@/lib/data";
import { getCitizensByRT, getPaymentsByRT, getRTAccountById } from "@/lib/firebase/firestore";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export default function RTDashboardPage() {
  const [residents, setResidents] = useState<Citizen[]>([]);
  const [loading, setLoading] = useState(true);
  const [rtAccount, setRtAccount] = useState<RTAccount | null>(null);
  const searchParams = useSearchParams();
  const accountId = searchParams.get('accountId');

  // State for dynamic stats
  const [totalCollected, setTotalCollected] = useState<number | null>(null);
  const [targetCollection, setTargetCollection] = useState<number | null>(null);
  const [unpaidCount, setUnpaidCount] = useState<number | null>(null);
  const [unpaidAmount, setUnpaidAmount] = useState<number | null>(null);
  const [complianceRate, setComplianceRate] = useState<string | null>(null);

  const currentPeriod = format(new Date(), "MMMM yyyy", { locale: id });
  const currentMonth = format(new Date(), "MMMM");

  useEffect(() => {
    const fetchAccountAndData = async () => {
      if (accountId) {
        setLoading(true);
        const account = await getRTAccountById(accountId);
        setRtAccount(account);

        if (account) {
          const fetchedCitizens = await getCitizensByRT(account.rt, account.rw);
          setResidents(fetchedCitizens);

          const fetchedPayments = await getPaymentsByRT(account.rt, account.rw);
          
          // --- Calculations for Stats ---
          const paymentsThisPeriod = fetchedPayments.filter(p => p.period === currentPeriod);
          const paidResidentsThisPeriod = paymentsThisPeriod.filter(p => p.status === 'Lunas');
          
          const collected = paidResidentsThisPeriod.reduce((sum, p) => sum + p.amount, 0);
          setTotalCollected(collected);
          
          const target = fetchedCitizens.length * 25000;
          setTargetCollection(target);

          const paidCitizenIds = new Set(paidResidentsThisPeriod.map(p => p.citizenId));
          const unpaidResidents = fetchedCitizens.filter(c => !paidCitizenIds.has(c.id));
          
          setUnpaidCount(unpaidResidents.length);
          setUnpaidAmount(unpaidResidents.length * 25000);

          if (fetchedCitizens.length > 0) {
              const rate = (paidResidentsThisPeriod.length / fetchedCitizens.length) * 100;
              setComplianceRate(`${rate.toFixed(1)}%`);
          } else {
              setComplianceRate("0%");
          }

        }
        setLoading(false);
      }
    };
    fetchAccountAndData();
  }, [accountId, currentPeriod]);

  const formatCurrency = (value: number | null) => {
    if (value === null) return "...";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  }

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
            title={`Iuran Terkumpul (${currentMonth})`}
            value={loading ? "..." : formatCurrency(totalCollected)} 
            icon={DollarSign}
            description={loading ? " " : `dari target ${formatCurrency(targetCollection)}`} 
        />
        <StatCard 
            title="Tunggakan Bulan Ini" 
            value={loading ? "..." : `${unpaidCount ?? 0} Warga`} 
            icon={AlertTriangle}
            description={loading ? " " : `Total ${formatCurrency(unpaidAmount)}`}
        />
        <StatCard 
            title="Tingkat Kepatuhan" 
            value={loading ? "..." : complianceRate ?? "0%"} 
            icon={PieChart}
            description={loading ? " " : "berdasarkan data bulan ini"}
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
