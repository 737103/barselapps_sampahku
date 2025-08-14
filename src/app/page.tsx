
import { LoginForm } from "@/components/login-form";
import { Icons } from "@/components/icons";

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="mx-auto flex w-full max-w-[350px] flex-col justify-center space-y-6">
        <div className="flex flex-col items-center space-y-2 text-center">
          <Icons.logo className="h-12 w-12" />
          <h1 className="text-2xl font-semibold tracking-tight font-headline">
            WastePay
          </h1>
          <p className="text-sm text-muted-foreground">
            Aplikasi Pembayaran Iuran Sampah
          </p>
        </div>
        <LoginForm />
        <p className="px-8 text-center text-sm text-muted-foreground">
          Copyright 2024 WastePay
        </p>
      </div>
    </div>
  );
}
