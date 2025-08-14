
"use client";

import { useState, useEffect } from "react";
import { StatCard } from "@/components/stat-card";
import { DisputesTable } from "@/components/admin/disputes-table";
import { DollarSign, Users, MessageSquareWarning, TrendingUp } from "lucide-react";
import { getAllCitizens, getAllPayments } from "@/lib/firebase/firestore";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import type { Payment } from "@/lib/data";

export default function AdminDashboardPage() {
  const [totalCitizens, setTotalCitizens] = useState<number | null>(null);
  const [totalCollected, setTotalCollected] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      // Fetch citizens
      const citizens = await getAllCitizens();
      setTotalCitizens(citizens.length);

      // Fetch and process payments
      const payments = await getAllPayments();
      const currentPeriod = format(new Date(), "MMMM yyyy", { locale: id });

      const filteredPayments = payments.filter(p => p.period === currentPeriod && (p.status === 'Lunas' || p.status === 'Belum Lunas'));

      const latestPayments = new Map<string, Payment>();
      
      filteredPayments.forEach(payment => {
        const key = `${payment.citizenId}-${payment.period}`;
        const existingPayment = latestPayments.get(key);

        if (!existingPayment || new Date(payment.paymentDate) > new Date(existingPayment.paymentDate)) {
            latestPayments.set(key, payment);
        }
      });
      
      const total = Array.from(latestPayments.values()).reduce((acc, p) => acc + p.amount, 0);
      setTotalCollected(total);

      setLoading(false);
    };
    fetchData();
  }, []);

  const formatCurrency = (value: number | null) => {
    if (value === null) return "Memuat...";
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
            title="Total Iuran Terkumpul (Bulan Ini)" 
            value={formatCurrency(totalCollected)} 
            icon={DollarSign}
            description={!loading ? "Data bulan ini" : " "} 
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
