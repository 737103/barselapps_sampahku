
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
import type { Dispute, Payment } from "@/lib/data";
import { Separator } from "../ui/separator";
import Image from "next/image";

type CitizenDetailModalProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  dispute: Dispute & { payment?: Payment | null };
};

export function CitizenDetailModal({ isOpen, onOpenChange, dispute }: CitizenDetailModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Detail Sanggahan Warga</DialogTitle>
            <DialogDescription>
              Informasi lengkap mengenai sanggahan yang diajukan.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 text-sm">
            <h4 className="font-semibold">Informasi Warga</h4>
            <div className="grid grid-cols-3 items-start gap-x-4 gap-y-2">
                <p className="text-muted-foreground">Nama Lengkap</p>
                <p className="col-span-2 font-semibold">{dispute.citizenName}</p>
            </div>
             <div className="grid grid-cols-3 items-start gap-x-4 gap-y-2">
                <p className="text-muted-foreground">NIK</p>
                <p className="col-span-2">{dispute.citizen?.nik || 'N/A'}</p>
            </div>
             <div className="grid grid-cols-3 items-start gap-x-4 gap-y-2">
                <p className="text-muted-foreground">Alamat</p>
                <p className="col-span-2">{dispute.citizen?.address || 'N/A'}</p>
            </div>
             <div className="grid grid-cols-3 items-start gap-x-4 gap-y-2">
                <p className="text-muted-foreground">RT/RW</p>
                <p className="col-span-2">{`${dispute.rt}/${dispute.rw}`}</p>
            </div>
            
            <Separator className="my-2"/>

            <h4 className="font-semibold">Detail Sanggahan</h4>
             <div className="grid grid-cols-3 items-start gap-x-4 gap-y-2">
                <p className="text-muted-foreground">Periode Pembayaran</p>
                <p className="col-span-2 font-semibold">{dispute.payment?.period || 'Sanggahan Umum'}</p>
            </div>
             <div className="grid grid-cols-3 items-start gap-x-4 gap-y-2">
                <p className="text-muted-foreground">Tanggal Sanggahan</p>
                <p className="col-span-2">{dispute.submittedDate}</p>
            </div>
            <div className="grid grid-cols-3 items-start gap-x-4 gap-y-2">
                <p className="text-muted-foreground">Alasan</p>
                <p className="col-span-2">{dispute.reason}</p>
            </div>
            <div className="grid grid-cols-3 items-start gap-x-4 gap-y-2">
                <p className="text-muted-foreground">Bukti Foto</p>
                <div className="col-span-2">
                    {dispute.proofUrl ? (
                      <a href={dispute.proofUrl} target="_blank" rel="noopener noreferrer">
                        <Image 
                            src={dispute.proofUrl} 
                            alt={`Bukti Sanggahan`}
                            width={150}
                            height={150}
                            className="rounded-md object-cover border"
                            data-ai-hint="receipt"
                        />
                      </a>
                    ) : (
                        <p className="text-muted-foreground italic">Tidak ada bukti</p>
                    )}
                </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" onClick={() => onOpenChange(false)}>Tutup</Button>
          </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
