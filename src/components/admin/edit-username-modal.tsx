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

type EditUsernameModalProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  account: RTAccount;
};

export function EditUsernameModal({ isOpen, onOpenChange, account }: EditUsernameModalProps) {
  const { toast } = useToast();
  const [newUsername, setNewUsername] = React.useState(account.username);

  const handleSave = () => {
    // Here you would typically call an API to update the username
    console.log(`Updating username for ${account.username} to ${newUsername}`);
    toast({
      title: "Username Diperbarui",
      description: `Username untuk akun ${account.username} telah diubah menjadi ${newUsername}.`,
    });
    onOpenChange(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ubah Username</DialogTitle>
          <DialogDescription>
            Ubah username untuk akun <span className="font-semibold">{account.username}</span>.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username Baru
            </Label>
            <Input 
              id="username" 
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Batal</Button>
          <Button type="submit" onClick={handleSave}>Simpan Perubahan</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
