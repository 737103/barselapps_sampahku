
"use client";

import { useState, useEffect } from "react";
import Link from 'next/link';
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
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import type { Citizen } from "@/lib/data";
import { ViewCitizenDetailsModal } from "./view-citizen-details-modal";
import { getAllCitizens, deleteCitizen } from "@/lib/firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { DeleteCitizenAlert } from "./delete-citizen-alert";

export function AllResidentsTable() {
  const [residents, setResidents] = useState<Citizen[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [selectedCitizen, setSelectedCitizen] = useState<Citizen | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCitizens = async () => {
      setLoading(true);
      const fetchedCitizens = await getAllCitizens();
      setResidents(fetchedCitizens);
      setLoading(false);
    };
    fetchCitizens();
  }, []);

  const handleViewDetails = (resident: Citizen) => {
    setSelectedCitizen(resident);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (resident: Citizen) => {
    setSelectedCitizen(resident);
    setIsDeleteAlertOpen(true);
  };
  
  const confirmDelete = async () => {
    if (!selectedCitizen) return;
    const success = await deleteCitizen(selectedCitizen.id);
    if (success) {
      setResidents(prev => prev.filter(r => r.id !== selectedCitizen.id));
      toast({
        title: "Data Warga Dihapus",
        description: `Data untuk ${selectedCitizen.name} telah berhasil dihapus.`,
      });
    } else {
      toast({
        title: "Gagal Menghapus Data",
        description: "Terjadi kesalahan saat menghapus data warga.",
        variant: "destructive",
      });
    }
    setIsDeleteAlertOpen(false);
    setSelectedCitizen(null);
  };

  return (
    <>
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
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">Memuat data warga...</TableCell>
                  </TableRow>
                ) : residents.length > 0 ? (
                  residents.map((resident) => (
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
                                  <DropdownMenuItem onClick={() => handleViewDetails(resident)}>
                                      Lihat Detail Warga
                                  </DropdownMenuItem>
                                  <Link href={`/admin/manajemen-warga/${resident.id}`}>
                                      <DropdownMenuItem>
                                          Lihat Riwayat Pembayaran
                                      </DropdownMenuItem>
                                  </Link>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem 
                                    className="text-destructive focus:text-destructive"
                                    onClick={() => handleDeleteClick(resident)}
                                   >
                                    Hapus Data Warga
                                  </DropdownMenuItem>
                              </DropdownMenuContent>
                          </DropdownMenu>
                      </TableCell>
                      </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">Belum ada data warga.</TableCell>
                  </TableRow>
                )}
                </TableBody>
            </Table>
        </CardContent>
    </Card>
    {selectedCitizen && (
      <>
        <ViewCitizenDetailsModal
            isOpen={isModalOpen}
            onOpenChange={setIsModalOpen}
            citizen={selectedCitizen}
        />
        <DeleteCitizenAlert
          isOpen={isDeleteAlertOpen}
          onOpenChange={setIsDeleteAlertOpen}
          onConfirm={confirmDelete}
          citizen={selectedCitizen}
        />
      </>
    )}
    </>
  );
}
