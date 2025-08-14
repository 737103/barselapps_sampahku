
"use client";

import { useState, useEffect } from 'react';
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { type Citizen, type Payment } from "@/lib/data";
import { PaymentModal } from "./payment-modal";
import { useToast } from '@/hooks/use-toast';
import { id } from 'date-fns/locale';
import { format } from 'date-fns';
import { MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { EditResidentModal } from './edit-resident-modal';
import { DeleteResidentAlert } from './delete-resident-alert';
import { deleteCitizen, getPaymentsForCitizen, recordPayment, updateCitizen } from '@/lib/firebase/firestore';

type StatusVariant = "default" | "secondary" | "destructive";

const badgeVariant: Record<Payment["status"], StatusVariant> = {
    "Lunas": "default",
    "Belum Lunas": "destructive",
    "Tertunda": "secondary"
}

type ResidentsTableProps = {
    residents: Citizen[];
    setResidents: React.Dispatch<React.SetStateAction<Citizen[]>>;
    loading: boolean;
}

export function ResidentsTable({ residents = [], setResidents = () => {}, loading }: ResidentsTableProps) {
  const [selectedCitizen, setSelectedCitizen] = useState<Citizen | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [payments, setPayments] = useState<Map<string, Payment>>(new Map());
  const { toast } = useToast();

  const currentPeriod = format(new Date(), "MMMM yyyy", { locale: id });

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


  const getPaymentStatus = (citizenId: string): Payment['status'] => {
      const payment = payments.get(citizenId);
      return payment ? payment.status : "Belum Lunas";
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

  const handleSavePayment = async (paymentData: Omit<Payment, 'id' | 'citizenId' | 'status' | 'proofUrl'> & { citizenName: string }) => {
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


  return (
    <>
    <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>Data Warga RT 001</CardTitle>
                <CardDescription>Status pembayaran iuran sampah bulan ini.</CardDescription>
            </div>
             <Button>Kirim Pengingat</Button>
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
                    <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">Memuat data...</TableCell>
                    </TableRow>
                  ) : residents.length > 0 ? (
                    residents.map((resident) => (
                      <TableRow key={resident.id}>
                        <TableCell className="font-medium">{resident.name}</TableCell>
                        <TableCell>{resident.nik}</TableCell>
                        <TableCell>{resident.kk}</TableCell>
                        <TableCell>{resident.address}</TableCell>
                        <TableCell>
                            <Badge variant={badgeVariant[getPaymentStatus(resident.id)]}>
                                {getPaymentStatus(resident.id)}
                            </Badge>
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
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">Belum ada warga terdaftar.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
            </Table>
        </CardContent>
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
