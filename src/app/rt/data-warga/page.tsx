
"use client";

import { useState, useEffect } from "react";
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
import { type Citizen } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import { addCitizen, getCitizensByRT, getCitizenByNIK } from "@/lib/firebase/firestore";

export default function DataWargaPage() {
  const [residents, setResidents] = useState<Citizen[]>([]);
  const [loading, setLoading] = useState(true);
  const [newResident, setNewResident] = useState({
    fullName: "",
    address: "",
    nik: "",
    kk: "",
  });
  const { toast } = useToast();
  const currentRT = "001"; // Assuming static RT for now
  const currentRW = "001"; // Assuming static RW for now

  useEffect(() => {
    const fetchCitizens = async () => {
      setLoading(true);
      const fetchedCitizens = await getCitizensByRT(currentRT, currentRW);
      setResidents(fetchedCitizens);
      setLoading(false);
    };
    fetchCitizens();
  }, [currentRT, currentRW]);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setNewResident((prev) => ({ ...prev, [id]: value }));
  };

  const handleSaveResident = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation for required fields
    if (!newResident.fullName || !newResident.nik || !newResident.address) {
        toast({
            title: "Data Tidak Lengkap",
            description: "Mohon isi semua kolom yang wajib diisi (Nama, Alamat, NIK).",
            variant: "destructive",
        });
        return;
    }

    // Validation for NIK format (16 digits)
    const nikRegex = /^\d{16}$/;
    if (!nikRegex.test(newResident.nik)) {
        toast({
            title: "Format NIK Salah",
            description: "NIK harus terdiri dari 16 digit angka.",
            variant: "destructive",
        });
        return;
    }
    
    // Validation for KK format (16 digits, if provided)
    if (newResident.kk) {
        const kkRegex = /^\d{16}$/;
        if (!kkRegex.test(newResident.kk)) {
            toast({
                title: "Format No. KK Salah",
                description: "No. KK harus terdiri dari 16 digit angka.",
                variant: "destructive",
            });
            return;
        }
    }

    // Validation for NIK uniqueness
    const existingCitizen = await getCitizenByNIK(newResident.nik);
    if (existingCitizen) {
        toast({
            title: "NIK Sudah Terdaftar",
            description: "NIK yang Anda masukkan sudah terdaftar untuk warga lain.",
            variant: "destructive",
        });
        return;
    }

    const citizenData = {
      name: newResident.fullName,
      address: newResident.address,
      nik: newResident.nik,
      kk: newResident.kk,
      rt: currentRT,
      rw: currentRW,
    };
    
    const newCitizen = await addCitizen(citizenData);

    if(newCitizen) {
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
      });
    } else {
        toast({
            title: "Gagal Menyimpan Data",
            description: "Terjadi kesalahan saat menambahkan warga baru.",
            variant: "destructive",
        })
    }
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
                  value={currentRT}
                  disabled
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rw">RW</Label>
                <Input
                  id="rw"
                  value={currentRW}
                  disabled
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit">Simpan Data Warga</Button>
          </CardFooter>
        </form>
      </Card>

      <ResidentsTable residents={residents} setResidents={setResidents} loading={loading} />
    </div>
  );
}
