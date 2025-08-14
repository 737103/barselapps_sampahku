
"use client";

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { CitizenPaymentHistoryTable } from '@/components/admin/citizen-payment-history-table';
import { type Citizen, type Payment } from '@/lib/data';
import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { getCitizenById, getPaymentsForCitizen } from '@/lib/firebase/firestore';

export default function CitizenPaymentHistoryPage() {
  const params = useParams();
  const citizenId = params.citizenId as string;

  const [citizen, setCitizen] = useState<Citizen | null>(null);
  const [paymentHistory, setPaymentHistory] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (citizenId) {
      const fetchData = async () => {
        setLoading(true);
        const foundCitizen = await getCitizenById(citizenId);
        if (foundCitizen) {
          setCitizen(foundCitizen);
          const history = await getPaymentsForCitizen(citizenId);
          setPaymentHistory(history);
        }
        setLoading(false);
      }
      fetchData();
    }
  }, [citizenId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
          <p>Memuat data...</p>
      </div>
    )
  }

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
