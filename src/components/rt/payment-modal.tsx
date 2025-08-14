
"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar as CalendarIcon, Upload } from "lucide-react";
import type { Citizen, Payment } from "@/lib/data";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { cn, compressImage } from "@/lib/utils";
import { format } from "date-fns";
import React, { useState } from "react";
import { id } from 'date-fns/locale';
import { useToast } from "@/hooks/use-toast";

type PaymentModalProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  citizen: Citizen;
  onSave: (paymentData: Omit<Payment, 'id' | 'citizenId'> & { citizenName: string }) => void;
};

export function PaymentModal({
  isOpen,
  onOpenChange,
  citizen,
  onSave,
}: PaymentModalProps) {
  const [date, setDate] = useState<Date>();
  const [period, setPeriod] = useState<Date>();
  const [amount, setAmount] = useState(25000);
  const [fileName, setFileName] = useState<string | null>(null);
  const [proofUrl, setProofUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          if (file.size > 2 * 1024 * 1024) { // 2MB limit
            toast({
              title: "Ukuran file terlalu besar",
              description: "Ukuran file maksimal 2 MB.",
              variant: "destructive"
            });
            e.target.value = ""; 
            setFileName(null);
            setProofUrl(null);
            return;
          }
          setFileName(file.name);
          const compressedDataUrl = await compressImage(file, 400, 400);
          setProofUrl(compressedDataUrl);
      } else {
          setFileName(null);
          setProofUrl(null);
      }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (period && date && amount) {
        let paymentStatus: Payment['status'] = 'Lunas';
        if (amount < 25000) {
            paymentStatus = 'Belum Lunas';
            toast({
                title: "Jumlah Kurang",
                description: "Karena jumlah pembayaran kurang dari Rp 25.000, status diubah menjadi 'Belum Lunas'.",
                variant: "destructive"
            });
        }
        onSave({
            period: format(period, "MMMM yyyy", { locale: id }),
            paymentDate: format(date, "yyyy-MM-dd"),
            amount,
            status: paymentStatus,
            citizenName: citizen.name,
            proofUrl: proofUrl || "https://placehold.co/400x400.png"
        });
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
            <DialogHeader>
            <DialogTitle>Catat Pembayaran Iuran</DialogTitle>
            <DialogDescription>
                Input detail pembayaran untuk <span className="font-semibold">{citizen.name}</span>.
            </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="periode" className="text-right">
                Periode
                </Label>
                <Popover>
                <PopoverTrigger asChild>
                    <Button
                    variant={"outline"}
                    className={cn(
                        "w-[240px] justify-start text-left font-normal col-span-3",
                        !period && "text-muted-foreground"
                    )}
                    >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {period ? format(period, "MMMM yyyy", { locale: id }) : <span>Pilih periode</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                    mode="single"
                    selected={period}
                    onSelect={setPeriod}
                    initialFocus
                    captionLayout="dropdown-buttons"
                    fromYear={2023}
                    toYear={2025}
                    />
                </PopoverContent>
                </Popover>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="amount" className="text-right">
                Jumlah (Rp)
                </Label>
                <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="col-span-3"
                required
                />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="date" className="text-right">
                Tanggal Bayar
                </Label>
                <Popover>
                <PopoverTrigger asChild>
                    <Button
                    variant={"outline"}
                    className={cn(
                        "w-[240px] justify-start text-left font-normal col-span-3",
                        !date && "text-muted-foreground"
                    )}
                    >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP", { locale: id }) : <span>Pilih tanggal</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    />
                </PopoverContent>
                </Popover>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="proof" className="text-right">
                Bukti Foto
                </Label>
                <div className="col-span-3">
                    <Button asChild variant="outline">
                        <label htmlFor="file-upload" className="cursor-pointer flex items-center gap-2">
                            <Upload className="h-4 w-4" />
                            <span>Unggah Gambar</span>
                        </label>
                    </Button>
                    <Input id="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleFileChange} />
                    <p className="text-xs text-muted-foreground mt-1">Unggah gambar (maks. 2 MB).</p>
                </div>
            </div>
            </div>
            <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Batal</Button>
            <Button type="submit">Simpan Pembayaran</Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
