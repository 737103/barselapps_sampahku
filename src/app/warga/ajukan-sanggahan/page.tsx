import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function AjukanSanggahanPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 bg-muted/40">
      <Card>
        <CardHeader>
          <CardTitle>Ajukan Sanggahan</CardTitle>
          <CardDescription>
            Jika Anda merasa ada kesalahan dalam catatan pembayaran Anda, silakan ajukan sanggahan di sini.
          </CardDescription>
        </CardHeader>
        <CardContent>
           <div className="grid w-full gap-1.5">
            <Label htmlFor="reason">Alasan Sanggahan</Label>
            <Textarea 
                placeholder="Tuliskan alasan sanggahan Anda di sini. Contoh: Saya sudah bayar tapi status masih belum lunas, jumlah pembayaran salah, dll." 
                id="reason" 
            />
          </div>
        </CardContent>
        <CardFooter>
            <Button>Kirim Sanggahan</Button>
        </CardFooter>
      </Card>
    </main>
  );
}
