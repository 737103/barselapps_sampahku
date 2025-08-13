"use client";

import { UserNav } from "@/components/user-nav";
import { cn } from "@/lib/utils";
import { Icons } from "./icons";

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
        <div className="flex items-center gap-4">
             <div className="flex items-center gap-2">
                <Icons.logo className="h-8 w-8 text-primary" />
                <span className="text-lg font-semibold font-headline">SampahKU</span>
            </div>
            <div className="h-6 w-px bg-border" />
            <h1 className="text-lg font-semibold md:text-xl font-headline">{title}</h1>
        </div>
        <UserNav name={user.name} email={user.email} role={user.role} />
    </header>
  );
}
