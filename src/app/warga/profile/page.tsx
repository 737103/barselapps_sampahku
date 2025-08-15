
"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Citizen } from "@/lib/data";
import { getCitizenById, updateCitizen } from "@/lib/firebase/firestore";
import { useToast } from "@/hooks/use-toast";

export default function WargaProfilePage() {
  const [citizen, setCitizen] = useState<Citizen | null>(null);
  const [formData, setFormData] = useState<Partial<Citizen>>({});
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const citizenId = searchParams.get("citizenId");
  const { toast } = useToast();

  useEffect(() => {
    const fetchCitizen = async () => {
      if (citizenId) {
        setLoading(true);
        const citizenData = await getCitizenById(citizenId);
        setCitizen(citizenData);
        setFormData(citizenData || {});
        setLoading(false);
      }
    };
    fetchCitizen();
  }, [citizenId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({...prev, [id]: value}));
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!citizenId) return;
    const success = await updateCitizen(citizenId, formData);
    if (success) {
      toast({
        title: "Profil Diperbarui",
        description: "Informasi profil Anda telah berhasil diperbarui.",
      });
      const updatedCitizen = await getCitizenById(citizenId);
      setCitizen(updatedCitizen);
    } else {
      toast({
        title: "Gagal Memperbarui Profil",
        description: "Terjadi kesalahan saat menyimpan perubahan.",
        variant: "destructive",
      });
    }
  }

  if (loading) {
    return (
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 bg-muted/40">
        <p>Memuat profil...</p>
      </main>
    )
  }

  if (!citizen) {
     return (
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 bg-muted/40">
        <p>Profil tidak ditemukan.</p>
      </main>
    )
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 bg-muted/40">
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Profil Saya</CardTitle>
            <CardDescription>Lihat dan kelola informasi profil Anda. Hanya data tertentu yang bisa Anda ubah.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Nama Lengkap</Label>
              <Input
                id="name"
                value={formData.name || ""}
                onChange={handleInputChange}
                required
              />
            </div>
             <div className="space-y-2">
              <Label htmlFor="address">Alamat</Label>
              <Input
                id="address"
                value={formData.address || ""}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nik">NIK</Label>
              <Input
                id="nik"
                value={citizen.nik}
                disabled
              />
               <p className="text-xs text-muted-foreground">NIK tidak dapat diubah. Hubungi admin untuk perubahan.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="kk">No. KK</Label>
              <Input
                id="kk"
                value={formData.kk || ""}
                onChange={handleInputChange}
              />
            </div>
             <div className="space-y-2">
              <Label htmlFor="couponNumber">No. Kupon</Label>
              <Input
                id="couponNumber"
                value={citizen.couponNumber}
                disabled
              />
               <p className="text-xs text-muted-foreground">No. Kupon tidak dapat diubah. Hubungi admin untuk perubahan.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="rt">RT</Label>
              <Input
                id="rt"
                value={citizen.rt}
                disabled
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rw">RW</Label>
              <Input
                id="rw"
                value={citizen.rw}
                disabled
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit">Simpan Perubahan</Button>
          </CardFooter>
        </Card>
      </form>
    </main>
  );
}
