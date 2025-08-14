
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

export const citizens: Citizen[] = [
  { id: "c1", name: "Budi Santoso", nik: "3201012345670001", kk: "3201012345670001", address: "Jl. Merdeka No. 1", rt: "001", rw: "001" },
  { id: "c2", name: "Siti Aminah", nik: "3201012345670002", kk: "3201012345670002", address: "Jl. Merdeka No. 2", rt: "001", rw: "001" },
  { id: "c3", name: "Ahmad Dahlan", nik: "3201012345670003", kk: "3201012345670003", address: "Jl. Pahlawan No. 5", rt: "002", rw: "001" },
  { id: "c4", name: "Dewi Lestari", nik: "3201012345670004", kk: "3201012345670004", address: "Jl. Pahlawan No. 6", rt: "002", rw: "001" },
  { id: "c5", name: "Eko Prasetyo", nik: "3201012345670005", kk: "3201012345670005", address: "Jl. Kemerdekaan No. 10", rt: "001", rw: "002" },
];

export const payments: Payment[] = [
  { id: "p1", citizenId: "c1", period: "Mei 2024", amount: 25000, paymentDate: "2024-05-04", proofUrl: "https://placehold.co/400x400.png", status: "Lunas", citizen: citizens.find(c => c.id === 'c1')! },
  { id: "p2", citizenId: "c2", period: "Juni 2024", amount: 25000, paymentDate: "2024-06-08", proofUrl: "https://placehold.co/400x400.png", status: "Lunas", citizen: citizens.find(c => c.id === 'c2')! },
  { id: "p3", citizenId: "c3", period: "Juni 2024", amount: 25000, paymentDate: "", proofUrl: "", status: "Belum Lunas", citizen: citizens.find(c => c.id === 'c3')! },
  { id: "p4", citizenId: "c4", period: "Juni 2024", amount: 25000, paymentDate: "2024-06-10", proofUrl: "https://placehold.co/400x400.png", status: "Lunas", citizen: citizens.find(c => c.id === 'c4')! },
  { id: "p5", citizenId: "c1", period: "Juni 2024", amount: 25000, paymentDate: "2024-06-05", proofUrl: "https://placehold.co/400x400.png", status: "Lunas", citizen: citizens.find(c => c.id === 'c1')! },
  { id: "p6", citizenId: "c1", period: "April 2024", amount: 25000, paymentDate: "2024-04-05", proofUrl: "https://placehold.co/400x400.png", status: "Lunas", citizen: citizens.find(c => c.id === 'c1')! },
  { id: "p7", citizenId: "c2", period: "Mei 2024", amount: 25000, paymentDate: "2024-05-08", proofUrl: "https://placehold.co/400x400.png", status: "Lunas", citizen: citizens.find(c => c.id === 'c2')! },
  { id: "p8", citizenId: "c3", period: "Mei 2024", amount: 25000, paymentDate: "2024-05-10", proofUrl: "https://placehold.co/400x400.png", status: "Lunas", citizen: citizens.find(c => c.id === 'c3')! },
  { id: "p9", citizenId: "c4", period: "Mei 2024", amount: 25000, paymentDate: "2024-05-11", proofUrl: "https://placehold.co/400x400.png", status: "Lunas", citizen: citizens.find(c => c.id === 'c4')! },
];

export const disputes: Dispute[] = [
  { id: "d1", paymentId: "p5", citizenName: "Budi Santoso", rt: "001", rw: "001", reason: "Saya sudah bayar tapi status masih belum lunas.", submittedDate: "2024-06-10", status: "Baru" },
  { id: "d2", paymentId: "p2", citizenName: "Siti Aminah", rt: "001", rw: "001", reason: "Jumlah pembayaran yang tercatat salah.", submittedDate: "2024-06-11", status: "Diproses" },
];

export const rtAccounts: RTAccount[] = [
  { id: "rt1", username: "rt001_rw001", rt: "001", rw: "001", lastLogin: "2024-06-12 10:00:00" },
  { id: "rt2", username: "rt002_rw001", rt: "002", rw: "001", lastLogin: "2024-06-11 15:30:00" },
  { id: "rt3", username: "rt001_rw002", rt: "001", rw: "002", lastLogin: "2024-06-10 08:00:00" },
];

export const rtResidents = citizens.filter(c => c.rt === '001' && c.rw === '001');

export const wargaHistory = payments.filter(p => p.citizenId === 'c1');
