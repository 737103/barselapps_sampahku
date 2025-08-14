
"use client";

import { useState, useEffect } from "react";
import { StatCard } from "@/components/stat-card";
import { DisputesTable } from "@/components/admin/disputes-table";
import { DollarSign, Users, MessageSquareWarning, TrendingUp } from "lucide-react";
import { getAllCitizens, getAllDisputes, getAllPayments } from "@/lib/firebase/firestore";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import type { Dispute, Payment } from "@/lib/data";

export default function AdminDashboardPage() {
  const [totalCitizens, setTotalCitizens] = useState<number | null>(null);
  const [totalCollected, setTotalCollected] = useState<number | null>(null);
  const [activeDisputesCount, setActiveDisputesCount] = useState<number | null>(null);
  const [todayDisputesCount, setTodayDisputesCount] = useState<number | null>(null);
  const [paymentRate, setPaymentRate] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      const citizensPromise = getAllCitizens();
      const paymentsPromise = getAllPayments();
      const disputesPromise = getAllDisputes();

      const [citizens, payments, disputes] = await Promise.all([citizensPromise, paymentsPromise, disputesPromise]);

      // Process citizens
      const totalCitizenCount = citizens.length;
      setTotalCitizens(totalCitizenCount);

      // Process and process payments
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
      
      const paymentsArray = Array.from(latestPayments.values());
      const total = paymentsArray.reduce((acc, p) => acc + p.amount, 0);
      setTotalCollected(total);
      
      // Calculate Payment Rate
      if (totalCitizenCount > 0) {
        const paidCitizensCount = paymentsArray.filter(p => p.status === 'Lunas').length;
        const rate = (paidCitizensCount / totalCitizenCount) * 100;
        setPaymentRate(`${rate.toFixed(1)}%`);
      } else {
        setPaymentRate("0%");
      }


      // Process disputes
      const activeDisputes = disputes.filter(d => d.status === "Baru" || d.status === "Diproses");
      setActiveDisputesCount(activeDisputes.length);

      const today = format(new Date(), "yyyy-MM-dd");
      const todayDisputes = disputes.filter(d => d.submittedDate === today);
      setTodayDisputesCount(todayDisputes.length);


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
  
  const getTodayDisputesDescription = () => {
    if (loading || todayDisputesCount === null) return " ";
    if (todayDisputesCount === 0) return "Tidak ada sanggahan baru";
    if (todayDisputesCount === 1) return "1 baru hari ini";
    return `${todayDisputesCount} baru hari ini`;
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
            value={loading ? "Memuat..." : (activeDisputesCount ?? 0).toString()} 
            icon={MessageSquareWarning}
            description={getTodayDisputesDescription()}
        />
        <StatCard 
            title="Tingkat Pembayaran" 
            value={loading ? "Memuat..." : (paymentRate ?? '0%')} 
            icon={TrendingUp}
            description={!loading ? "berdasarkan data lunas bulan ini" : " "} 
        />
      </div>
      <div className="grid gap-4 md:gap-8">
        <DisputesTable />
      </div>
    </>
  );
}
