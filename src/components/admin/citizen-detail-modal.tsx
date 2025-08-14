
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
import type { Citizen } from "@/lib/data";

type CitizenDetailModalProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  citizen: Citizen;
};

export function CitizenDetailModal({ isOpen, onOpenChange, citizen }: CitizenDetailModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Detail Informasi Warga</DialogTitle>
            <DialogDescription>
              Informasi lengkap mengenai warga yang terdaftar.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 text-sm">
            <div className="grid grid-cols-3 items-center gap-x-4 gap-y-2">
                <p className="text-muted-foreground">Nama Lengkap</p>
                <p className="col-span-2 font-semibold">{citizen.name}</p>
            </div>
             <div className="grid grid-cols-3 items-center gap-x-4 gap-y-2">
                <p className="text-muted-foreground">NIK</p>
                <p className="col-span-2">{citizen.nik}</p>
            </div>
             <div className="grid grid-cols-3 items-center gap-x-4 gap-y-2">
                <p className="text-muted-foreground">No. KK</p>
                <p className="col-span-2">{citizen.kk}</p>
            </div>
             <div className="grid grid-cols-3 items-center gap-x-4 gap-y-2">
                <p className="text-muted-foreground">Alamat</p>
                <p className="col-span-2">{citizen.address}</p>
            </div>
             <div className="grid grid-cols-3 items-center gap-x-4 gap-y-2">
                <p className="text-muted-foreground">RT/RW</p>
                <p className="col-span-2">{`${citizen.rt}/${citizen.rw}`}</p>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" onClick={() => onOpenChange(false)}>Tutup</Button>
          </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
