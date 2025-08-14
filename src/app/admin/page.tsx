
"use client";

import { useState, useEffect } from "react";
import { StatCard } from "@/components/stat-card";
import { DisputesTable } from "@/components/admin/disputes-table";
import { DollarSign, Users, MessageSquareWarning, TrendingUp } from "lucide-react";
import { getAllCitizens } from "@/lib/firebase/firestore";

export default function AdminDashboardPage() {
  const [totalCitizens, setTotalCitizens] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTotalCitizens = async () => {
      setLoading(true);
      const citizens = await getAllCitizens();
      setTotalCitizens(citizens.length);
      setLoading(false);
    };
    fetchTotalCitizens();
  }, []);

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <StatCard 
            title="Total Iuran Terkumpul" 
            value="Rp 12.550.000" 
            icon={DollarSign}
            description="+20.1% from last month" 
        />
        <StatCard 
            title="Total Warga Terdaftar" 
            value={loading ? "Memuat..." : (totalCitizens ?? 0).toLocaleString('id-ID')}
            icon={Users}
            description={!loading && totalCitizens !== null ? "warga terdaftar di sistem" : " "}
        />
        <StatCard 
            title="Sanggahan Aktif" 
            value="5" 
            icon={MessageSquareWarning}
            description="2 baru hari ini" 
        />
        <StatCard 
            title="Tingkat Pembayaran" 
            value="92.8%" 
            icon={TrendingUp}
            description="+1.2% from last month" 
        />
      </div>
      <div className="grid gap-4 md:gap-8">
        <DisputesTable />
      </div>
    </>
  );
}
