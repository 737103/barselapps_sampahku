
export type Citizen = {
  id: string;
  name: string;
  nik: string;
  kk: string;
  address: string;
  rt: string;
  rw: string;
};

export type Payment = {
  id: string;
  citizenId: string;
  period: string; // e.g., "Juni 2024"
  amount: number;
  paymentDate: string;
  proofUrl: string | null;
  status: "Lunas" | "Belum Lunas" | "Tertunda";
  citizen?: Citizen;
  rt: string;
  rw: string;
};

export type Dispute = {
  id: string;
  paymentId: string;
  citizenId: string;
  citizenName: string;
  rt: string;
  rw: string;
  reason: string;
  proofUrl?: string | null;
  submittedDate: string;
  status: "Baru" | "Diproses" | "Selesai" | "Ditolak";
};

export type RTAccount = {
  id: string;
  name: string;
  username: string;
  password?: string; // Should be hashed in a real app
  rt: string;
  rw: string;
  lastLogin: string;
  isDeactivated?: boolean;
};

export type Notification = {
    id: string;
    citizenId: string;
    message: string;
    createdAt: string; 
    isRead: boolean;
    type: 'payment_reminder' | 'general';
    period?: string; // e.g., "Agustus 2024"
}

// Mock data is now replaced by Firestore
export const wargaHistory: Payment[] = [];
