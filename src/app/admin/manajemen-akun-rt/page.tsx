import { RtAccountsTable } from "@/components/admin/rt-accounts-table";

export default function ManajemenAkunRTPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 bg-muted/40">
      <RtAccountsTable />
    </main>
  );
}
