
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
import { addDispute } from "@/lib/firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { compressImage } from "@/lib/utils";

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
  const [reason, setReason] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [proofUrl, setProofUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason) {
        toast({
            title: "Alasan harus diisi",
            description: "Mohon jelaskan alasan sanggahan Anda.",
            variant: "destructive",
        });
        return;
    }
    if (!payment.citizen) {
        toast({
            title: "Data warga tidak ditemukan",
            variant: "destructive",
        });
        return;
    }
    setIsSubmitting(true);
    const disputeData = {
        paymentId: payment.id,
        citizenId: payment.citizenId,
        citizenName: payment.citizen.name,
        rt: payment.citizen.rt,
        rw: payment.citizen.rw,
        reason: reason,
        proofUrl: proofUrl
    };

    const result = await addDispute(disputeData);
    if(result) {
        toast({
            title: "Sanggahan Terkirim",
            description: "Sanggahan Anda telah berhasil dikirim dan akan segera ditinjau.",
        });
        onOpenChange(false);
        setReason("");
        setFileName(null);
        setProofUrl(null);
    } else {
        toast({
            title: "Gagal Mengirim Sanggahan",
            description: "Terjadi kesalahan. Silakan coba lagi.",
            variant: "destructive",
        });
    }
    setIsSubmitting(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
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
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    required
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
                <p className="text-xs text-muted-foreground">Lampirkan bukti transfer atau foto pendukung lainnya. Unggah gambar (maks. 2 MB).</p>
            </div>
            </div>
            <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Batal</Button>
            <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Mengirim...' : 'Kirim Sanggahan'}
            </Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
