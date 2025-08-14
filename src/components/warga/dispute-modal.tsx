
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Payment } from "@/lib/data";
import React, { useState } from "react";
import { Input } from "../ui/input";
import { Upload } from "lucide-react";

type DisputeModalProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  payment: Payment;
};

export function DisputeModal({
  isOpen,
  onOpenChange,
  payment,
}: DisputeModalProps) {
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          if (file.size > 500 * 1024) {
            alert("Ukuran file terlalu besar. Maksimal 500 KB.");
            e.target.value = ""; // Reset file input
            setFileName(null);
            return;
          }
          setFileName(file.name);
      } else {
          setFileName(null);
      }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ajukan Sanggahan</DialogTitle>
          <DialogDescription>
            Kirim sanggahan untuk pembayaran periode <span className="font-semibold">{payment.period}</span>.
            Admin akan segera meninjau permintaan Anda.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid w-full gap-1.5">
            <Label htmlFor="reason-modal">Alasan Sanggahan</Label>
            <Textarea 
                placeholder="Tuliskan alasan sanggahan Anda di sini. Contoh: Saya sudah bayar tapi status masih belum lunas, jumlah pembayaran salah, dll." 
                id="reason-modal" 
            />
          </div>
          <div className="grid w-full gap-1.5">
            <Label htmlFor="proof-modal">Bukti Foto (Opsional)</Label>
             <div className="flex items-center gap-4">
                <Button asChild variant="outline" className="w-fit">
                    <label htmlFor="file-upload-modal" className="cursor-pointer flex items-center gap-2">
                        <Upload className="h-4 w-4" />
                        <span>Unggah Gambar</span>
                    </label>
                </Button>
                <Input id="file-upload-modal" type="file" className="sr-only" accept="image/*" onChange={handleFileChange} />
                {fileName && <p className="text-sm text-muted-foreground">{fileName}</p>}
             </div>
             <p className="text-xs text-muted-foreground">Lampirkan bukti transfer atau foto pendukung lainnya. Unggah gambar (maks. 500 KB).</p>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Batal</Button>
          <Button type="submit">Kirim Sanggahan</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
