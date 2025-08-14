
"use client";

import { useState, useEffect, useMemo } from "react";
import * as XLSX from "xlsx";
import { type Payment } from "@/lib/data";
import { getAllPayments, updatePayment, deletePayment } from "@/lib/firebase/firestore";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, MoreHorizontal, Download } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { EditPaymentModal } from "./edit-payment-modal";
import { useToast } from "@/hooks/use-toast";
import { DeletePaymentAlert } from "./delete-payment-alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";


type StatusVariant = "default" | "secondary" | "destructive";

const badgeVariant: Record<Payment["status"], StatusVariant> = {
    "Lunas": "default",
    "Belum Lunas": "destructive",
    "Tertunda": "secondary"
}

const ITEMS_PER_PAGE = 5;

export function AllPaymentsTable() {
  const [allPayments, setAllPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<Date | undefined>();
  const [selectedStatus, setSelectedStatus] = useState<Payment["status"] | "Semua">("Semua");
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const { toast } = useToast();
  
  const fetchPayments = async () => {
      setLoading(true);
      const payments = await getAllPayments();
      payments.sort((a,b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime());
      setAllPayments(payments);
      setLoading(false);
  }

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleEditClick = (payment: Payment) => {
    setSelectedPayment(payment);
    setIsEditModalOpen(true);
  };
  
  const handleDeleteClick = (payment: Payment) => {
    setSelectedPayment(payment);
    setIsDeleteAlertOpen(true);
  };

  const handleSavePayment = async (paymentToUpdate: Payment) => {
    const success = await updatePayment(paymentToUpdate.id, paymentToUpdate);
    if (success) {
      toast({
        title: "Pembayaran Diperbarui",
        description: "Data pembayaran telah berhasil diperbarui.",
      });
      // Refetch or update state locally
      setAllPayments(prev => prev.map(p => p.id === paymentToUpdate.id ? paymentToUpdate : p));
    } else {
      toast({
        title: "Gagal Memperbarui",
        description: "Terjadi kesalahan saat memperbarui pembayaran.",
        variant: "destructive",
      });
    }
    setIsEditModalOpen(false);
    setSelectedPayment(null);
  };

  const confirmDelete = async () => {
    if (!selectedPayment) return;
    const success = await deletePayment(selectedPayment.id);
    if(success) {
      toast({
        title: "Pembayaran Dihapus",
        description: "Data pembayaran telah berhasil dihapus.",
      });
      setAllPayments(prev => prev.filter(p => p.id !== selectedPayment.id));
    } else {
       toast({
        title: "Gagal Menghapus",
        description: "Terjadi kesalahan saat menghapus pembayaran.",
        variant: "destructive",
      });
    }
    setIsDeleteAlertOpen(false);
    setSelectedPayment(null);
  }

  const filteredPayments = useMemo(() => {
    let filtered = allPayments;

    if (selectedPeriod) {
        const formattedPeriod = format(selectedPeriod, "MMMM yyyy", { locale: id });
        filtered = filtered.filter(p => p.period === formattedPeriod);
    }
    if (selectedStatus !== "Semua") {
        filtered = filtered.filter(p => p.status === selectedStatus);
    }

    return filtered;
  }, [allPayments, selectedPeriod, selectedStatus]);

  const paginatedPayments = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredPayments.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredPayments, currentPage]);

  const totalPages = Math.ceil(filteredPayments.length / ITEMS_PER_PAGE);

  const handlePeriodReset = () => {
    setSelectedPeriod(undefined);
    setCurrentPage(1);
  }

  const handleDownload = () => {
    const dataToExport = filteredPayments.map(p => ({
        "Nama Warga": p.citizen?.name || 'N/A',
        "NIK": p.citizen?.nik || 'N/A',
        "No. KK": p.citizen?.kk || 'N/A',
        "Alamat": p.citizen?.address || 'N/A',
        "RT/RW": `${p.citizen?.rt || 'N/A'}/${p.citizen?.rw || 'N/A'}`,
        "Periode": p.period,
        "Tanggal Bayar": p.paymentDate,
        "Jumlah": p.amount,
        "Status": p.status,
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Laporan Pembayaran");

    // Auto-size columns
    const objectMaxLength = Object.keys(dataToExport[0] || {}).map(key => ({
        wch: Math.max(...dataToExport.map(obj => obj[key as keyof typeof obj[0]]?.toString().length || 0), key.length)
    }));
    worksheet["!cols"] = objectMaxLength;

    let fileName = "Laporan_Pembayaran";
    if (selectedStatus !== "Semua") {
        fileName += `_${selectedStatus}`;
    }
    if (selectedPeriod) {
        fileName += `_${format(selectedPeriod, "MMMM_yyyy", { locale: id })}`;
    }
    fileName += ".xlsx";

    XLSX.writeFile(workbook, fileName);

    toast({
      title: "Laporan Diunduh",
      description: `File ${fileName} berhasil diunduh.`
    })
  }

  return (
    <>
      <Card>
        <CardHeader className="flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <CardTitle>Manajemen Pencatatan Pembayaran</CardTitle>
                <CardDescription>Menampilkan seluruh data pembayaran iuran dari semua RT.</CardDescription>
            </div>
            <div className="flex items-center gap-2">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                        variant={"outline"}
                        className={cn(
                            "w-[180px] justify-start text-left font-normal",
                            !selectedPeriod && "text-muted-foreground"
                        )}
                        >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedPeriod ? format(selectedPeriod, "MMMM yyyy", { locale: id }) : <span>Filter Periode</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                        mode="single"
                        selected={selectedPeriod}
                        onSelect={(date) => {
                            setSelectedPeriod(date);
                            setCurrentPage(1);
                        }}
                        initialFocus
                        captionLayout="dropdown-buttons"
                        fromYear={2023}
                        toYear={2025}
                        />
                    </PopoverContent>
                </Popover>
                 <Select value={selectedStatus} onValueChange={(value: Payment["status"] | "Semua") => setSelectedStatus(value)}>
                    <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Filter Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Semua">Semua Status</SelectItem>
                        <SelectItem value="Lunas">Lunas</SelectItem>
                        <SelectItem value="Belum Lunas">Belum Lunas</SelectItem>
                        <SelectItem value="Tertunda">Tertunda</SelectItem>
                    </SelectContent>
                </Select>
                {selectedPeriod && <Button variant="ghost" size="sm" onClick={handlePeriodReset}>Reset</Button>}
                 <Button onClick={handleDownload} disabled={loading || filteredPayments.length === 0}>
                    <Download className="mr-2 h-4 w-4" />
                    Unduh Laporan (XLS)
                </Button>
            </div>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Nama Warga</TableHead>
                    <TableHead>RT/RW</TableHead>
                    <TableHead>Alamat</TableHead>
                    <TableHead>NIK / No. KK</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Periode</TableHead>
                    <TableHead>Jumlah</TableHead>
                    <TableHead>Tgl. Bayar</TableHead>
                    <TableHead>Bukti</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={10} className="text-center">Memuat data pembayaran...</TableCell>
                    </TableRow>
                  ) : paginatedPayments.length > 0 ? (
                    paginatedPayments.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell className="font-medium">{payment.citizen?.name || "N/A"}</TableCell>
                          <TableCell>{`${payment.citizen?.rt || 'N/A'} / ${payment.citizen?.rw || 'N/A'}`}</TableCell>
                          <TableCell>{payment.citizen?.address || "N/A"}</TableCell>
                          <TableCell>{`${payment.citizen?.nik || 'N/A'} / ${payment.citizen?.kk || 'N/A'}`}</TableCell>
                           <TableCell>
                              <Badge variant={badgeVariant[payment.status]}>
                                  {payment.status}
                              </Badge>
                          </TableCell>
                          <TableCell>{payment.period}</TableCell>
                          <TableCell>{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(payment.amount)}</TableCell>
                          <TableCell>{payment.paymentDate}</TableCell>
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
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        <MoreHorizontal className="h-4 w-4" />
                                        <span className="sr-only">Buka menu</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                                    <DropdownMenuItem onClick={() => handleEditClick(payment)}>
                                        Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                        className="text-destructive focus:text-destructive"
                                        onClick={() => handleDeleteClick(payment)}
                                    >
                                        Hapus
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                      </TableCell>
                        </TableRow>
                      ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={10} className="text-center">Tidak ada data pembayaran untuk filter yang dipilih.</TableCell>
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
        <>
            <EditPaymentModal 
                isOpen={isEditModalOpen}
                onOpenChange={setIsEditModalOpen}
                payment={selectedPayment}
                onSave={handleSavePayment}
            />
            <DeletePaymentAlert
                isOpen={isDeleteAlertOpen}
                onOpenChange={setIsDeleteAlertOpen}
                onConfirm={confirmDelete}
                payment={selectedPayment}
            />
        </>
      )}
    </>
  );
}
