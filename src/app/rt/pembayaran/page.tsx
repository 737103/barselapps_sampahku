
"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { type Citizen, type Payment, type RTAccount } from "@/lib/data";
import { getCitizensByRT, getRTAccountById, recordPayment, createNotification, getPaymentsByRT } from "@/lib/firebase/firestore";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { PaymentModal } from "@/components/rt/payment-modal";
import Image from "next/image";


type StatusVariant = "default" | "secondary" | "destructive";

const badgeVariant: Record<string, StatusVariant> = {
    "Lunas": "default",
    "Belum Lunas": "destructive",
    "Tertunda": "secondary"
}

const ITEMS_PER_PAGE = 3;

export default function PembayaranPage() {
  const [residents, setResidents] = useState<Citizen[]>([]);
  const [loading, setLoading] = useState(true);
  const [rtAccount, setRtAccount] = useState<RTAccount | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<Date>(new Date());
  const [currentPage, setCurrentPage] = useState(1);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedCitizen, setSelectedCitizen] = useState<Citizen | null>(null);

  const searchParams = useSearchParams();
  const accountId = searchParams.get('accountId');
  const { toast } = useToast();
  
  const formattedPeriod = format(selectedPeriod, "MMMM yyyy", { locale: id });

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
          setPayments(fetchedPayments);
        }
        setLoading(false);
      }
    };
    fetchAccountAndData();
  }, [accountId]);

  const handleRecordPayment = (citizen: Citizen) => {
    setSelectedCitizen(citizen);
    setIsPaymentModalOpen(true);
  }

  const handleSavePayment = async (paymentData: Omit<Payment, 'id' | 'citizenId' | 'proofUrl'> & { citizenName: string }) => {
    if (!selectedCitizen) return;

    const newPayment = await recordPayment(selectedCitizen.id, paymentData);

    if(newPayment) {
      // Re-fetch payments to ensure data is up-to-date
      if(rtAccount) {
         const fetchedPayments = await getPaymentsByRT(rtAccount.rt, rtAccount.rw);
         setPayments(fetchedPayments);
      }
      toast({
          title: "Pembayaran Berhasil Disimpan",
          description: `Pembayaran untuk ${paymentData.citizenName} periode ${paymentData.period} telah dicatat.`,
      });
    } else {
        toast({
            title: "Gagal Menyimpan Pembayaran",
            variant: "destructive"
        })
    }
    
    setIsPaymentModalOpen(false);
    setSelectedCitizen(null);
  }

  const handleSendReminder = async () => {
    const unpaidResidents = residents.filter(r => {
        const paymentForPeriod = payments.find(p => p.citizenId === r.id && p.period === formattedPeriod);
        return !paymentForPeriod;
    });

    if (unpaidResidents.length === 0) {
       toast({
        title: "Tidak Ada Tunggakan",
        description: `Semua warga telah membayar iuran untuk periode ${formattedPeriod}.`,
      });
      return;
    }
    
    let successCount = 0;
    for (const resident of unpaidResidents) {
        const notificationData = {
            citizenId: resident.id,
            message: `Mohon segera lakukan pembayaran iuran sampah untuk periode ${formattedPeriod}.`,
            type: 'payment_reminder' as const,
            period: formattedPeriod,
        };
        const result = await createNotification(notificationData);
        if (result) {
            successCount++;
        }
    }

    if (successCount > 0) {
        toast({
          title: "Pengingat Terkirim",
          description: `Pengingat pembayaran telah dikirimkan kepada ${successCount} warga yang belum bayar.`,
        });
    } else {
        toast({
            title: "Gagal Mengirim Pengingat",
            description: "Terjadi kesalahan saat mengirim pengingat.",
            variant: "destructive",
        });
    }
  };

  const paginatedResidents = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return residents.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [residents, currentPage]);

  const totalPages = Math.ceil(residents.length / ITEMS_PER_PAGE);

  return (
    <>
      <Card>
        <CardHeader className="flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <CardTitle>Catat Pembayaran Warga</CardTitle>
                <CardDescription>Pilih warga untuk mencatat pembayaran iuran sampah.</CardDescription>
            </div>
            <div className="flex items-center gap-2">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                        variant={"outline"}
                        className={cn(
                            "w-[200px] justify-start text-left font-normal",
                            !selectedPeriod && "text-muted-foreground"
                        )}
                        >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedPeriod ? format(selectedPeriod, "MMMM yyyy", { locale: id }) : <span>Pilih periode</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                        mode="single"
                        selected={selectedPeriod}
                        onSelect={(date) => {
                            if (date) setSelectedPeriod(date);
                            setCurrentPage(1);
                        }}
                        initialFocus
                        captionLayout="dropdown-buttons"
                        fromYear={2023}
                        toYear={2025}
                        />
                    </PopoverContent>
                </Popover>
                <Button onClick={handleSendReminder}>Kirim Pengingat</Button>
            </div>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Nama Warga</TableHead>
                    <TableHead>NIK</TableHead>
                    <TableHead>Status Pembayaran</TableHead>
                    <TableHead>Periode</TableHead>
                    <TableHead>Bukti</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">Memuat data...</TableCell>
                    </TableRow>
                  ) : paginatedResidents.length > 0 ? (
                    paginatedResidents.map((resident) => {
                      const paymentForPeriod = payments.find(p => p.citizenId === resident.id && p.period === formattedPeriod);
                      const paymentStatus = paymentForPeriod ? paymentForPeriod.status : "Belum Lunas";
                      return (
                        <TableRow key={resident.id}>
                          <TableCell className="font-medium">{resident.name}</TableCell>
                          <TableCell>{resident.nik}</TableCell>
                          <TableCell>
                              <Badge variant={badgeVariant[paymentStatus]}>
                                  {paymentStatus}
                              </Badge>
                          </TableCell>
                          <TableCell>{paymentForPeriod?.period || "-"}</TableCell>
                           <TableCell>
                            {paymentForPeriod?.proofUrl ? (
                                <Image 
                                    src={paymentForPeriod.proofUrl} 
                                    alt={`Bukti ${paymentForPeriod.period}`}
                                    width={40}
                                    height={40}
                                    className="rounded-md object-cover"
                                    data-ai-hint="receipt"
                                />
                            ) : '-'}
                        </TableCell>
                          <TableCell className="text-right">
                            <Button variant="outline" size="sm" onClick={() => handleRecordPayment(resident)}>
                                Catat Pembayaran
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">Belum ada warga terdaftar.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
            </Table>
        </CardContent>
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
      </Card>
      {selectedCitizen && (
        <PaymentModal 
            isOpen={isPaymentModalOpen}
            onOpenChange={setIsPaymentModalOpen}
            citizen={selectedCitizen}
            onSave={handleSavePayment}
        />
      )}
    </>
  );
}
