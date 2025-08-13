import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function ManajemenWargaPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 bg-muted/40">
      <Card>
        <CardHeader>
          <CardTitle>Manajemen Warga</CardTitle>
          <CardDescription>Kelola data semua warga yang terdaftar di sistem.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Halaman untuk manajemen warga sedang dalam pengembangan.</p>
        </CardContent>
      </Card>
    </main>
  );
}
