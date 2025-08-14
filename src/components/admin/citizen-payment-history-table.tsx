
"use client";

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
import Image from "next/image";
import type { Payment } from '@/lib/data';
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type StatusVariant = "default" | "secondary" | "destructive";

const badgeVariant: Record<Payment["status"], StatusVariant> = {
    "Lunas": "default",
    "Belum Lunas": "destructive",
    "Tertunda": "secondary"
}

type CitizenPaymentHistoryTableProps = {
    payments: Payment[];
}

export function CitizenPaymentHistoryTable({ payments = [] }: CitizenPaymentHistoryTableProps) {
  const { toast } = useToast();
  
  const handleDownload = (proofUrl: string | null, period: string, citizenName: string) => {
    if (!proofUrl) {
      toast({
        title: "Gagal Mengunduh",
        description: "Tidak ada bukti pembayaran yang tersedia untuk diunduh.",
        variant: "destructive"
      });
      return;
    };
    
    // Create a temporary link element
    const link = document.createElement('a');
    link.href = proofUrl;

    const fileExtension = proofUrl.split('.').pop()?.split('?')[0] || 'png';
    const fileName = `Bukti_Bayar_${citizenName.replace(/ /g, '_')}_${period.replace(/ /g, '_')}.${fileExtension}`;
    link.download = fileName;
    
    // Append to the document, click it, and remove it
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Berhasil Mengunduh",
      description: `File ${fileName} telah diunduh.`
    });
  }
  
  return (
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
        {payments.length > 0 ? (
            payments.map((payment) => (
                <TableRow key={payment.id}>
                <TableCell className="font-medium">{payment.period}</TableCell>
                <TableCell>{payment.paymentDate || "-"}</TableCell>
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
                    ) : "-"}
                </TableCell>
                 <TableCell className="text-right">
                    <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleDownload(payment.proofUrl, payment.period, payment.citizen?.name || 'warga')}
                        disabled={!payment.proofUrl}
                    >
                        <Download className="mr-2 h-4 w-4"/>
                        Unduh Bukti
                    </Button>
                </TableCell>
                </TableRow>
            ))
        ) : (
            <TableRow>
                <TableCell colSpan={6} className="text-center">
                    Tidak ada riwayat pembayaran.
                </TableCell>
            </TableRow>
        )}
        </TableBody>
    </Table>
  );
}

