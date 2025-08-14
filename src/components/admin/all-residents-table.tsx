
"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import type { Citizen } from "@/lib/data";

type AllResidentsTableProps = {
    residents: Citizen[];
}

export function AllResidentsTable({ residents = [] }: AllResidentsTableProps) {
  return (
    <Card>
        <CardHeader>
            <CardTitle>Data Seluruh Warga</CardTitle>
            <CardDescription>Daftar lengkap semua warga yang terdaftar di sistem.</CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Nama Warga</TableHead>
                    <TableHead>NIK</TableHead>
                    <TableHead>No. KK</TableHead>
                    <TableHead>Alamat</TableHead>
                    <TableHead>RT/RW</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {residents.map((resident) => (
                    <TableRow key={resident.id}>
                    <TableCell className="font-medium">{resident.name}</TableCell>
                    <TableCell>{resident.nik}</TableCell>
                    <TableCell>{resident.kk}</TableCell>
                    <TableCell>{resident.address}</TableCell>
                    <TableCell>{`RT ${resident.rt} / RW ${resident.rw}`}</TableCell>
                    <TableCell className="text-right">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Buka menu</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                                <DropdownMenuItem>
                                    Lihat Detail Warga
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    Lihat Riwayat Pembayaran
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
  );
}
