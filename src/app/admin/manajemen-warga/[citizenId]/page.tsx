
"use client";

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { CitizenPaymentHistoryTable } from '@/components/admin/citizen-payment-history-table';
import { payments, citizens, type Citizen, type Payment } from '@/lib/data';
import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function CitizenPaymentHistoryPage() {
  const params = useParams();
  const citizenId = params.citizenId as string;

  const [citizen, setCitizen] = useState<Citizen | null>(null);
  const [paymentHistory, setPaymentHistory] = useState<Payment[]>([]);

  useEffect(() => {
    if (citizenId) {
      const foundCitizen = citizens.find(c => c.id === citizenId);
      if (foundCitizen) {
        setCitizen(foundCitizen);
        const history = payments.filter(p => p.citizenId === citizenId);
        setPaymentHistory(history);
      }
    }
  }, [citizenId]);

  if (!citizen) {
    return (
        <div className="flex items-center justify-center h-full">
            <p>Warga tidak ditemukan.</p>
        </div>
    );
  }

  return (
    <div className="space-y-4">
        <Link href="/admin/manajemen-warga">
            <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Kembali ke Manajemen Warga
            </Button>
        </Link>
        <Card>
            <CardHeader>
                <CardTitle>Riwayat Pembayaran: {citizen.name}</CardTitle>
                <CardDescription>Menampilkan seluruh riwayat pembayaran iuran untuk {citizen.name}.</CardDescription>
            </CardHeader>
            <CardContent>
                <CitizenPaymentHistoryTable payments={paymentHistory} />
            </CardContent>
        </Card>
    </div>
  );
}
