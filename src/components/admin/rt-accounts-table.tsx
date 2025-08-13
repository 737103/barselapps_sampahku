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
} from "@/components/ui/dropdown-menu";
import { rtAccounts, type RTAccount } from "@/lib/data";
import { AddRtAccountModal } from "./add-rt-account-modal";
import { useToast } from "@/hooks/use-toast";

export function RtAccountsTable() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  const handleResetPassword = (account: RTAccount) => {
    toast({
      title: "Password Direset",
      description: `Password untuk akun ${account.username} telah direset menjadi '123456'.`,
    });
  };

  const handleDeactivateAccount = (account: RTAccount) => {
     toast({
      title: "Akun Dinonaktifkan",
      description: `Akun ${account.username} telah dinonaktifkan.`,
      variant: "destructive",
    });
  };

  return (
    <>
      <Card>
          <CardHeader className="flex flex-row items-center justify-between">
              <div>
                  <CardTitle>Manajemen Akun Ketua RT</CardTitle>
                  <CardDescription>Kelola username dan password untuk setiap Ketua RT.</CardDescription>
              </div>
              <Button onClick={() => setIsModalOpen(true)}>
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
                  {rtAccounts.map((account) => (
                      <TableRow key={account.id}>
                      <TableCell className="font-medium">{account.username}</TableCell>
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
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => handleResetPassword(account)}>
                                Reset Password
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDeactivateAccount(account)} className="text-destructive">
                                Nonaktifkan Akun
                              </DropdownMenuItem>
                          </DropdownMenuContent>
                          </DropdownMenu>
                      </TableCell>
                      </TableRow>
                  ))}
                  </TableBody>
              </Table>
          </CardContent>
      </Card>
      <AddRtAccountModal isOpen={isModalOpen} onOpenChange={setIsModalOpen} />
    </>
  );
}
