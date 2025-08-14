
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { Dispute, Payment } from '@/lib/data';
import { getDisputesForCitizen, getPaymentById } from '@/lib/firebase/firestore';

type BadgeVariant = "destructive" | "secondary" | "default" | "outline";
type StatusVariant = "default" | "secondary" | "destructive";


const disputeBadgeVariant: Record<Dispute["status"], BadgeVariant> = {
    "Baru": "destructive",
    "Diproses": "secondary",
    "Selesai": "default",
    "Ditolak": "outline",
}

const paymentBadgeVariant: Record<Payment["status"], StatusVariant> = {
    "Lunas": "default",
    "Belum Lunas": "destructive",
    "Tertunda": "secondary"
}


export function DisputesHistoryTable() {
    const [disputes, setDisputes] = useState<(Dispute & { payment?: Payment | null })[]>([]);
    const [loading, setLoading] = useState(true);
    const searchParams = useSearchParams();
    const citizenId = searchParams.get("citizenId");

    useEffect(() => {
        const fetchDisputesHistory = async () => {
            if (citizenId) {
                setLoading(true);
                const disputesHistory = await getDisputesForCitizen(citizenId);
                
                const disputesWithPayments = await Promise.all(
                    disputesHistory.map(async (dispute) => {
                        let payment = null;
                        if (dispute.paymentId !== "UMUM") {
                           payment = await getPaymentById(dispute.paymentId);
                        }
                        return {...dispute, payment };
                    })
                );

                setDisputes(disputesWithPayments);
                setLoading(false);
            }
        };
        fetchDisputesHistory();
    }, [citizenId]);

  return (
    <Card>
        <CardHeader>
            <CardTitle>Riwayat Sanggahan Anda</CardTitle>
            <CardDescription>Daftar semua sanggahan yang pernah Anda ajukan.</CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Periode</TableHead>
                    <TableHead>Isi Sanggahan</TableHead>
                    <TableHead>Status Pembayaran</TableHead>
                    <TableHead>Status Sanggahan</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {loading ? (
                    <TableRow>
                        <TableCell colSpan={4} className="text-center">Memuat riwayat sanggahan...</TableCell>
                    </TableRow>
                ) : disputes.length > 0 ? (
                    disputes.map((dispute) => (
                        <TableRow key={dispute.id}>
                            <TableCell className="font-medium">{dispute.payment?.period || 'Umum'}</TableCell>
                            <TableCell>{dispute.reason}</TableCell>
                            <TableCell>
                                {dispute.payment ? (
                                    <Badge variant={paymentBadgeVariant[dispute.payment.status]}>
                                        {dispute.payment.status}
                                    </Badge>
                                ) : (
                                    <span>-</span>
                                )}
                            </TableCell>
                            <TableCell>
                                <Badge variant={disputeBadgeVariant[dispute.status]}>
                                    {dispute.status}
                                </Badge>
                            </TableCell>
                        </TableRow>
                    ))
                ) : (
                     <TableRow>
                        <TableCell colSpan={4} className="text-center">Belum ada riwayat sanggahan.</TableCell>
                    </TableRow>
                )}
                </TableBody>
            </Table>
        </CardContent>
    </Card>
  );
}
