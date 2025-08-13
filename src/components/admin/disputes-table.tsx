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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { disputes, type Dispute } from "@/lib/data";

const badgeVariant: Record<Dispute["status"], "default" | "secondary" | "destructive"> = {
    "Baru": "destructive",
    "Diproses": "secondary",
    "Selesai": "default"
}

export function DisputesTable() {
  return (
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
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>Lihat Detail</DropdownMenuItem>
                            <DropdownMenuItem>Tandai Selesai</DropdownMenuItem>
                        </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
        </CardContent>
    </Card>
  );
}
