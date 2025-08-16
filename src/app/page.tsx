
import { LoginForm } from "@/components/login-form";
import { Icons } from "@/components/icons";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="mx-auto flex w-full max-w-[350px] flex-col justify-center space-y-6">
        <Image 
          src="https://images.unsplash.com/photo-1755310672242-80ce88b024b9?w=3000&h=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwcm9maWxlLXBhZ2V8MXx8fGVufDB8fHx8fA%3D%3D"
          alt="Banner"
          width={350}
          height={117}
          className="rounded-lg object-cover mb-4"
          data-ai-hint="nature landscape"
        />
        <div className="flex flex-col items-center space-y-2 text-center">
          <Icons.logo className="h-12 w-12" />
          <h1 className="text-2xl font-semibold tracking-tight font-headline text-secondary">
            SampahKU
          </h1>
          <p className="text-sm text-blue-500">
            Aplikasi Pembayaran Iuran Sampah
          </p>
        </div>
        <LoginForm />
        <p className="px-8 text-center text-sm text-muted-foreground">
          Copyright 2024 SampahKU Kel. Bara Baraya Selatan
        </p>
      </div>
    </div>
  );
}
