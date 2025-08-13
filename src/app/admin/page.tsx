import { StatCard } from "@/components/stat-card";
import { DisputesTable } from "@/components/admin/disputes-table";
import { DollarSign, Users, MessageSquareWarning, TrendingUp } from "lucide-react";

export default function AdminDashboardPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 bg-muted/40">
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <StatCard 
            title="Total Iuran Terkumpul" 
            value="Rp 12.550.000" 
            icon={DollarSign}
            description="+20.1% from last month" 
        />
        <StatCard 
            title="Total Warga Terdaftar" 
            value="3,150" 
            icon={Users}
            description="+180 since last month" 
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
    </main>
  );
}
