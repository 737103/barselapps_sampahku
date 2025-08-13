"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { rtAccounts, type RTAccount } from "@/lib/data";
import { AddRtAccountModal } from "./add-rt-account-modal";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { EditUsernameModal } from "./edit-username-modal";
import { ChangePasswordModal } from "./change-password-modal";
import { DeleteAccountAlert } from "./delete-account-alert";

export function RtAccountsTable() {
  const [accounts, setAccounts] = useState<RTAccount[]>(rtAccounts);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<RTAccount | null>(null);
  const [deactivatedAccounts, setDeactivatedAccounts] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const handleAddAccount = (newAccountData: Omit<RTAccount, 'id' | 'lastLogin'>) => {
    const newAccount: RTAccount = {
      ...newAccountData,
      id: `rt${accounts.length + 1}`,
      lastLogin: "Baru saja",
    };
    setAccounts(prev => [newAccount, ...prev]);
    toast({
      title: "Akun Berhasil Ditambahkan",
      description: `Akun baru untuk ${newAccount.username} telah dibuat.`,
    });
    setIsAddModalOpen(false);
  };
  
  const handleUpdateUsername = (accountId: string, newUsername: string) => {
    setAccounts(prev => 
      prev.map(acc => 
        acc.id === accountId ? { ...acc, username: newUsername } : acc
      )
    );
    toast({
      title: "Username Diperbarui",
      description: `Username telah berhasil diubah menjadi ${newUsername}.`,
    });
    setIsEditModalOpen(false);
    setSelectedAccount(null);
  }

  const handleResetPassword = (account: RTAccount) => {
    toast({
      title: "Password Direset",
      description: `Password untuk akun ${account.username} telah direset menjadi '123456'.`,
    });
  };

  const handleEditUsername = (account: RTAccount) => {
    setSelectedAccount(account);
    setIsEditModalOpen(true);
  };
  
  const handleChangePassword = (account: RTAccount) => {
    setSelectedAccount(account);
    setIsChangePasswordModalOpen(true);
  };

  const handleDeleteAccount = (account: RTAccount) => {
    setSelectedAccount(account);
    setIsDeleteAlertOpen(true);
  };

  const confirmDeleteAccount = () => {
    if (!selectedAccount) return;
    setAccounts(accounts.filter(acc => acc.id !== selectedAccount.id));
    toast({
        title: "Akun Dihapus",
        description: `Akun ${selectedAccount.username} telah berhasil dihapus.`,
    });
    setIsDeleteAlertOpen(false);
    setSelectedAccount(null);
  };


  const toggleAccountStatus = (account: RTAccount) => {
    const newDeactivatedAccounts = new Set(deactivatedAccounts);
    if (newDeactivatedAccounts.has(account.id)) {
      newDeactivatedAccounts.delete(account.id);
      toast({
        title: "Akun Diaktifkan",
        description: `Akun ${account.username} telah diaktifkan kembali.`,
      });
    } else {
      newDeactivatedAccounts.add(account.id);
      toast({
        title: "Akun Dinonaktifkan",
        description: `Akun ${account.username} telah dinonaktifkan.`,
        variant: "destructive",
      });
    }
    setDeactivatedAccounts(newDeactivatedAccounts);
  };

  return (
    <>
      <Card>
          <CardHeader className="flex flex-row items-center justify-between">
              <div>
                  <CardTitle>Manajemen Akun Ketua RT</CardTitle>
                  <CardDescription>Kelola username dan password untuk setiap Ketua RT.</CardDescription>
              </div>
              <Button onClick={() => setIsAddModalOpen(true)}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Tambah Akun RT
              </Button>
          </CardHeader>
          <CardContent>
              <Table>
                  <TableHeader>
                  <TableRow>
                      <TableHead>Username</TableHead>
                      <TableHead>RT/RW</TableHead>
                      <TableHead>Login Terakhir</TableHead>
                      <TableHead>
                      <span className="sr-only">Actions</span>
                      </TableHead>
                  </TableRow>
                  </TableHeader>
                  <TableBody>
                  {accounts.map((account) => {
                    const isDeactivated = deactivatedAccounts.has(account.id);
                    return (
                      <TableRow key={account.id}>
                      <TableCell className={cn("font-medium", {
                        "text-destructive": isDeactivated,
                      })}>{account.username}</TableCell>
                      <TableCell>{`RT ${account.rt} / RW ${account.rw}`}</TableCell>
                      <TableCell>{account.lastLogin}</TableCell>
                      <TableCell className="text-right">
                          <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                              <Button aria-haspopup="true" size="icon" variant="ghost">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Toggle menu</span>
                              </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Tindakan Cepat</DropdownMenuLabel>
                               <DropdownMenuItem onClick={() => handleEditUsername(account)}>
                                Ubah Username
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleChangePassword(account)}>
                                Ubah Password
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleResetPassword(account)}>
                                Reset Password
                              </DropdownMenuItem>
                               <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => toggleAccountStatus(account)}>
                                  {isDeactivated ? "Aktifkan Akun" : "Nonaktifkan Akun"}
                                </DropdownMenuItem>
                               <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => handleDeleteAccount(account)} 
                                className="text-destructive focus:text-destructive focus:bg-destructive/10"
                              >
                                Hapus Akun
                              </DropdownMenuItem>
                          </DropdownMenuContent>
                          </DropdownMenu>
                      </TableCell>
                      </TableRow>
                    )
                  })}
                  </TableBody>
              </Table>
          </CardContent>
      </Card>
      <AddRtAccountModal isOpen={isAddModalOpen} onOpenChange={setIsAddModalOpen} onSave={handleAddAccount}/>
      {selectedAccount && (
        <>
          <EditUsernameModal 
            isOpen={isEditModalOpen} 
            onOpenChange={setIsEditModalOpen} 
            account={selectedAccount}
            onSave={handleUpdateUsername}
          />
          <ChangePasswordModal
            isOpen={isChangePasswordModalOpen}
            onOpenChange={setIsChangePasswordModalOpen}
            account={selectedAccount}
          />
          <DeleteAccountAlert
            isOpen={isDeleteAlertOpen}
            onOpenChange={setIsDeleteAlertOpen}
            onConfirm={confirmDeleteAccount}
            account={selectedAccount}
          />
        </>
      )}
    </>
  );
}
