"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { UserNav } from "@/components/user-nav";
import { cn } from "@/lib/utils";

type DashboardHeaderProps = React.HTMLAttributes<HTMLDivElement> & {
    user: {
        name: string;
        email: string;
        role: "Admin" | "Ketua RT" | "Warga";
    };
    title: string;
};

export function DashboardHeader({ user, title, className }: DashboardHeaderProps) {
  return (
    <header className={cn("sticky top-0 z-10 flex h-16 items-center justify-between gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6", className)}>
        <div className="flex items-center gap-2">
            <SidebarTrigger className="md:hidden" />
            <h1 className="text-lg font-semibold md:text-xl font-headline">{title}</h1>
        </div>
        <UserNav name={user.name} email={user.email} role={user.role} />
    </header>
  );
}
