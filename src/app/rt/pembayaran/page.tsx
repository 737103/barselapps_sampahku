import { ResidentsTable } from "@/components/rt/residents-table";

export default function PembayaranPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 bg-muted/40">
       <ResidentsTable />
    </main>
  );
}
