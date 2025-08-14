
"use client";

import { useState, useEffect } from "react";
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
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { type Dispute, type Payment, type Citizen } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import { CitizenDetailModal } from "./citizen-detail-modal";
import { getAllDisputes, getPaymentById, updateDisputeStatus } from "@/lib/firebase/firestore";
import Image from "next/image";

type BadgeVariant = "destructive" | "secondary" | "default" | "outline";

const badgeVariant: Record<Dispute["status"], BadgeVariant> = {
    "Baru": "destructive",
    "Diproses": "secondary",
    "Selesai": "default",
    "Ditolak": "outline",
}

export function DisputesTable() {
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<(Payment & { citizen: Citizen }) | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchDisputes = async () => {
        setLoading(true);
        const fetchedDisputes = await getAllDisputes();
        setDisputes(fetchedDisputes);
        setLoading(false);
    }
    fetchDisputes();
  }, [])

  const handleStatusChange = async (disputeId: string, newStatus: Dispute["status"]) => {
    const success = await updateDisputeStatus(disputeId, newStatus);
    if(success) {
        setDisputes(prevDisputes => 
            prevDisputes.map(d => 
                d.id === disputeId ? {...d, status: newStatus} : d
            )
        );
        toast({
            title: "Status Sanggahan Diperbarui",
            description: `Sanggahan telah ditandai sebagai ${newStatus}.`
        });
    } else {
        toast({
            title: "Gagal Memperbarui Status",
            description: "Terjadi kesalahan saat memperbarui status sanggahan.",
            variant: "destructive",
        })
    }
  }

  const handleViewDetails = async (dispute: Dispute) => {
    const payment = await getPaymentById(dispute.paymentId);
    if (payment && payment.citizen) {
        setSelectedDispute(dispute);
        setSelectedPayment(payment as Payment & { citizen: Citizen });
        setIsDetailModalOpen(true);
    } else {
        toast({
            title: "Data Pembayaran/Warga Tidak Ditemukan",
            description: "Tidak dapat menemukan detail untuk sanggahan ini.",
            variant: "destructive",
        });
    }
  }


  return (
    <>
    <Card>
        <CardHeader>
            <CardTitle>Sanggahan Terbaru</CardTitle>
            <CardDescription>Daftar sanggahan pembayaran yang perlu ditinjau.</CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Warga</TableHead>
                    <TableHead>RT/RW</TableHead>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Bukti</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {loading ? (
                    <TableRow>
                        <TableCell colSpan={6} className="text-center">Memuat data sanggahan...</TableCell>
                    </TableRow>
                ) : disputes.length > 0 ? (
                    disputes.map((dispute) => (
                        <TableRow key={dispute.id}>
                        <TableCell className="font-medium">{dispute.citizenName}</TableCell>
                        <TableCell>{`RT ${dispute.rt} / RW ${dispute.rw}`}</TableCell>
                        <TableCell>{dispute.submittedDate}</TableCell>
                        <TableCell>
                            <Badge variant={badgeVariant[dispute.status]}>{dispute.status}</Badge>
                        </TableCell>
                        <TableCell>
                            {dispute.proofUrl ? (
                                <a href={dispute.proofUrl} target="_blank" rel="noopener noreferrer">
                                <Image 
                                    src={dispute.proofUrl} 
                                    alt={`Bukti Sanggahan`}
                                    width={40}
                                    height={40}
                                    className="rounded-md object-cover"
                                    data-ai-hint="receipt"
                                />
                                </a>
                            ) : (
                                <p className="text-muted-foreground">-</p>
                            )}
                        </TableCell>
                        <TableCell className="text-right">
                            <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button aria-haspopup="true" size="icon" variant="ghost">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Toggle menu</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Tindakan</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => handleViewDetails(dispute)}>Lihat Detail</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleStatusChange(dispute.id, 'Diproses')}>
                                    Tandai Diproses
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleStatusChange(dispute.id, 'Selesai')}>
                                    Tandai Selesai
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                    onClick={() => handleStatusChange(dispute.id, 'Ditolak')}
                                    className="text-destructive focus:text-destructive"
                                >
                                    Tandai Ditolak
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                        </TableRow>
                    ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={6} className="text-center">Tidak ada sanggahan terbaru.</TableCell>
                    </TableRow>
                )}
                </TableBody>
            </Table>
        </CardContent>
    </Card>
    {selectedDispute && selectedPayment && (
        <CitizenDetailModal
            isOpen={isDetailModalOpen}
            onOpenChange={setIsDetailModalOpen}
            dispute={selectedDispute}
            payment={selectedPayment}
        />
    )}
    </>
  );
}
