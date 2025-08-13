import { DisputesTable } from "@/components/admin/disputes-table";

export default function SanggahanPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 bg-muted/40">
      <DisputesTable />
    </main>
  );
}
