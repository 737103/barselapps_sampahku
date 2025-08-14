
"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
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
import { Eye } from "lucide-react";
import Image from "next/image";
import { DisputeModal } from './dispute-modal';
import type { Payment, Citizen } from '@/lib/data';
import { getPaymentsForCitizen } from '@/lib/firebase/firestore';

type StatusVariant = "default" | "secondary" | "destructive";

const badgeVariant: Record<Payment["status"], StatusVariant> = {
    "Lunas": "default",
    "Belum Lunas": "destructive",
    "Tertunda": "secondary"
}

export function HistoryTable() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
    const [history, setHistory] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);
    const searchParams = useSearchParams();
    const citizenId = searchParams.get("citizenId");

    useEffect(() => {
        const fetchHistory = async () => {
            if (citizenId) {
                setLoading(true);
                const paymentHistory = await getPaymentsForCitizen(citizenId);
                setHistory(paymentHistory);
                setLoading(false);
            }
        };
        fetchHistory();
    }, [citizenId]);

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
                    <TableHead>Status</TableHead>
                    <TableHead>Bukti</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {loading ? (
                    <TableRow>
                        <TableCell colSpan={6} className="text-center">Memuat riwayat...</TableCell>
                    </TableRow>
                ) : history.length > 0 ? (
                    history.map((payment) => (
                        <TableRow key={payment.id}>
                        <TableCell className="font-medium">{payment.period}</TableCell>
                        <TableCell>{payment.paymentDate || '-'}</TableCell>
                        <TableCell>{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(payment.amount)}</TableCell>
                        <TableCell>
                           <Badge variant={badgeVariant[payment.status]}>
                                {payment.status}
                            </Badge>
                        </TableCell>
                        <TableCell>
                            {payment.proofUrl ? (
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
                            ) : '-'}
                        </TableCell>
                        <TableCell className="text-right">
                        <Button variant="outline" size="sm" onClick={() => handleDispute(payment)}>
                            Ajukan Sanggahan
                        </Button>
                        </TableCell>
                        </TableRow>
                    ))
                ) : (
                     <TableRow>
                        <TableCell colSpan={6} className="text-center">Belum ada riwayat pembayaran.</TableCell>
                    </TableRow>
                )}
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
