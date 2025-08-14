
"use client";

import { useEffect, useState } from "react";
import { HistoryTable } from "@/components/warga/history-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertCircle, FileText, Megaphone, X } from "lucide-react";
import type { Notification, Payment } from "@/lib/data";
import { getNotificationsForCitizen, markNotificationAsRead, getPaymentsForCitizen } from "@/lib/firebase/firestore";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export default function WargaDashboardPage() {
  const [paymentStatus, setPaymentStatus] = useState<Payment['status'] | "Loading">("Loading");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const citizenId = "vE3z7I5a1v4gYa3i9x8G"; // Hardcoded citizen for now

  const currentPeriod = format(new Date(), "MMMM yyyy", { locale: id });

  useEffect(() => {
    const fetchData = async () => {
      if (citizenId) {
        // Fetch Notifications
        const fetchedNotifications = await getNotificationsForCitizen(citizenId);
        setNotifications(fetchedNotifications);

        // Fetch Payment Status
        setPaymentStatus("Loading");
        const payments = await getPaymentsForCitizen(citizenId);
        const currentMonthPayment = payments.find(p => p.period === currentPeriod);
        setPaymentStatus(currentMonthPayment?.status ?? "Belum Lunas");
      }
    };
    fetchData();
  }, [citizenId, currentPeriod]);

  const handleDismissNotification = async (notificationId: string) => {
    const success = await markNotificationAsRead(notificationId);
    if (success) {
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
    }
  };
  
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 bg-muted/40">
      {notifications.map(notification => (
        <Alert key={notification.id} variant="default" className="bg-blue-500/10 border-blue-500/50 text-blue-700 dark:text-blue-300">
            <div className="flex items-start justify-between">
                <div className="flex items-start">
                    <Megaphone className="h-5 w-5 mr-3 text-blue-500" />
                    <div>
                        <AlertTitle className="font-semibold">Pengingat Pembayaran</AlertTitle>
                        <AlertDescription className="text-blue-700/80 dark:text-blue-300/80">
                            {notification.message}
                        </AlertDescription>
                    </div>
                </div>
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 text-blue-500 hover:bg-blue-500/10"
                    onClick={() => handleDismissNotification(notification.id)}
                >
                    <X className="h-4 w-4"/>
                    <span className="sr-only">Tutup</span>
                </Button>
            </div>
        </Alert>
      ))}

      <div className="grid gap-4 md:gap-8">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Status Iuran Bulan Ini ({currentPeriod})</CardTitle>
                    <CardDescription>Status pembayaran iuran sampah Anda untuk bulan berjalan.</CardDescription>
                </div>
                {paymentStatus === "Lunas" && (
                    <Button variant="outline"><FileText className="mr-2 h-4 w-4"/>Unduh Kuitansi</Button>
                )}
            </CardHeader>
            <CardContent>
                {paymentStatus === "Loading" ? (
                     <div className="flex items-center gap-4 p-6 bg-muted rounded-lg">
                        <p>Memeriksa status pembayaran...</p>
                    </div>
                ) : paymentStatus === "Lunas" ? (
                    <div className="flex items-center gap-4 p-6 bg-primary/10 rounded-lg">
                        <CheckCircle2 className="h-10 w-10 text-primary"/>
                        <div>
                            <p className="text-2xl font-bold font-headline text-primary">Lunas</p>
                            <p className="text-muted-foreground">Terima kasih! Pembayaran Anda untuk bulan {currentPeriod} telah kami terima.</p>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center gap-4 p-6 bg-destructive/10 rounded-lg">
                        <AlertCircle className="h-10 w-10 text-destructive"/>
                        <div>
                            <p className="text-2xl font-bold font-headline text-destructive">Belum Lunas</p>
                            <p className="text-muted-foreground">Pembayaran untuk bulan {currentPeriod} belum kami terima. Mohon segera lakukan pembayaran.</p>
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
