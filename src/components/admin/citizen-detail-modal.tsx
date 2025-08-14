
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
import type { Citizen, Dispute, Payment } from "@/lib/data";
import { Separator } from "../ui/separator";
import Image from "next/image";

type CitizenDetailModalProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  dispute: Dispute;
  payment: Payment & { citizen: Citizen };
};

export function CitizenDetailModal({ isOpen, onOpenChange, dispute, payment }: CitizenDetailModalProps) {
    const { citizen } = payment;
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
                <p className="col-span-2 font-semibold">{citizen.name}</p>
            </div>
             <div className="grid grid-cols-3 items-start gap-x-4 gap-y-2">
                <p className="text-muted-foreground">NIK</p>
                <p className="col-span-2">{citizen.nik}</p>
            </div>
             <div className="grid grid-cols-3 items-start gap-x-4 gap-y-2">
                <p className="text-muted-foreground">Alamat</p>
                <p className="col-span-2">{citizen.address}</p>
            </div>
             <div className="grid grid-cols-3 items-start gap-x-4 gap-y-2">
                <p className="text-muted-foreground">RT/RW</p>
                <p className="col-span-2">{`${citizen.rt}/${citizen.rw}`}</p>
            </div>
            
            <Separator className="my-2"/>

            <h4 className="font-semibold">Detail Sanggahan</h4>
             <div className="grid grid-cols-3 items-start gap-x-4 gap-y-2">
                <p className="text-muted-foreground">Periode</p>
                <p className="col-span-2">{payment.period}</p>
            </div>
            <div className="grid grid-cols-3 items-start gap-x-4 gap-y-2">
                <p className="text-muted-foreground">Alasan</p>
                <p className="col-span-2">{dispute.reason}</p>
            </div>
            <div className="grid grid-cols-3 items-start gap-x-4 gap-y-2">
                <p className="text-muted-foreground">Bukti Foto</p>
                <div className="col-span-2">
                    {dispute.proofUrl ? (
                        <Image 
                            src={dispute.proofUrl} 
                            alt={`Bukti Sanggahan`}
                            width={150}
                            height={150}
                            className="rounded-md object-cover border"
                            data-ai-hint="receipt"
                        />
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
