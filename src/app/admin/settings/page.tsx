
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function AdminSettingsPage() {
  const { toast } = useToast();
  const [username, setUsername] = useState("admin_kelurahan");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleUsernameSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Username Diperbarui",
      description: `Username admin telah diubah menjadi ${username}.`,
    });
  };

  const handlePasswordSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast({
        title: "Password Tidak Cocok",
        description: "Password baru dan konfirmasi password harus sama.",
        variant: "destructive",
      });
      return;
    }
    if (newPassword.length < 6) {
      toast({
        title: "Password Terlalu Pendek",
        description: "Password baru minimal harus 6 karakter.",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Password Berhasil Diubah",
      description: "Password Anda telah berhasil diperbarui.",
    });
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <form onSubmit={handleUsernameSave}>
          <CardHeader>
            <CardTitle>Ubah Username</CardTitle>
            <CardDescription>Ubah username yang akan Anda gunakan untuk login.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input 
                id="username" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit">Simpan Username</Button>
          </CardFooter>
        </form>
      </Card>
      
      <Card>
        <form onSubmit={handlePasswordSave}>
          <CardHeader>
            <CardTitle>Ubah Password</CardTitle>
            <CardDescription>Ubah password Anda secara berkala untuk menjaga keamanan akun.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 relative">
              <Label htmlFor="current-password">Password Saat Ini</Label>
              <Input 
                id="current-password" 
                type={showCurrentPassword ? "text" : "password"} 
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
               <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)} 
                    className="absolute right-1 bottom-1 h-7 w-7 text-muted-foreground"
                >
                    {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    <span className="sr-only">{showCurrentPassword ? 'Sembunyikan' : 'Tampilkan'}</span>
                </Button>
            </div>
            <div className="space-y-2 relative">
              <Label htmlFor="new-password">Password Baru</Label>
              <Input 
                id="new-password" 
                type={showNewPassword ? "text" : "password"} 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setShowNewPassword(!showNewPassword)} 
                    className="absolute right-1 bottom-1 h-7 w-7 text-muted-foreground"
                >
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    <span className="sr-only">{showNewPassword ? 'Sembunyikan' : 'Tampilkan'}</span>
                </Button>
            </div>
            <div className="space-y-2 relative">
              <Label htmlFor="confirm-password">Konfirmasi Password Baru</Label>
              <Input 
                id="confirm-password" 
                type={showConfirmPassword ? "text" : "password"} 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                    className="absolute right-1 bottom-1 h-7 w-7 text-muted-foreground"
                >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    <span className="sr-only">{showConfirmPassword ? 'Sembunyikan' : 'Tampilkan'}</span>
                </Button>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit">Simpan Password</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
