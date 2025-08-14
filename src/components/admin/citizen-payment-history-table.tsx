
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
  return (
    <Table>
        <TableHeader>
        <TableRow>
            <TableHead>Periode</TableHead>
            <TableHead>Tanggal Bayar</TableHead>
            <TableHead>Jumlah</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Bukti</TableHead>
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
                </TableRow>
            ))
        ) : (
            <TableRow>
                <TableCell colSpan={5} className="text-center">
                    Tidak ada riwayat pembayaran.
                </TableCell>
            </TableRow>
        )}
        </TableBody>
    </Table>
  );
}
