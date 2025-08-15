
"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { type Citizen, type Payment, type RTAccount } from "@/lib/data";
import { getCitizensByRT, getRTAccountById, recordPayment, createNotification, getPaymentsByRT, updatePayment } from "@/lib/firebase/firestore";
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
import { Calendar as CalendarIcon, MoreHorizontal } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { PaymentModal } from "@/components/rt/payment-modal";
import Image from "next/image";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { EditPaymentModal } from "@/components/rt/edit-payment-modal";


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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCitizen, setSelectedCitizen] = useState<Citizen | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  const searchParams = useSearchParams();
  const accountId = searchParams.get('accountId');
  const { toast } = useToast();
  
  const formattedPeriod = format(selectedPeriod, "MMMM yyyy", { locale: id });

  const fetchAllData = async () => {
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

  useEffect(() => {
    fetchAllData();
  }, [accountId]);

  const handleRecordPayment = (citizen: Citizen) => {
    setSelectedCitizen(citizen);
    setIsPaymentModalOpen(true);
  }

  const handleEditPayment = (payment: Payment) => {
    setSelectedPayment(payment);
    setIsEditModalOpen(true);
  }

  const handleSavePayment = async (paymentData: Omit<Payment, 'id' | 'citizenId' | 'proofUrl'> & { citizenName: string }) => {
    if (!selectedCitizen) return;

    const newPayment = await recordPayment(selectedCitizen.id, paymentData);

    if(newPayment) {
      await fetchAllData(); // Refetch all data to stay in sync
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
  
  const handleUpdatePayment = async (paymentToUpdate: Payment) => {
    const success = await updatePayment(paymentToUpdate.id, paymentToUpdate);
    if (success) {
      await fetchAllData(); // Refetch all data to stay in sync
      toast({
        title: "Pembayaran Diperbarui",
        description: "Data pembayaran telah berhasil diperbarui.",
      });
    } else {
      toast({
        title: "Gagal Memperbarui",
        description: "Terjadi kesalahan saat memperbarui pembayaran.",
        variant: "destructive",
      });
    }
    setIsEditModalOpen(false);
    setSelectedPayment(null);
  };


  const handleSendReminder = async () => {
    const unpaidResidents = residents.filter(r => {
        const paymentForPeriod = payments.find(p => p.citizenId === r.id && p.period === formattedPeriod);
        return !paymentForPeriod || paymentForPeriod.status !== 'Lunas';
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
                <CardTitle>Catat & Kelola Pembayaran Warga</CardTitle>
                <CardDescription>Catat atau ubah data pembayaran iuran sampah.</CardDescription>
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
                    <TableHead>Jumlah</TableHead>
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
                          <TableCell>
                            {paymentForPeriod ? new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(paymentForPeriod.amount) : "-"}
                          </TableCell>
                           <TableCell>
                            {paymentForPeriod?.proofUrl ? (
                                <a href={paymentForPeriod.proofUrl} target="_blank" rel="noopener noreferrer">
                                <Image 
                                    src={paymentForPeriod.proofUrl} 
                                    alt={`Bukti ${paymentForPeriod.period}`}
                                    width={40}
                                    height={40}
                                    className="rounded-md object-cover"
                                    data-ai-hint="receipt"
                                />
                                </a>
                            ) : '-'}
                        </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        <MoreHorizontal className="h-4 w-4" />
                                        <span className="sr-only">Buka menu</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                                    {paymentForPeriod ? (
                                        <DropdownMenuItem onClick={() => handleEditPayment(paymentForPeriod)}>
                                            Edit Pembayaran
                                        </DropdownMenuItem>
                                    ) : (
                                        <DropdownMenuItem onClick={() => handleRecordPayment(resident)}>
                                            Catat Pembayaran
                                        </DropdownMenuItem>
                                    )}
                                </DropdownMenuContent>
                            </DropdownMenu>
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
      {selectedCitizen && (
        <PaymentModal 
            isOpen={isPaymentModalOpen}
            onOpenChange={setIsPaymentModalOpen}
            citizen={selectedCitizen}
            onSave={handleSavePayment}
        />
      )}
      {selectedPayment && (
        <EditPaymentModal
            isOpen={isEditModalOpen}
            onOpenChange={setIsEditModalOpen}
            payment={selectedPayment}
            onSave={handleUpdatePayment}
        />
      )}
    </>
  );
}

