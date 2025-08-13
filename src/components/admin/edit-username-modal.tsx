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
import React, { useEffect } from "react";
import type { RTAccount } from "@/lib/data";

type EditUsernameModalProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  account: RTAccount;
  onSave: (accountId: string, newUsername: string) => void;
};

export function EditUsernameModal({ isOpen, onOpenChange, account, onSave }: EditUsernameModalProps) {
  const [newUsername, setNewUsername] = React.useState(account.username);

  useEffect(() => {
    if (isOpen) {
      setNewUsername(account.username);
    }
  }, [isOpen, account.username]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (newUsername.trim()) {
      onSave(account.id, newUsername);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSave}>
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
                className="col-span-3" 
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Batal</Button>
            <Button type="submit">Simpan Perubahan</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
