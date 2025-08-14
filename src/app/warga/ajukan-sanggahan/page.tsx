
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useSearchParams } from "next/navigation";
import { addDispute, getCitizenById } from "@/lib/firebase/firestore";
import { DisputesHistoryTable } from "@/components/warga/disputes-history-table";

export default function AjukanSanggahanPage() {
  const [fileName, setFileName] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const citizenId = searchParams.get("citizenId");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          if (file.size > 500 * 1024) {
            toast({
              title: "Ukuran file terlalu besar",
              description: "Ukuran file maksimal 500 KB.",
              variant: "destructive"
            });
            e.target.value = ""; // Reset file input
            setFileName(null);
            return;
          }
          setFileName(file.name);
      } else {
          setFileName(null);
      }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason) {
      toast({ title: "Alasan harus diisi", variant: "destructive" });
      return;
    }
    if (!citizenId) {
      toast({ title: "ID Warga tidak ditemukan", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    const citizen = await getCitizenById(citizenId);
    if (!citizen) {
       toast({ title: "Data warga tidak ditemukan", variant: "destructive" });
       setIsSubmitting(false);
       return;
    }
    
    // Note: This form is generic and doesn't link to a specific payment.
    // In a real app, this might be initiated from a specific payment row.
    const disputeData = {
        paymentId: "UMUM", // General dispute, not tied to a specific payment
        citizenId: citizen.id,
        citizenName: citizen.name,
        rt: citizen.rt,
        rw: citizen.rw,
        reason: reason,
        proofUrl: "https://placehold.co/400x400.png" // Placeholder
    };

    const result = await addDispute(disputeData);
    if (result) {
        toast({
            title: "Sanggahan Terkirim",
            description: "Sanggahan Anda telah berhasil dikirim dan akan segera ditinjau.",
        });
        setReason("");
        setFileName(null);
        // Maybe trigger a refresh of the history table here
    } else {
        toast({
            title: "Gagal Mengirim Sanggahan",
            description: "Terjadi kesalahan. Silakan coba lagi.",
            variant: "destructive",
        });
    }

    setIsSubmitting(false);
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 bg-muted/40">
      <form onSubmit={handleSubmit}>
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
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  required 
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
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Mengirim...' : 'Kirim Sanggahan'}
              </Button>
          </CardFooter>
        </Card>
      </form>

      <DisputesHistoryTable />

    </main>
  );
}
