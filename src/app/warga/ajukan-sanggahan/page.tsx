
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";
import React, { useState } from "react";

export default function AjukanSanggahanPage() {
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          if (file.size > 500 * 1024) {
            alert("Ukuran file terlalu besar. Maksimal 500 KB.");
            e.target.value = ""; // Reset file input
            setFileName(null);
            return;
          }
          setFileName(file.name);
      } else {
          setFileName(null);
      }
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 bg-muted/40">
      <Card>
        <CardHeader>
          <CardTitle>Ajukan Sanggahan</CardTitle>
          <CardDescription>
            Jika Anda merasa ada kesalahan dalam catatan pembayaran Anda, silakan ajukan sanggahan di sini.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
           <div className="grid w-full gap-1.5">
            <Label htmlFor="reason">Alasan Sanggahan</Label>
            <Textarea 
                placeholder="Tuliskan alasan sanggahan Anda di sini. Contoh: Saya sudah bayar tapi status masih belum lunas, jumlah pembayaran salah, dll." 
                id="reason" 
            />
          </div>
          <div className="grid w-full gap-1.5">
            <Label htmlFor="proof">Bukti Foto (Opsional)</Label>
             <div className="flex items-center gap-4">
                <Button asChild variant="outline" className="w-fit">
                    <label htmlFor="file-upload" className="cursor-pointer flex items-center gap-2">
                        <Upload className="h-4 w-4" />
                        <span>Unggah Gambar</span>
                    </label>
                </Button>
                <Input id="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleFileChange} />
                {fileName && <p className="text-sm text-muted-foreground">{fileName}</p>}
             </div>
             <p className="text-xs text-muted-foreground">Lampirkan bukti transfer atau foto pendukung lainnya. Unggah gambar (maks. 500 KB).</p>
          </div>
        </CardContent>
        <CardFooter>
            <Button>Kirim Sanggahan</Button>
        </CardFooter>
      </Card>
    </main>
  );
}
