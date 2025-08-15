
"use client";

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { type Citizen, type Payment, type RTAccount } from '@/lib/data';
import { getCitizensByRT, getPaymentsByRT, getRTAccountById } from '@/lib/firebase/firestore';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import * as XLSX from 'xlsx';
import { useToast } from '@/hooks/use-toast';

const ITEMS_PER_PAGE = 10;

export default function LaporanPage() {
  const [paidResidents, setPaidResidents] = useState<({ citizen: Citizen, payment: Payment })[]>([]);
  const [loading, setLoading] = useState(true);
  const [rtAccount, setRtAccount] = useState<RTAccount | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  
  const searchParams = useSearchParams();
  const accountId = searchParams.get('accountId');
  const { toast } = useToast();
  
  const currentPeriod = format(new Date(), "MMMM yyyy", { locale: id });

  useEffect(() => {
    const fetchReportData = async () => {
      if (accountId) {
        setLoading(true);
        const account = await getRTAccountById(accountId);
        setRtAccount(account);
        
        if (account) {
          const allCitizens = await getCitizensByRT(account.rt, account.rw);
          const allPayments = await getPaymentsByRT(account.rt, account.rw);

          const paidPaymentsThisPeriod = allPayments.filter(p => 
            p.period === currentPeriod && p.status === 'Lunas'
          );

          const citizenMap = new Map(allCitizens.map(c => [c.id, c]));
          const paidResidentsData = paidPaymentsThisPeriod
            .map(payment => {
              const citizen = citizenMap.get(payment.citizenId);
              return citizen ? { citizen, payment } : null;
            })
            .filter(Boolean) as ({ citizen: Citizen, payment: Payment })[];
          
          paidResidentsData.sort((a,b) => a.citizen.name.localeCompare(b.citizen.name));

          setPaidResidents(paidResidentsData);
        }
        setLoading(false);
      }
    };
    fetchReportData();
  }, [accountId, currentPeriod]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return paidResidents.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [paidResidents, currentPage]);

  const totalPages = Math.ceil(paidResidents.length / ITEMS_PER_PAGE);

  const handleDownload = () => {
    if (paidResidents.length === 0) {
      toast({
        title: "Tidak ada data untuk diunduh",
        variant: "destructive"
      });
      return;
    }
    const dataToExport = paidResidents.map(({ citizen, payment }) => ({
      "Nama Warga": citizen.name,
      "NIK": citizen.nik,
      "No. KK": citizen.kk,
      "Alamat": citizen.address,
      "Periode": payment.period,
      "Tanggal Bayar": payment.paymentDate,
      "Jumlah": payment.amount,
      "Status": payment.status,
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, `Laporan Lunas ${currentPeriod}`);

    const objectMaxLength = Object.keys(dataToExport[0] || {}).map(key => ({
      wch: Math.max(...dataToExport.map(obj => obj[key as keyof typeof obj[0]]?.toString().length || 0), key.length)
    }));
    worksheet["!cols"] = objectMaxLength;

    const fileName = `Laporan_Lunas_RT${rtAccount?.rt}_${currentPeriod.replace(/ /g, '_')}.xlsx`;
    XLSX.writeFile(workbook, fileName);

    toast({
      title: "Laporan Diunduh",
      description: `File ${fileName} berhasil diunduh.`
    });
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Laporan Pembayaran Lunas</CardTitle>
            <CardDescription>
              Daftar warga yang sudah lunas membayar iuran untuk periode {currentPeriod}.
            </CardDescription>
          </div>
          <Button onClick={handleDownload} disabled={loading || paidResidents.length === 0}>
            <Download className="mr-2 h-4 w-4" />
            Unduh Laporan (XLS)
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Warga</TableHead>
                <TableHead>NIK</TableHead>
                <TableHead>Alamat</TableHead>
                <TableHead>Tanggal Bayar</TableHead>
                <TableHead>Jumlah</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">Memuat data...</TableCell>
                </TableRow>
              ) : paginatedData.length > 0 ? (
                paginatedData.map(({ citizen, payment }) => (
                  <TableRow key={citizen.id}>
                    <TableCell className="font-medium">{citizen.name}</TableCell>
                    <TableCell>{citizen.nik}</TableCell>
                    <TableCell>{citizen.address}</TableCell>
                    <TableCell>{payment.paymentDate}</TableCell>
                    <TableCell>{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(payment.amount)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">Belum ada warga yang lunas untuk periode ini.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
        {totalPages > 1 && (
            <CardFooter className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                    Halaman {currentPage} dari {totalPages}
                </span>
                <div className="flex gap-2">
                    <Button 
                        variant="outline"
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        Sebelumnya
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        Berikutnya
                    </Button>
                </div>
            </CardFooter>
        )}
      </Card>
    </>
  );
}
