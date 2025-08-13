"use client";

import { usePathname } from "next/navigation";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { DashboardHeader } from "@/components/dashboard-header";
import { Icons } from "@/components/icons";
import { Separator } from "@/components/ui/separator";
import { LayoutDashboard, Users, DollarSign, Settings, LifeBuoy, FileText } from "lucide-react";

export default function RTLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const rtUser = {
    name: "Ketua RT 001/001",
    email: "rt001@wastepay.app",
    role: "Ketua RT" as const,
  };

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
            <div className="flex items-center gap-2">
                <Icons.logo className="h-8 w-8 text-primary" />
                <span className="text-lg font-semibold font-headline">WastePay</span>
            </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton href="/rt" isActive={pathname === '/rt'}>
                <LayoutDashboard />
                Dashboard
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="/rt/pembayaran" isActive={pathname === '/rt/pembayaran'}>
                <DollarSign />
                Pembayaran
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="/rt/data-warga" isActive={pathname === '/rt/data-warga'}>
                <Users />
                Data Warga
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton href="/rt/laporan" isActive={pathname === '/rt/laporan'}>
                <FileText />
                Laporan
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
            <Separator className="my-2" />
            <SidebarMenu>
                 <SidebarMenuItem>
                    <SidebarMenuButton href="/rt/settings" isActive={pathname === '/rt/settings'}>
                        <Settings />
                        Settings
                    </SidebarMenuButton>
                </SidebarMenuItem>
                 <SidebarMenuItem>
                    <SidebarMenuButton href="/rt/support" isActive={pathname === '/rt/support'}>
                        <LifeBuoy />
                        Support
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <DashboardHeader user={rtUser} title="RT Dashboard" />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
