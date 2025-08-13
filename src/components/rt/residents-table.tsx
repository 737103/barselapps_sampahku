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
import { payments } from "@/lib/data";
import { PaymentModal } from "./payment-modal";

const getPaymentStatus = (citizenId: string): Payment['status'] => {
    const payment = payments.find(p => p.citizenId === citizenId && p.period === "Juni 2024");
    return payment ? payment.status : "Belum Lunas";
}

type StatusVariant = "default" | "secondary" | "destructive";

const badgeVariant: Record<Payment["status"], StatusVariant> = {
    "Lunas": "default",
    "Belum Lunas": "destructive",
    "Tertunda": "secondary"
}

export function ResidentsTable() {
  const [selectedCitizen, setSelectedCitizen] = useState<Citizen | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRecordPayment = (citizen: Citizen) => {
    setSelectedCitizen(citizen);
    setIsModalOpen(true);
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
                {rtResidents.map((resident) => (
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
        />
    )}
    </>
  );
}
