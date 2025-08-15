
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar as CalendarIcon, Upload } from "lucide-react";
import type { Payment } from "@/lib/data";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { cn, compressImage } from "@/lib/utils";
import { format, parse } from "date-fns";
import React, { useState, useEffect } from "react";
import { id } from 'date-fns/locale';
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

type EditPaymentModalProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  payment: Payment;
  onSave: (paymentData: Payment) => void;
};

export function EditPaymentModal({
  isOpen,
  onOpenChange,
  payment,
  onSave,
}: EditPaymentModalProps) {
  const [formData, setFormData] = useState<Payment>(payment);
  const [fileName, setFileName] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      setFormData({
        ...payment,
        paymentDate: payment.paymentDate || format(new Date(), "yyyy-MM-dd"),
      });
      setFileName(null);
    }
  }, [isOpen, payment]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({...prev, amount: Number(e.target.value)}));
  }

  const handleStatusChange = (value: Payment["status"]) => {
    setFormData(prev => ({...prev, status: value}));
  }

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setFormData(prev => ({...prev, paymentDate: format(date, "yyyy-MM-dd")}));
    }
  }

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
            setFormData(prev => ({...prev, proofUrl: payment.proofUrl }));
            return;
          }
          setFileName(file.name);
          const compressedDataUrl = await compressImage(file, 400, 400);
          setFormData(prev => ({...prev, proofUrl: compressedDataUrl }));

      } else {
          setFileName(null);
          setFormData(prev => ({...prev, proofUrl: payment.proofUrl }));
      }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dataToSave = { ...formData };
    if (dataToSave.amount < 25000) {
        dataToSave.status = "Belum Lunas";
        toast({
            title: "Jumlah Kurang",
            description: "Karena jumlah pembayaran kurang dari Rp 25.000, status diubah menjadi 'Belum Lunas'.",
            variant: "destructive"
        })
    }
    onSave(dataToSave);
  }

  const parsedDate = () => {
    try {
      return parse(formData.paymentDate, "yyyy-MM-dd", new Date());
    } catch {
      return new Date();
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
            <DialogHeader>
            <DialogTitle>Edit Pembayaran</DialogTitle>
            <DialogDescription>
                Perbarui detail pembayaran untuk <span className="font-semibold">{payment.citizen?.name}</span> periode <span className="font-semibold">{payment.period}</span>.
            </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="amount" className="text-right">
                Jumlah (Rp)
                </Label>
                <Input
                id="amount"
                type="number"
                value={formData.amount}
                onChange={handleAmountChange}
                className="col-span-3"
                required
                />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="paymentDate" className="text-right">
                Tgl. Bayar
                </Label>
                <Popover>
                <PopoverTrigger asChild>
                    <Button
                    variant={"outline"}
                    className={cn(
                        "w-[240px] justify-start text-left font-normal col-span-3",
                        !formData.paymentDate && "text-muted-foreground"
                    )}
                    >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.paymentDate ? format(parsedDate(), "PPP", { locale: id }) : <span>Pilih tanggal</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                    mode="single"
                    selected={parsedDate()}
                    onSelect={handleDateChange}
                    initialFocus
                    />
                </PopoverContent>
                </Popover>
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                    Status
                </Label>
                 <Select onValueChange={handleStatusChange} defaultValue={formData.status}>
                    <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Pilih status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Lunas">Lunas</SelectItem>
                        <SelectItem value="Belum Lunas">Belum Lunas</SelectItem>
                        <SelectItem value="Tertunda">Tertunda</SelectItem>
                    </SelectContent>
                </Select>
            </div>
             <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="proof" className="text-right pt-2">
                    Bukti
                </Label>
                <div className="col-span-3 space-y-2">
                    <div className="flex items-center gap-2">
                        {formData.proofUrl && (
                             <Image 
                                src={formData.proofUrl} 
                                alt={`Bukti ${formData.period}`}
                                width={60}
                                height={60}
                                className="rounded-md object-cover border"
                                data-ai-hint="receipt"
                            />
                        )}
                         <Button asChild variant="outline" size="sm">
                            <label htmlFor="file-upload-edit" className="cursor-pointer flex items-center gap-2">
                                <Upload className="h-4 w-4" />
                                <span>{formData.proofUrl ? "Ganti" : "Unggah"}</span>
                            </label>
                        </Button>
                        <Input id="file-upload-edit" type="file" className="sr-only" accept="image/*" onChange={handleFileChange} />
                    </div>
                    {fileName && <p className="text-xs text-muted-foreground">File baru: {fileName}</p>}
                </div>
            </div>
            </div>
            <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Batal</Button>
            <Button type="submit">Simpan Perubahan</Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
