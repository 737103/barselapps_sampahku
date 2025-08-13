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
import { LayoutDashboard, Users, MessageSquareWarning, Settings, LifeBuoy, KeyRound } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const adminUser = {
    name: "Admin Kelurahan",
    email: "admin@wastepay.app",
    role: "Admin" as const,
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
              <SidebarMenuButton href="/admin" isActive={pathname === '/admin'}>
                <LayoutDashboard />
                Dashboard
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="/admin/manajemen-warga" isActive={pathname.startsWith('/admin/manajemen-warga')}>
                <Users />
                Manajemen Warga
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="/admin/manajemen-akun-rt" isActive={pathname.startsWith('/admin/manajemen-akun-rt')}>
                <KeyRound />
                Manajemen Akun RT
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="/admin/sanggahan" isActive={pathname.startsWith('/admin/sanggahan')}>
                <MessageSquareWarning />
                Sanggahan
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
            <Separator className="my-2" />
            <SidebarMenu>
                 <SidebarMenuItem>
                    <SidebarMenuButton href="/admin/settings" isActive={pathname.startsWith('/admin/settings')}>
                        <Settings />
                        Settings
                    </SidebarMenuButton>
                </SidebarMenuItem>
                 <SidebarMenuItem>
                    <SidebarMenuButton href="/admin/support" isActive={pathname.startsWith('/admin/support')}>
                        <LifeBuoy />
                        Support
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <DashboardHeader user={adminUser} title="Admin Dashboard" />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
