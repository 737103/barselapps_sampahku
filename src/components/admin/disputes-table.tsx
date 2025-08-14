
"use client";

import { useState } from "react";
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
import { disputes as initialDisputes, type Dispute, payments, type Citizen, type Payment } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import { CitizenDetailModal } from "./citizen-detail-modal";

type BadgeVariant = "destructive" | "secondary" | "default" | "outline";

const badgeVariant: Record<Dispute["status"], BadgeVariant> = {
    "Baru": "destructive",
    "Diproses": "secondary",
    "Selesai": "default",
    "Ditolak": "outline",
}

export function DisputesTable() {
  const [disputes, setDisputes] = useState<Dispute[]>(initialDisputes);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<(Payment & { citizen: Citizen }) | null>(null);
  const { toast } = useToast();

  const handleStatusChange = (disputeId: string, newStatus: Dispute["status"]) => {
    setDisputes(prevDisputes => 
        prevDisputes.map(d => 
            d.id === disputeId ? {...d, status: newStatus} : d
        )
    );
    toast({
        title: "Status Sanggahan Diperbarui",
        description: `Sanggahan telah ditandai sebagai ${newStatus}.`
    });
  }

  const handleViewDetails = (dispute: Dispute) => {
    const payment = payments.find(p => p.id === dispute.paymentId);
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
                    <TableHead>
                    <span className="sr-only">Actions</span>
                    </TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {disputes.map((dispute) => (
                    <TableRow key={dispute.id}>
                    <TableCell className="font-medium">{dispute.citizenName}</TableCell>
                    <TableCell>{`RT ${dispute.rt} / RW ${dispute.rw}`}</TableCell>
                    <TableCell>{dispute.submittedDate}</TableCell>
                    <TableCell>
                        <Badge variant={badgeVariant[dispute.status]}>{dispute.status}</Badge>
                    </TableCell>
                    <TableCell>
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
                ))}
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
