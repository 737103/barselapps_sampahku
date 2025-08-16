
"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { Citizen } from "@/lib/data";

type DeleteCitizenAlertProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  citizen: Citizen;
};

export function DeleteCitizenAlert({ isOpen, onOpenChange, onConfirm, citizen }: DeleteCitizenAlertProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Apakah Anda yakin ingin menghapus data ini?</AlertDialogTitle>
          <AlertDialogDescription>
            Tindakan ini tidak dapat diurungkan. Ini akan menghapus data warga atas nama <span className="font-semibold">{citizen.name}</span> secara permanen dari sistem. Semua data pembayaran terkait juga tidak akan bisa diakses dengan benar.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Ya, Hapus Data</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
