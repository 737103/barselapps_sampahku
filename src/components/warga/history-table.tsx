
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
import { MoreHorizontal, Download } from "lucide-react";
import Image from "next/image";
import { DisputeModal } from './dispute-modal';
import type { Payment } from '@/lib/data';
import { getPaymentsForCitizen } from '@/lib/firebase/firestore';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import jsPDF from "jspdf";
import { terbilang } from "@/lib/utils";
import { format, parse } from 'date-fns';
import { id } from 'date-fns/locale';


type StatusVariant = "default" | "secondary" | "destructive";

const badgeVariant: Record<Payment["status"], StatusVariant> = {
    "Lunas": "default",
    "Belum Lunas": "destructive",
    "Tertunda": "secondary"
}

const ITEMS_PER_PAGE = 5;

export function HistoryTable() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
    const [history, setHistory] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const searchParams = useSearchParams();
    const citizenId = searchParams.get("citizenId");
    const { toast } = useToast();

    useEffect(() => {
        const fetchHistory = async () => {
            if (citizenId) {
                setLoading(true);
                const paymentHistory = await getPaymentsForCitizen(citizenId);
                // Sort history to show the latest first
                paymentHistory.sort((a, b) => {
                    const dateA = a.paymentDate ? parse(a.paymentDate, 'yyyy-MM-dd', new Date()) : new Date(0);
                    const dateB = b.paymentDate ? parse(b.paymentDate, 'yyyy-MM-dd', new Date()) : new Date(0);
                    return dateB.getTime() - dateA.getTime();
                });
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
    
    const handleDownloadReceipt = (payment: Payment) => {
        if (payment.status !== "Lunas") {
          toast({
            title: "Gagal Membuat Kuitansi",
            description: "Kuitansi hanya dapat diunduh untuk pembayaran yang lunas.",
            variant: "destructive"
          });
          return;
        }
        
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const citizenName = payment.citizen?.name || 'Warga';
        const paymentDate = payment.paymentDate ? parse(payment.paymentDate, 'yyyy-MM-dd', new Date()) : new Date();
        const formattedDate = format(paymentDate, "dd MMMM yyyy", { locale: id });
    
        // --- Receipt Content ---
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.text("KWITANSI", pageWidth / 2, 20, { align: 'center' });
    
        doc.setLineWidth(0.5);
        doc.line(10, 25, pageWidth - 10, 25);
        
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
    
        // Details Section
        const startY = 40;
        const lineHeight = 10;
        const labelX = 15;
        const valueX = 55;
    
        doc.text("Sudah terima dari", labelX, startY);
        doc.text(":", valueX - 2, startY);
        doc.text(citizenName, valueX, startY);
    
        doc.text("Uang Sebesar", labelX, startY + lineHeight);
        doc.text(":", valueX - 2, startY + lineHeight);
        doc.setFont('helvetica', 'italic');
        doc.text(`${terbilang(payment.amount)} Rupiah`, valueX, startY + lineHeight);
        doc.setFont('helvetica', 'normal');
    
        doc.text("Untuk Pembayaran", labelX, startY + lineHeight * 2);
        doc.text(":", valueX - 2, startY + lineHeight * 2);
        doc.text(`Iuran sampah bulan ${payment.period}`, valueX, startY + lineHeight * 2);
    
        // Amount Box
        doc.setFont('helvetica', 'bold');
        doc.text(`Rp. ${payment.amount.toLocaleString('id-ID')},-`, labelX, startY + lineHeight * 4);
        doc.setFont('helvetica', 'normal');
    
        // Signature section
        const signatureX = pageWidth - 70;
        doc.text(`Makassar, ${formattedDate}`, signatureX, startY + lineHeight * 4);
        doc.text("Kolektor Sampah,", signatureX, startY + lineHeight * 6);
        doc.text("Juliati S", signatureX, startY + lineHeight * 9);
    
    
        doc.save(`Kuitansi_${citizenName.replace(/ /g, '_')}_${payment.period.replace(/ /g, '_')}.pdf`);
    
        toast({
          title: "Berhasil Mengunduh Kuitansi",
          description: "File PDF kuitansi telah diunduh."
        });
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
                                <Image 
                                    src={payment.proofUrl} 
                                    alt={`Bukti ${payment.period}`}
                                    width={40}
                                    height={40}
                                    className="rounded-md object-cover"
                                    data-ai-hint="receipt"
                                />
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
                                    <DropdownMenuItem onClick={() => handleDownloadReceipt(payment)} disabled={payment.status !== 'Lunas'}>
                                        <Download className="mr-2 h-4 w-4" />
                                        Unduh Kuitansi
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleDispute(payment)}>
                                        Ajukan Sanggahan
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
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
