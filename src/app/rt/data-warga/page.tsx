import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function DataWargaPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 bg-muted/40">
      <Card>
        <CardHeader>
          <CardTitle>Data Warga</CardTitle>
          <CardDescription>Lihat data warga di RT Anda.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Halaman data warga sedang dalam pengembangan.</p>
        </CardContent>
      </Card>
    </main>
  );
}
