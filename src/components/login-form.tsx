
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
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
import { authenticateRT, getCitizenByNIK, authenticateAdmin } from "@/lib/firebase/firestore";
import { useToast } from "@/hooks/use-toast";

export function LoginForm() {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const router = useRouter();
  const { toast } = useToast();

  const [nik, setNik] = React.useState("");
  const [rtUsername, setRtUsername] = React.useState("");
  const [rtPassword, setRtPassword] = React.useState("");
  const [adminUsername, setAdminUsername] = React.useState("");
  const [adminPassword, setAdminPassword] = React.useState("");

  const handleWargaLogin = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    setIsLoading(true);
    const citizen = await getCitizenByNIK(nik);
    if (citizen) {
      // In a real app, you'd set some session/context here
      router.push("/warga");
    } else {
      toast({
        title: "Login Gagal",
        description: "NIK tidak terdaftar. Silakan hubungi Ketua RT Anda.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  const handleRtLogin = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    setIsLoading(true);
    const rtUser = await authenticateRT(rtUsername, rtPassword);
    if (rtUser) {
       // In a real app, you'd set some session/context here
      router.push(`/rt?accountId=${rtUser.id}`);
    } else {
      toast({
        title: "Login Gagal",
        description: "Username atau password salah, atau akun Anda dinonaktifkan.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  const handleAdminLogin = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    setIsLoading(true);
    
    const adminUser = await authenticateAdmin(adminUsername, adminPassword);

    if (adminUser) {
      router.push("/admin");
    } else {
        toast({
            title: "Login Gagal",
            description: "Username atau password admin salah.",
            variant: "destructive",
        });
    }
    setIsLoading(false);
  };

  return (
    <div className={cn("grid gap-6")}>
      <Tabs defaultValue="warga" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="warga">Warga</TabsTrigger>
          <TabsTrigger value="rt">Ketua RT</TabsTrigger>
          <TabsTrigger value="admin">Admin</TabsTrigger>
        </TabsList>
        
        <TabsContent value="warga">
          <form onSubmit={handleWargaLogin}>
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
                    value={nik}
                    onChange={(e) => setNik(e.target.value)}
                    required
                  />
                </div>
                <Button disabled={isLoading} className="w-full" type="submit">
                  {isLoading ? "Loading..." : "Login"}
                </Button>
              </CardContent>
            </Card>
          </form>
        </TabsContent>
        
        <TabsContent value="rt">
          <form onSubmit={handleRtLogin}>
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
                  <Input 
                    id="username-rt" 
                    placeholder="rt001_rw001" 
                    disabled={isLoading} 
                    value={rtUsername}
                    onChange={(e) => setRtUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-rt">Password</Label>
                  <Input 
                    id="password-rt" 
                    type="password" 
                    disabled={isLoading} 
                    value={rtPassword}
                    onChange={(e) => setRtPassword(e.target.value)}
                    required
                  />
                </div>
                <Button disabled={isLoading} className="w-full" type="submit">
                  {isLoading ? "Loading..." : "Login"}
                </Button>
              </CardContent>
            </Card>
          </form>
        </TabsContent>

        <TabsContent value="admin">
          <form onSubmit={handleAdminLogin}>
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
                  <Input 
                    id="username-admin" 
                    placeholder="admin_kelurahan" 
                    disabled={isLoading}
                    value={adminUsername}
                    onChange={(e) => setAdminUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-admin">Password</Label>
                  <Input 
                    id="password-admin" 
                    type="password" 
                    disabled={isLoading} 
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    required
                  />
                </div>
                <Button disabled={isLoading} className="w-full" type="submit">
                  {isLoading ? "Loading..." : "Login"}
                </Button>
              </CardContent>
            </Card>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
}
