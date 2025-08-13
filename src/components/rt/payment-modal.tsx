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
import type { Citizen } from "@/lib/data";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import React from "react";

type PaymentModalProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  citizen: Citizen;
};

export function PaymentModal({
  isOpen,
  onOpenChange,
  citizen,
}: PaymentModalProps) {
  const [date, setDate] = React.useState<Date>();

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Catat Pembayaran Iuran</DialogTitle>
          <DialogDescription>
            Input detail pembayaran untuk <span className="font-semibold">{citizen.name}</span>.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Periode
            </Label>
            <Input id="name" defaultValue="Juni 2024" className="col-span-3" disabled />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">
              Jumlah (Rp)
            </Label>
            <Input
              id="amount"
              type="number"
              defaultValue="25000"
              className="col-span-3"
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
                  {date ? format(date, "PPP") : <span>Pilih tanggal</span>}
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
                <Input id="file-upload" type="file" className="sr-only" accept="image/*"/>
                <p className="text-xs text-muted-foreground mt-1">Unggah gambar (maks. 500 KB).</p>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Batal</Button>
          <Button type="submit">Simpan Pembayaran</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
