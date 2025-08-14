
"use client";

import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, User, Settings, LifeBuoy } from "lucide-react";

type UserNavProps = {
  name: string;
  email: string;
  role: "Admin" | "Ketua RT" | "Warga";
};

export function UserNav({ name, email, role }: UserNavProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("");

  const getRoleBasedPath = (path: 'profile' | 'settings' | 'support') => {
      const base = role.toLowerCase().replace(' ', '');
      if (base === 'admin') {
        if (path === 'profile') return '/admin/settings'; // Admin profile is on settings page
        return `/admin/${path}`;
      }
      if (base === 'ketuart') {
        if (path === 'profile') return '/rt/settings'; // RT profile is on settings page
         return `/rt/${path}`;
      }
       if (base === 'warga') {
        if (path === 'settings') return '/warga/profile'; // Warga settings is on profile page
        return `/warga/${path}`;
      }
      return '/';
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-9 w-9">
            <AvatarImage src={`https://avatar.vercel.sh/${name}.png`} alt={name} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href={getRoleBasedPath('profile')}>
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
          </Link>
          <Link href={getRoleBasedPath('settings')}>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
         <Link href={getRoleBasedPath('support')}>
            <DropdownMenuItem>
            <LifeBuoy className="mr-2 h-4 w-4" />
            <span>Support</span>
            </DropdownMenuItem>
         </Link>
        <DropdownMenuSeparator />
        <Link href="/">
            <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
            </DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
