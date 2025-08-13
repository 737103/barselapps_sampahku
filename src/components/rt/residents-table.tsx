
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
import { rtResidents, type Citizen, type Payment } from "@/lib/data";
import { payments as initialPayments } from "@/lib/data";
import { PaymentModal } from "./payment-modal";
import { useToast } from '@/hooks/use-toast';

type StatusVariant = "default" | "secondary" | "destructive";

const badgeVariant: Record<Payment["status"], StatusVariant> = {
    "Lunas": "default",
    "Belum Lunas": "destructive",
    "Tertunda": "secondary"
}

type ResidentsTableProps = {
    residents?: Citizen[];
}

export function ResidentsTable({ residents = rtResidents }: ResidentsTableProps) {
  const [selectedCitizen, setSelectedCitizen] = useState<Citizen | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [payments, setPayments] = useState(initialPayments);
  const { toast } = useToast();

  const getPaymentStatus = (citizenId: string): Payment['status'] => {
      const payment = payments.find(p => p.citizenId === citizenId && p.period === "Juni 2024");
      return payment ? payment.status : "Belum Lunas";
  }

  const handleRecordPayment = (citizen: Citizen) => {
    setSelectedCitizen(citizen);
    setIsModalOpen(true);
  }

  const handleSavePayment = (paymentData: Omit<Payment, 'id' | 'citizenId' | 'status' | 'proofUrl'> & { citizenName: string }) => {
    console.log("Saving payment:", paymentData);
    
    // In a real app, you would update the database here.
    // For now, we just update the local state to reflect the change.
    
    const existingPaymentIndex = payments.findIndex(p => 
        p.citizenId === selectedCitizen?.id && p.period === paymentData.period
    );

    if (existingPaymentIndex > -1) {
        setPayments(prev => {
            const newPayments = [...prev];
            newPayments[existingPaymentIndex] = {
                ...newPayments[existingPaymentIndex],
                ...paymentData,
                status: "Lunas",
                proofUrl: "https://placehold.co/400x400.png"
            };
            return newPayments;
        });
    } else {
        const newPayment: Payment = {
            id: `p${payments.length + 1}`,
            citizenId: selectedCitizen!.id,
            status: "Lunas",
            proofUrl: "https://placehold.co/400x400.png",
            citizen: selectedCitizen!,
            ...paymentData,
        };
        setPayments(prev => [...prev, newPayment]);
    }

    toast({
        title: "Pembayaran Berhasil Disimpan",
        description: `Pembayaran untuk ${paymentData.citizenName} periode ${paymentData.period} telah dicatat.`,
    });
    setIsModalOpen(false);
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
                       <Button variant="outline" size="sm" onClick={() => handleRecordPayment(resident)}>
                         Catat Pembayaran
                       </Button>
                    </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
        </CardContent>
    </Card>
    {selectedCitizen && (
        <PaymentModal 
            isOpen={isModalOpen}
            onOpenChange={setIsModalOpen}
            citizen={selectedCitizen}
            onSave={handleSavePayment}
        />
    )}
    </>
  );
}
