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
import { UserNav } from "@/components/user-nav";
import { Separator } from "@/components/ui/separator";
import { LayoutDashboard, History, MessageSquarePlus, Settings, LifeBuoy } from "lucide-react";

export default function WargaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const wargaUser = {
    name: "Budi Santoso",
    email: "budi.s@example.com",
    role: "Warga" as const,
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
              <SidebarMenuButton href="/warga" isActive>
                <LayoutDashboard />
                Dashboard
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="#">
                <History />
                Riwayat Pembayaran
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="#">
                <MessageSquarePlus />
                Ajukan Sanggahan
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
            <Separator className="my-2" />
            <SidebarMenu>
                 <SidebarMenuItem>
                    <SidebarMenuButton href="#">
                        <Settings />
                        Profile
                    </SidebarMenuButton>
                </SidebarMenuItem>
                 <SidebarMenuItem>
                    <SidebarMenuButton href="#">
                        <LifeBuoy />
                        Support
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <DashboardHeader user={wargaUser} title="Warga Dashboard" />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
