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
import { Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";
import type { RTAccount } from "@/lib/data";

type AddRtAccountModalProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: Omit<RTAccount, 'id' | 'lastLogin'>) => void;
};

export function AddRtAccountModal({ isOpen, onOpenChange, onSave }: AddRtAccountModalProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    rt: "",
    rw: "",
    fullName: "",
    address: "",
    whatsapp: "",
    password: ""
  });

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({...prev, [id]: value}));
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { fullName, address, whatsapp, password, ...rest } = formData;
    onSave(rest);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
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
              <Input id="fullName" placeholder="Contoh: Budi Santoso" className="col-span-3" value={formData.fullName} onChange={handleChange} required/>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="address" className="text-right">
                Alamat
              </Label>
              <Input id="address" placeholder="Contoh: Jl. Merdeka No. 1" className="col-span-3" value={formData.address} onChange={handleChange} required/>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="whatsapp" className="text-right">
                No. WA
              </Label>
              <Input id="whatsapp" placeholder="Contoh: 081234567890" className="col-span-3" value={formData.whatsapp} onChange={handleChange} required/>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="rt" className="text-right">
                RT
              </Label>
              <Input id="rt" placeholder="Contoh: 001" className="col-span-3" value={formData.rt} onChange={handleChange} required/>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="rw" className="text-right">
                RW
              </Label>
              <Input id="rw" placeholder="Contoh: 001" className="col-span-3" value={formData.rw} onChange={handleChange} required/>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Username
              </Label>
              <Input id="username" placeholder="Contoh: rt001_rw001" className="col-span-3" value={formData.username} onChange={handleChange} required/>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password" className="text-right">
                Password
              </Label>
              <div className="col-span-3 relative">
                <Input id="password" type={showPassword ? "text" : "password"} placeholder="Masukkan password" value={formData.password} onChange={handleChange} required/>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  onClick={togglePasswordVisibility} 
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  <span className="sr-only">{showPassword ? 'Sembunyikan password' : 'Tampilkan password'}</span>
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Batal</Button>
            <Button type="submit">Simpan</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
