
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
import React, { useState, useEffect } from "react";
import type { Citizen } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import { getCitizenByNIK } from "@/lib/firebase/firestore";

type EditResidentModalProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  citizen: Citizen;
  onSave: (data: Citizen) => void;
};

export function EditResidentModal({ isOpen, onOpenChange, citizen, onSave }: EditResidentModalProps) {
  const [formData, setFormData] = useState(citizen);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      setFormData(citizen);
    }
  }, [isOpen, citizen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({...prev, [id]: value}));
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const nikRegex = /^\d{16}$/;
    if (!nikRegex.test(formData.nik)) {
        toast({
            title: "Format NIK Salah",
            description: "NIK harus terdiri dari 16 digit angka.",
            variant: "destructive",
        });
        return;
    }
    
    if (formData.nik !== citizen.nik) {
      const existingCitizen = await getCitizenByNIK(formData.nik);
      if (existingCitizen) {
          toast({
              title: "NIK Sudah Terdaftar",
              description: "NIK yang Anda masukkan sudah terdaftar untuk warga lain.",
              variant: "destructive",
          });
          return;
      }
    }
    
    if (formData.kk) {
        const kkRegex = /^\d{16}$/;
        if (!kkRegex.test(formData.kk)) {
            toast({
                title: "Format No. KK Salah",
                description: "No. KK harus terdiri dari 16 digit angka.",
                variant: "destructive",
            });
            return;
        }
    }

    onSave(formData);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Data Warga</DialogTitle>
            <DialogDescription>
              Perbarui detail untuk warga <span className="font-semibold">{citizen.name}</span>.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Lengkap</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Alamat Lengkap</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nik">NIK</Label>
                <Input
                  id="nik"
                  maxLength={16}
                  value={formData.nik}
                  onChange={handleChange}
                  required
                  type="number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="kk">No. KK</Label>
                <Input
                  id="kk"
                  maxLength={16}
                  value={formData.kk}
                  onChange={handleChange}
                  type="number"
                />
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
