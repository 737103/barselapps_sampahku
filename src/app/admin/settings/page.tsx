
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { getAdminAccount, updateAdminUsername, updateAdminPassword } from "@/lib/firebase/firestore";

export default function AdminSettingsPage() {
    const { toast } = useToast();
    const [currentUsername, setCurrentUsername] = useState("admin");
    const [newUsername, setNewUsername] = useState("");

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        const fetchAdmin = async () => {
            const admin = await getAdminAccount();
            if (admin) {
                setCurrentUsername(admin.username);
                setNewUsername(admin.username);
            }
        };
        fetchAdmin();
    }, []);


    const handleUsernameSave = async (e: React.FormEvent) => {
        e.preventDefault();
        const success = await updateAdminUsername(newUsername);
        if (success) {
            toast({
                title: "Username Diperbarui",
                description: "Username admin telah berhasil diubah.",
            });
            setCurrentUsername(newUsername);
        } else {
            toast({
                title: "Gagal Memperbarui Username",
                description: "Terjadi kesalahan. Silakan coba lagi.",
                variant: "destructive",
            });
        }
    };

    const handlePasswordSave = async (e: React.FormEvent) => {
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
                description: "Password minimal harus 6 karakter.",
                variant: "destructive",
            });
            return;
        }

        const success = await updateAdminPassword(newPassword);
        if (success) {
            toast({
                title: "Password Diperbarui",
                description: "Password admin telah berhasil diubah.",
            });
            setNewPassword("");
            setConfirmPassword("");
        } else {
            toast({
                title: "Gagal Memperbarui Password",
                description: "Terjadi kesalahan. Silakan coba lagi.",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="grid gap-6 md:grid-cols-2">
            <Card>
                <form onSubmit={handleUsernameSave}>
                    <CardHeader>
                        <CardTitle>Ubah Username Admin</CardTitle>
                        <CardDescription>
                            Username saat ini: <span className="font-semibold">{currentUsername}</span>
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Label htmlFor="username">Username Baru</Label>
                        <Input
                            id="username"
                            value={newUsername}
                            onChange={(e) => setNewUsername(e.target.value)}
                            required
                        />
                    </CardContent>
                    <CardFooter>
                        <Button type="submit">Simpan Username</Button>
                    </CardFooter>
                </form>
            </Card>
            <Card>
                <form onSubmit={handlePasswordSave}>
                    <CardHeader>
                        <CardTitle>Ubah Password Admin</CardTitle>
                        <CardDescription>
                            Pastikan Anda menggunakan password yang kuat.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2 relative">
                            <Label htmlFor="new-password">Password Baru</Label>
                            <Input
                                id="new-password"
                                type={showPassword ? "text" : "password"}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Minimal 6 karakter"
                                required
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-1 top-6 h-7 w-7 text-muted-foreground"
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirm-password">Konfirmasi Password Baru</Label>
                            <Input
                                id="confirm-password"
                                type={showPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Ketik ulang password baru"
                                required
                            />
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
