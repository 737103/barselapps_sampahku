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
import { wargaHistory } from "@/lib/data";
import { Eye } from "lucide-react";
import Image from "next/image";
import { DisputeModal } from './dispute-modal';
import type { Payment } from '@/lib/data';

export function HistoryTable() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

    const handleDispute = (payment: Payment) => {
        setSelectedPayment(payment);
        setIsModalOpen(true);
    }
  return (
    <>
    <Card>
        <CardHeader>
            <CardTitle>Riwayat Pembayaran</CardTitle>
            <CardDescription>Daftar semua transaksi iuran sampah Anda.</CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Periode</TableHead>
                    <TableHead>Tanggal Bayar</TableHead>
                    <TableHead>Jumlah</TableHead>
                    <TableHead>Bukti</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {wargaHistory.map((payment) => (
                    <TableRow key={payment.id}>
                    <TableCell className="font-medium">{payment.period}</TableCell>
                    <TableCell>{payment.paymentDate}</TableCell>
                    <TableCell>{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(payment.amount)}</TableCell>
                    <TableCell>
                        <a href={payment.proofUrl} target="_blank" rel="noopener noreferrer">
                            <Image 
                                src={payment.proofUrl} 
                                alt={`Bukti ${payment.period}`}
                                width={40}
                                height={40}
                                className="rounded-md object-cover"
                                data-ai-hint="receipt"
                            />
                        </a>
                    </TableCell>
                    <TableCell className="text-right">
                       <Button variant="outline" size="sm" onClick={() => handleDispute(payment)}>
                         Ajukan Sanggahan
                       </Button>
                    </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
        </CardContent>
    </Card>
    {selectedPayment && (
        <DisputeModal 
            isOpen={isModalOpen}
            onOpenChange={setIsModalOpen}
            payment={selectedPayment}
        />
    )}
    </>
  );
}
