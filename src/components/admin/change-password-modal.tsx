"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";
import type { RTAccount } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff } from "lucide-react";

type ChangePasswordModalProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  account: RTAccount;
};

export function ChangePasswordModal({ isOpen, onOpenChange, account }: ChangePasswordModalProps) {
  const { toast } = useToast();
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleSave = () => {
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
            description: "Password minimal harus 6 karakter.",
            variant: "destructive",
        });
        return;
    }
    
    console.log(`Updating password for ${account.username}`);
    toast({
      title: "Password Diperbarui",
      description: `Password untuk akun ${account.username} telah berhasil diubah.`,
    });
    onOpenChange(false);
    setNewPassword("");
    setConfirmPassword("");
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ubah Password</DialogTitle>
          <DialogDescription>
            Ubah password untuk akun <span className="font-semibold">{account.username}</span>.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="new-password" className="text-right">
              Password Baru
            </Label>
            <div className="col-span-3 relative">
                <Input 
                id="new-password" 
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Masukkan password baru"
                />
                 <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    onClick={togglePasswordVisibility} 
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground"
                >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    <span className="sr-only">{showPassword ? 'Sembunyikan' : 'Tampilkan'}</span>
                </Button>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="confirm-password" className="text-right">
              Konfirmasi
            </Label>
            <Input 
              id="confirm-password" 
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="col-span-3" 
              placeholder="Konfirmasi password baru"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Batal</Button>
          <Button type="submit" onClick={handleSave}>Simpan Password</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
