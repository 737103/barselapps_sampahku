
"use client";

import { useState } from 'react';
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
import { payments as initialPayments, type Citizen, type Payment } from "@/lib/data";
import { PaymentModal } from "./payment-modal";
import { useToast } from '@/hooks/use-toast';
import { id } from 'date-fns/locale';
import { format } from 'date-fns';
import { MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { EditResidentModal } from './edit-resident-modal';
import { DeleteResidentAlert } from './delete-resident-alert';

type StatusVariant = "default" | "secondary" | "destructive";

const badgeVariant: Record<Payment["status"], StatusVariant> = {
    "Lunas": "default",
    "Belum Lunas": "destructive",
    "Tertunda": "secondary"
}

type ResidentsTableProps = {
    residents: Citizen[];
    setResidents: React.Dispatch<React.SetStateAction<Citizen[]>>;
}

export function ResidentsTable({ residents, setResidents }: ResidentsTableProps) {
  const [selectedCitizen, setSelectedCitizen] = useState<Citizen | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [payments, setPayments] = useState(initialPayments);
  const { toast } = useToast();

  const getPaymentStatus = (citizenId: string): Payment['status'] => {
      const currentPeriod = format(new Date(), "MMMM yyyy", { locale: id });
      const payment = payments.find(p => p.citizenId === citizenId && p.period === currentPeriod);
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

  const handleSavePayment = (paymentData: Omit<Payment, 'id' | 'citizenId' | 'status' | 'proofUrl'> & { citizenName: string }) => {
    if (!selectedCitizen) return;

    const newPayment: Payment = {
      id: `p${payments.length + 1}`,
      citizenId: selectedCitizen.id,
      status: "Lunas",
      proofUrl: "https://placehold.co/400x400.png", // placeholder
      citizen: selectedCitizen,
      ...paymentData,
    };

    setPayments(prevPayments => {
        const existingPaymentIndex = prevPayments.findIndex(p => 
            p.citizenId === newPayment.citizenId && p.period === newPayment.period
        );

        if (existingPaymentIndex !== -1) {
            const updatedPayments = [...prevPayments];
            updatedPayments[existingPaymentIndex] = {
                ...updatedPayments[existingPaymentIndex],
                ...paymentData,
                status: "Lunas",
                proofUrl: "https://placehold.co/400x400.png",
            };
            return updatedPayments;
        } else {
            return [...prevPayments, newPayment];
        }
    });

    toast({
        title: "Pembayaran Berhasil Disimpan",
        description: `Pembayaran untuk ${paymentData.citizenName} periode ${paymentData.period} telah dicatat.`,
    });
    
    setIsPaymentModalOpen(false);
    setSelectedCitizen(null);
  }

  const confirmDelete = () => {
    if (!selectedCitizen) return;
    setResidents(prev => prev.filter(r => r.id !== selectedCitizen.id));
    toast({
        title: "Data Warga Dihapus",
        description: `Data untuk ${selectedCitizen.name} telah dihapus.`,
    });
    setIsDeleteAlertOpen(false);
    setSelectedCitizen(null);
  };
  
  const handleSaveEdit = (updatedCitizen: Citizen) => {
      setResidents(prev => prev.map(r => r.id === updatedCitizen.id ? updatedCitizen : r));
      toast({
          title: "Data Warga Diperbarui",
          description: `Data untuk ${updatedCitizen.name} telah berhasil diperbarui.`
      });
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
                    <TableHead>Alamat</TableHead>
                    <TableHead>Status Pembayaran</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {residents.map((resident) => (
                    <TableRow key={resident.id}>
                    <TableCell className="font-medium">{resident.name}</TableCell>
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
                ))}
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
