
import { LoginForm } from "@/components/login-form";
import { Icons } from "@/components/icons";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center">
      <Image
        src="https://images.unsplash.com/photo-1542903660-eedba2cda473?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTV8fGluZm9ybWFzaXxlbnwwfHwwfHx8MA%3D%3D"
        alt="Background"
        layout="fill"
        objectFit="cover"
        className="z-0"
        data-ai-hint="abstract technology"
      />
      <div className="relative z-10 mx-auto flex w-full max-w-[350px] flex-col justify-center space-y-6 rounded-lg bg-background/80 p-6 shadow-lg backdrop-blur-sm">
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
