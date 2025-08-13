import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function LaporanPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 bg-muted/40">
      <Card>
        <CardHeader>
          <CardTitle>Laporan</CardTitle>
          <CardDescription>Lihat dan unduh laporan pembayaran iuran.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Halaman laporan sedang dalam pengembangan.</p>
        </CardContent>
      </Card>
    </main>
  );
}
