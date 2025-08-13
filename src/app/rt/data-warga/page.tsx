
"use client";

import { useState } from "react";
import { ResidentsTable } from "@/components/rt/residents-table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { rtResidents, type Citizen } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";

export default function DataWargaPage() {
  const [residents, setResidents] = useState<Citizen[]>(rtResidents);
  const [newResident, setNewResident] = useState({
    fullName: "",
    address: "",
    nik: "",
    kk: "",
    receiptNumber: "",
  });
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setNewResident((prev) => ({ ...prev, [id]: value }));
  };

  const handleSaveResident = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newResident.fullName || !newResident.nik || !newResident.address) {
        toast({
            title: "Data Tidak Lengkap",
            description: "Mohon isi semua kolom yang wajib diisi (Nama, Alamat, NIK).",
            variant: "destructive",
        });
        return;
    }

    const newCitizen: Citizen = {
      id: `c${residents.length + 10}`, // temp unique id
      name: newResident.fullName,
      address: newResident.address,
      nik: newResident.nik,
      kk: newResident.kk,
      rt: "001",
      rw: "001",
    };

    setResidents((prev) => [newCitizen, ...prev]);

    toast({
      title: "Data Warga Disimpan",
      description: `Warga baru "${newResident.fullName}" telah berhasil ditambahkan.`,
    });

    // Reset form
    setNewResident({
        fullName: "",
        address: "",
        nik: "",
        kk: "",
        receiptNumber: "",
    });
  };

  return (
    <div className="grid gap-4 md:gap-8">
      <Card>
        <form onSubmit={handleSaveResident}>
          <CardHeader>
            <CardTitle>Tambah Data Warga Baru</CardTitle>
            <CardDescription>
              Isi formulir di bawah ini untuk menambahkan warga baru ke dalam
              sistem RT Anda.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="fullName">Nama Lengkap</Label>
                <Input
                  id="fullName"
                  placeholder="Masukkan nama lengkap warga"
                  value={newResident.fullName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Alamat Lengkap</Label>
                <Input
                  id="address"
                  placeholder="Contoh: Jl. Merdeka No. 1"
                  value={newResident.address}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nik">NIK (Nomor Induk Kependudukan)</Label>
                <Input
                  id="nik"
                  placeholder="Masukkan 16 digit NIK"
                  maxLength={16}
                  value={newResident.nik}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="kk">No. KK (Kartu Keluarga)</Label>
                <Input
                  id="kk"
                  placeholder="Masukkan 16 digit No. KK"
                  maxLength={16}
                  value={newResident.kk}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rt">RT</Label>
                <Input
                  id="rt"
                  placeholder="Contoh: 001"
                  defaultValue="001"
                  disabled
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rw">RW</Label>
                <Input
                  id="rw"
                  placeholder="Contoh: 001"
                  defaultValue="001"
                  disabled
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="receiptNumber">No. Kuitansi Sampah</Label>
                <Input
                  id="receiptNumber"
                  placeholder="Masukkan nomor kuitansi"
                  value={newResident.receiptNumber}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit">Simpan Data Warga</Button>
          </CardFooter>
        </form>
      </Card>

      <ResidentsTable residents={residents} />
    </div>
  );
}
