

"use client";

import { useState, useEffect, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { type Citizen, type Payment, type RTAccount } from "@/lib/data";
import { PaymentModal } from "./payment-modal";
import { useToast } from '@/hooks/use-toast';
import { id } from 'date-fns/locale';
import { format } from 'date-fns';
import { MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { EditResidentModal } from './edit-resident-modal';
import { DeleteResidentAlert } from './delete-resident-alert';
import { createNotification, deleteCitizen, getPaymentsForCitizen, recordPayment, updateCitizen } from '@/lib/firebase/firestore';

type StatusVariant = "default" | "secondary" | "destructive";

const badgeVariant: Record<Payment["status"], StatusVariant> = {
    "Lunas": "default",
    "Belum Lunas": "destructive",
    "Tertunda": "secondary"
}

const ITEMS_PER_PAGE = 3;

type ResidentsTableProps = {
    residents: Citizen[];
    setResidents: React.Dispatch<React.SetStateAction<Citizen[]>>;
    loading?: boolean;
    rtAccount: RTAccount | null;
    title?: string;
    description?: string;
}

export function ResidentsTable({ 
    residents = [], 
    setResidents = () => {}, 
    loading = false, 
    rtAccount,
    title = "Data Pembayaran Sampah",
    description
}: ResidentsTableProps) {
  const [selectedCitizen, setSelectedCitizen] = useState<Citizen | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [payments, setPayments] = useState<Map<string, Payment>>(new Map());
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();

  const currentPeriod = format(new Date(), "MMMM yyyy", { locale: id });
  const defaultDescription = `Status pembayaran iuran sampah bulan ini untuk RT ${rtAccount?.rt || '...'} / RW ${rtAccount?.rw || '...'}.`

  useEffect(() => {
    const fetchPayments = async () => {
      if (residents.length > 0) {
        const paymentMap = new Map<string, Payment>();
        for (const resident of residents) {
          const citizenPayments = await getPaymentsForCitizen(resident.id);
          const periodPayment = citizenPayments.find(p => p.period === currentPeriod);

          if (periodPayment) {
            paymentMap.set(resident.id, periodPayment);
          }
        }
        setPayments(paymentMap);
      }
    };
    fetchPayments();
  }, [residents, currentPeriod]);


  const getPaymentForCitizen = (citizenId: string): Payment | undefined => {
      return payments.get(citizenId);
  }

  const handleRecordPayment = (citizen: Citizen) => {
    setSelectedCitizen(citizen);
    setIsPaymentModalOpen(true);
  }
  
  const handleEdit = (citizen: Citizen) => {
    setSelectedCitizen(citizen);
    setIsEditModalOpen(true);
  }
  
  const handleDelete = (citizen: Citizen) => {
    setSelectedCitizen(citizen);
    setIsDeleteAlertOpen(true);
  }

  const handleSavePayment = async (paymentData: Omit<Payment, 'id' | 'citizenId'> & { citizenName: string }) => {
    if (!selectedCitizen) return;

    const newPayment = await recordPayment(selectedCitizen.id, paymentData);

    if(newPayment) {
      setPayments(prev => new Map(prev).set(selectedCitizen.id, newPayment));
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

  const confirmDelete = async () => {
    if (!selectedCitizen) return;
    const success = await deleteCitizen(selectedCitizen.id);

    if (success) {
      setResidents(prev => prev.filter(r => r.id !== selectedCitizen.id));
      toast({
          title: "Data Warga Dihapus",
          description: `Data untuk ${selectedCitizen.name} telah dihapus.`,
      });
    } else {
        toast({
            title: "Gagal Menghapus Data",
            description: "Terjadi kesalahan saat menghapus data warga.",
            variant: "destructive",
        })
    }
    setIsDeleteAlertOpen(false);
    setSelectedCitizen(null);
  };
  
  const handleSaveEdit = async (updatedCitizen: Citizen) => {
      const success = await updateCitizen(updatedCitizen.id, updatedCitizen);
      if(success) {
        setResidents(prev => prev.map(r => r.id === updatedCitizen.id ? updatedCitizen : r));
        toast({
            title: "Data Warga Diperbarui",
            description: `Data untuk ${updatedCitizen.name} telah berhasil diperbarui.`
        });
      } else {
        toast({
            title: "Gagal Memperbarui Data",
            variant: "destructive"
        });
      }
      setIsEditModalOpen(false);
      setSelectedCitizen(null);
  }

  const handleSendReminder = async () => {
    const unpaidResidents = residents.filter(r => {
        const payment = getPaymentForCitizen(r.id);
        return !payment || payment.status !== 'Lunas';
    });

    if (unpaidResidents.length === 0) {
       toast({
        title: "Tidak Ada Tunggakan",
        description: "Semua warga telah membayar iuran bulan ini.",
      });
      return;
    }
    
    let successCount = 0;
    for (const resident of unpaidResidents) {
        const notificationData = {
            citizenId: resident.id,
            message: `Mohon segera lakukan pembayaran iuran sampah untuk periode ${currentPeriod}.`,
            type: 'payment_reminder' as const,
            period: currentPeriod,
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
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description || defaultDescription}</CardDescription>
            </div>
             <Button onClick={handleSendReminder}>Kirim Pengingat</Button>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Nama Warga</TableHead>
                    <TableHead>NIK</TableHead>
                    <TableHead>No. KK</TableHead>
                    <TableHead>Alamat</TableHead>
                    <TableHead>Status Pembayaran</TableHead>
                    <TableHead>Periode</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center">Memuat data...</TableCell>
                    </TableRow>
                  ) : paginatedResidents.length > 0 ? (
                    paginatedResidents.map((resident) => {
                      const payment = getPaymentForCitizen(resident.id);
                      const paymentStatus = payment && payment.period === currentPeriod ? payment.status : "Belum Lunas";
                      return (
                        <TableRow key={resident.id}>
                          <TableCell className="font-medium">{resident.name}</TableCell>
                          <TableCell>{resident.nik}</TableCell>
                          <TableCell>{resident.kk}</TableCell>
                          <TableCell>{resident.address}</TableCell>
                          <TableCell>
                              <Badge variant={badgeVariant[paymentStatus]}>
                                  {paymentStatus}
                              </Badge>
                          </TableCell>
                          <TableCell>{payment?.period || "-"}</TableCell>
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
                                      <DropdownMenuItem onClick={() => handleRecordPayment(resident)}>
                                          Catat Pembayaran
                                      </DropdownMenuItem>
                                      <DropdownMenuItem onClick={() => handleEdit(resident)}>
                                          Edit Data
                                      </DropdownMenuItem>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem 
                                          className="text-destructive focus:text-destructive"
                                          onClick={() => handleDelete(resident)}
                                      >
                                          Hapus Data
                                      </DropdownMenuItem>
                                  </DropdownMenuContent>
                              </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center">Belum ada warga terdaftar.</TableCell>
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
        <>
            <PaymentModal 
                isOpen={isPaymentModalOpen}
                onOpenChange={setIsPaymentModalOpen}
                citizen={selectedCitizen}
                onSave={handleSavePayment}
            />
            <EditResidentModal
                isOpen={isEditModalOpen}
                onOpenChange={setIsEditModalOpen}
                citizen={selectedCitizen}
                onSave={handleSaveEdit}
            />
            <DeleteResidentAlert
                isOpen={isDeleteAlertOpen}
                onOpenChange={setIsDeleteAlertOpen}
                onConfirm={confirmDelete}
                citizen={selectedCitizen}
            />
        </>
    )}
    </>
  );
}
