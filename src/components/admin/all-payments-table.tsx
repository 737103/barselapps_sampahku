
"use client";

import { useState, useEffect, useMemo } from "react";
import { type Payment } from "@/lib/data";
import { getAllPayments } from "@/lib/firebase/firestore";
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
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";


type StatusVariant = "default" | "secondary" | "destructive";

const badgeVariant: Record<Payment["status"], StatusVariant> = {
    "Lunas": "default",
    "Belum Lunas": "destructive",
    "Tertunda": "secondary"
}

const ITEMS_PER_PAGE = 10;

export function AllPaymentsTable() {
  const [allPayments, setAllPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<Date | undefined>();
  const [currentPage, setCurrentPage] = useState(1);
  
  useEffect(() => {
    const fetchPayments = async () => {
        setLoading(true);
        const payments = await getAllPayments();
        // Sort by payment date descending
        payments.sort((a,b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime());
        setAllPayments(payments);
        setLoading(false);
    }
    fetchPayments();
  }, []);

  const filteredPayments = useMemo(() => {
    if (!selectedPeriod) {
        return allPayments;
    }
    const formattedPeriod = format(selectedPeriod, "MMMM yyyy", { locale: id });
    return allPayments.filter(p => p.period === formattedPeriod);
  }, [allPayments, selectedPeriod]);

  const paginatedPayments = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredPayments.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredPayments, currentPage]);

  const totalPages = Math.ceil(filteredPayments.length / ITEMS_PER_PAGE);

  const handlePeriodReset = () => {
    setSelectedPeriod(undefined);
    setCurrentPage(1);
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
                            "w-[200px] justify-start text-left font-normal",
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
                {selectedPeriod && <Button variant="ghost" onClick={handlePeriodReset}>Reset</Button>}
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
                </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center">Memuat data pembayaran...</TableCell>
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
                        </TableRow>
                      ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center">Tidak ada data pembayaran untuk periode yang dipilih.</TableCell>
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
    </>
  );
}
