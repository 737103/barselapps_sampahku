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

type AddRtAccountModalProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

export function AddRtAccountModal({ isOpen, onOpenChange }: AddRtAccountModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Tambah Akun Ketua RT Baru</DialogTitle>
          <DialogDescription>
            Isi detail di bawah ini untuk membuat akun baru untuk Ketua RT.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="fullName" className="text-right">
              Nama Lengkap
            </Label>
            <Input id="fullName" placeholder="Contoh: Budi Santoso" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="address" className="text-right">
              Alamat
            </Label>
            <Input id="address" placeholder="Contoh: Jl. Merdeka No. 1" className="col-span-3" />
          </div>
           <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="whatsapp" className="text-right">
              No. WA
            </Label>
            <Input id="whatsapp" placeholder="Contoh: 081234567890" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="rt" className="text-right">
              RT
            </Label>
            <Input id="rt" placeholder="Contoh: 001" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="rw" className="text-right">
              RW
            </Label>
            <Input id="rw" placeholder="Contoh: 001" className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Batal</Button>
          <Button type="submit">Simpan</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
