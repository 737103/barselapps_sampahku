import { HistoryTable } from "@/components/warga/history-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertCircle, FileText } from "lucide-react";

export default function WargaDashboardPage() {
  const currentStatus = "Lunas";
  
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 bg-muted/40">
      <div className="grid gap-4 md:gap-8">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Status Iuran Bulan Ini (Juni 2024)</CardTitle>
                    <CardDescription>Status pembayaran iuran sampah Anda untuk bulan berjalan.</CardDescription>
                </div>
                <Button variant="outline"><FileText className="mr-2 h-4 w-4"/>Unduh Kuitansi</Button>
            </CardHeader>
            <CardContent>
                {currentStatus === "Lunas" ? (
                    <div className="flex items-center gap-4 p-6 bg-primary/10 rounded-lg">
                        <CheckCircle2 className="h-10 w-10 text-primary"/>
                        <div>
                            <p className="text-2xl font-bold font-headline text-primary">Lunas</p>
                            <p className="text-muted-foreground">Terima kasih! Pembayaran Anda untuk bulan Juni 2024 telah kami terima.</p>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center gap-4 p-6 bg-destructive/10 rounded-lg">
                        <AlertCircle className="h-10 w-10 text-destructive"/>
                        <div>
                            <p className="text-2xl font-bold font-headline text-destructive">Belum Lunas</p>
                            <p className="text-muted-foreground">Pembayaran untuk bulan Juni 2024 belum kami terima. Mohon segera lakukan pembayaran.</p>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
        <HistoryTable />
      </div>
    </main>
  );
}
