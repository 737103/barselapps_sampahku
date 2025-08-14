
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
import { cn } from "@/lib/utils";
import { format, parse } from "date-fns";
import React, { useState, useEffect } from "react";
import { id } from 'date-fns/locale';
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      setFormData({
        ...payment,
        paymentDate: payment.paymentDate || format(new Date(), "yyyy-MM-dd"),
      });
    }
  }, [isOpen, payment]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({...prev, [id]: value}));
  };
  
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

  const handlePeriodChange = (date: Date | undefined) => {
    if (date) {
      setFormData(prev => ({...prev, period: format(date, "MMMM yyyy", { locale: id })}));
    }
  }

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

  const parsedPeriod = () => {
    try {
      return parse(formData.period, "MMMM yyyy", new Date(), { locale: id });
    } catch {
      return new Date();
    }
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
            <DialogTitle>Edit Detail Pembayaran</DialogTitle>
            <DialogDescription>
                Perbarui detail pembayaran untuk <span className="font-semibold">{payment.citizen?.name}</span>.
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
                        !formData.period && "text-muted-foreground"
                    )}
                    >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.period ? formData.period : <span>Pilih periode</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                    mode="single"
                    selected={parsedPeriod()}
                    onSelect={handlePeriodChange}
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
