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
            <Label htmlFor="reason">Alasan Sanggahan</Label>
            <Textarea 
                placeholder="Tuliskan alasan sanggahan Anda di sini. Contoh: Saya sudah bayar tapi status masih belum lunas, jumlah pembayaran salah, dll." 
                id="reason" 
            />
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
