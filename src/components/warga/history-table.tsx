
"use client";

import { useState, useEffect, useMemo } from 'react';
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
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

const ITEMS_PER_PAGE = 3;

export function HistoryTable() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
    const [history, setHistory] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const searchParams = useSearchParams();
    const citizenId = searchParams.get("citizenId");

    useEffect(() => {
        const fetchHistory = async () => {
            if (citizenId) {
                setLoading(true);
                const paymentHistory = await getPaymentsForCitizen(citizenId);
                // Sort history to show the latest first
                paymentHistory.sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime());
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

    const paginatedHistory = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return history.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [history, currentPage]);

    const totalPages = Math.ceil(history.length / ITEMS_PER_PAGE);

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
                ) : paginatedHistory.length > 0 ? (
                    paginatedHistory.map((payment) => (
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
