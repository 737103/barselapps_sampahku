"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function LoginForm() {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }

  return (
    <div className={cn("grid gap-6")}>
      <Tabs defaultValue="warga" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="warga">Warga</TabsTrigger>
          <TabsTrigger value="rt">Ketua RT</TabsTrigger>
          <TabsTrigger value="admin">Admin</TabsTrigger>
        </TabsList>
        <form onSubmit={onSubmit}>
          <TabsContent value="warga">
            <Card>
              <CardHeader>
                <CardTitle>Login Warga</CardTitle>
                <CardDescription>
                  Masuk menggunakan Nomor Induk Kependudukan (NIK) Anda.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nik">NIK</Label>
                  <Input
                    id="nik"
                    placeholder="Contoh: 3201... (16 digit)"
                    type="text"
                    autoCapitalize="none"
                    autoCorrect="off"
                    disabled={isLoading}
                    maxLength={16}
                  />
                </div>
                <Link href="/warga" className="w-full">
                  <Button disabled={isLoading} className="w-full">
                    Login
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="rt">
            <Card>
              <CardHeader>
                <CardTitle>Login Ketua RT</CardTitle>
                <CardDescription>
                  Masuk menggunakan akun Ketua RT Anda.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username-rt">Username</Label>
                  <Input id="username-rt" placeholder="rt001_rw001" disabled={isLoading} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-rt">Password</Label>
                  <Input id="password-rt" type="password" disabled={isLoading} />
                </div>
                 <Link href="/rt" className="w-full">
                  <Button disabled={isLoading} className="w-full">
                    Login
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="admin">
            <Card>
              <CardHeader>
                <CardTitle>Login Admin</CardTitle>
                <CardDescription>
                  Masuk menggunakan akun Admin Kelurahan Anda.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="space-y-2">
                  <Label htmlFor="username-admin">Username</Label>
                  <Input id="username-admin" placeholder="admin_kelurahan" disabled={isLoading} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-admin">Password</Label>
                  <Input id="password-admin" type="password" disabled={isLoading} />
                </div>
                <Link href="/admin" className="w-full">
                  <Button disabled={isLoading} className="w-full">
                    Login
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </TabsContent>
        </form>
      </Tabs>
    </div>
  );
}
