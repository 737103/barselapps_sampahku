
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import React from 'react';

export default function WargaSupportPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 bg-muted/40">
      <Card>
        <CardHeader>
          <CardTitle>Support</CardTitle>
          <CardDescription>Hubungi tim support jika Anda memerlukan bantuan.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Halaman support warga sedang dalam pengembangan.</p>
        </CardContent>
      </Card>
    </main>
  );
}
