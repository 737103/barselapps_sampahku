import { ResidentsTable } from "@/components/rt/residents-table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function DataWargaPage() {
  return (
    <div className="grid gap-4 md:gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Tambah Data Warga Baru</CardTitle>
          <CardDescription>
            Isi formulir di bawah ini untuk menambahkan warga baru ke dalam sistem RT Anda.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="fullName">Nama Lengkap</Label>
              <Input id="fullName" placeholder="Masukkan nama lengkap warga" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Alamat Lengkap</Label>
              <Input id="address" placeholder="Contoh: Jl. Merdeka No. 1" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nik">NIK (Nomor Induk Kependudukan)</Label>
              <Input id="nik" placeholder="Masukkan 16 digit NIK" maxLength={16} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="kk">No. KK (Kartu Keluarga)</Label>
              <Input id="kk" placeholder="Masukkan 16 digit No. KK" maxLength={16} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rt">RT</Label>
              <Input id="rt" placeholder="Contoh: 001" defaultValue="001" disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rw">RW</Label>
              <Input id="rw" placeholder="Contoh: 001" defaultValue="001" disabled />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="receiptNumber">No. Kuitansi Sampah</Label>
              <Input id="receiptNumber" placeholder="Masukkan nomor kuitansi" />
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button>Simpan Data Warga</Button>
        </CardFooter>
      </Card>
      
      <ResidentsTable />
    </div>
  );
}
