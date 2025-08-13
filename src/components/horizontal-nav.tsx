"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  isActive: boolean;
};

type HorizontalNavProps = {
  items: NavItem[];
};

export function HorizontalNav({ items }: HorizontalNavProps) {
  return (
    <nav className="border-b bg-background">
      <div className="flex h-14 items-center gap-4 px-4 md:px-6">
        {items.map(({ href, label, icon: Icon, isActive }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <Icon className="h-4 w-4" />
            <span>{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
