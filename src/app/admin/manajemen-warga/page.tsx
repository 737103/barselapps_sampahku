
"use client";

import { useState } from "react";
import { AllResidentsTable } from "@/components/admin/all-residents-table";
import { citizens, type Citizen } from "@/lib/data";

export default function ManajemenWargaPage() {
  const [allResidents] = useState<Citizen[]>(citizens);

  return (
    <>
      <AllResidentsTable residents={allResidents} />
    </>
  );
}
