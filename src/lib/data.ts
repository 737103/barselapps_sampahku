
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
  proofUrl: string;
  status: "Lunas" | "Belum Lunas" | "Tertunda";
  citizen: Citizen;
};

export type Dispute = {
  id: string;
  paymentId: string;
  citizenName: string;
  rt: string;
  rw: string;
  reason: string;
  submittedDate: string;
  status: "Baru" | "Diproses" | "Selesai" | "Ditolak";
};

export type RTAccount = {
  id: string;
  username: string;
  rt: string;
  rw: string;
  lastLogin: string;
};

const placeholderCitizen: Citizen = {
  id: "c-placeholder",
  name: "Loading...",
  nik: "...",
  kk: "...",
  address: "...",
  rt: "...",
  rw: "..."
};

// Mock data is now replaced by Firestore
export const citizens: Citizen[] = [];
export const payments: Payment[] = [
  { id: "p1", citizenId: "c1", period: "Mei 2024", amount: 25000, paymentDate: "2024-05-04", proofUrl: "https://placehold.co/400x400.png", status: "Lunas", citizen: placeholderCitizen },
  { id: "p2", citizenId: "c2", period: "Juni 2024", amount: 25000, paymentDate: "2024-06-08", proofUrl: "https://placehold.co/400x400.png", status: "Lunas", citizen: placeholderCitizen },
];
export const disputes: Dispute[] = [
    { id: "d1", paymentId: "p5", citizenName: "Budi Santoso", rt: "001", rw: "001", reason: "Saya sudah bayar tapi status masih belum lunas.", submittedDate: "2024-06-10", status: "Baru" },
    { id: "d2", paymentId: "p2", citizenName: "Siti Aminah", rt: "001", rw: "001", reason: "Jumlah pembayaran yang tercatat salah.", submittedDate: "2024-06-11", status: "Diproses" },
];
export const rtAccounts: RTAccount[] = [];

// Data for current logged in user (can be replaced with actual auth)
export const rtResidents = citizens.filter(c => c.rt === '001' && c.rw === '001');
export const wargaHistory = payments.filter(p => p.citizenId === 'c1');
