
import { HistoryTable } from "@/components/warga/history-table";
import React from 'react';

export default function RiwayatPembayaranPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 bg-muted/40">
      <React.Suspense fallback={<div>Memuat riwayat...</div>}>
        <HistoryTable />
      </React.Suspense>
    </main>
  );
}
