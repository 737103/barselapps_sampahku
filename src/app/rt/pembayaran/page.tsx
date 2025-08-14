
"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { ResidentsTable } from "@/components/rt/residents-table";
import { type Citizen, type RTAccount } from "@/lib/data";
import { getCitizensByRT, getRTAccountById } from "@/lib/firebase/firestore";

export default function PembayaranPage() {
  const [residents, setResidents] = useState<Citizen[]>([]);
  const [loading, setLoading] = useState(true);
  const [rtAccount, setRtAccount] = useState<RTAccount | null>(null);
  const searchParams = useSearchParams();
  const accountId = searchParams.get('accountId');

  useEffect(() => {
    const fetchAccountAndCitizens = async () => {
      if (accountId) {
        setLoading(true);
        const account = await getRTAccountById(accountId);
        setRtAccount(account);
        if (account) {
          const fetchedCitizens = await getCitizensByRT(account.rt, account.rw);
          setResidents(fetchedCitizens);
        }
        setLoading(false);
      }
    };
    fetchAccountAndCitizens();
  }, [accountId]);
  
  return (
    <>
       <ResidentsTable 
         residents={residents} 
         setResidents={setResidents} 
         loading={loading}
         rtAccount={rtAccount}
       />
    </>
  );
}
