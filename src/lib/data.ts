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
};

export type Dispute = {
  id: string;
  paymentId: string;
  citizenName: string;
  rt: string;
  rw: string;
  reason: string;
  submittedDate: string;
  status: "Baru" | "Diproses" | "Selesai";
};

export const citizens: Citizen[] = [
  { id: "c1", name: "Budi Santoso", nik: "3201012345670001", kk: "3201012345670001", address: "Jl. Merdeka No. 1", rt: "001", rw: "001" },
  { id: "c2", name: "Siti Aminah", nik: "3201012345670002", kk: "3201012345670002", address: "Jl. Merdeka No. 2", rt: "001", rw: "001" },
  { id: "c3", name: "Ahmad Dahlan", nik: "3201012345670003", kk: "3201012345670003", address: "Jl. Pahlawan No. 5", rt: "002", rw: "001" },
  { id: "c4", name: "Dewi Lestari", nik: "3201012345670004", kk: "3201012345670004", address: "Jl. Pahlawan No. 6", rt: "002", rw: "001" },
  { id: "c5", name: "Eko Prasetyo", nik: "3201012345670005", kk: "3201012345670005", address: "Jl. Kemerdekaan No. 10", rt: "001", rw: "002" },
];

export const payments: (Payment & { citizen: Citizen })[] = [
  { id: "p1", citizenId: "c1", period: "Juni 2024", amount: 25000, paymentDate: "2024-06-05", proofUrl: "https://placehold.co/400x400.png", status: "Lunas", citizen: citizens[0] },
  { id: "p2", citizenId: "c1", period: "Mei 2024", amount: 25000, paymentDate: "2024-05-04", proofUrl: "https://placehold.co/400x400.png", status: "Lunas", citizen: citizens[0] },
  { id: "p3", citizenId: "c2", period: "Juni 2024", amount: 25000, paymentDate: "2024-06-08", proofUrl: "https://placehold.co/400x400.png", status: "Lunas", citizen: citizens[1] },
  { id: "p4", citizenId: "c3", period: "Juni 2024", amount: 25000, paymentDate: "", proofUrl: "", status: "Belum Lunas", citizen: citizens[2] },
  { id: "p5", citizenId: "c4", period: "Juni 2024", amount: 25000, paymentDate: "2024-06-10", proofUrl: "https://placehold.co/400x400.png", status: "Lunas", citizen: citizens[3] },
];

export const disputes: Dispute[] = [
  { id: "d1", paymentId: "p1", citizenName: "Budi Santoso", rt: "001", rw: "001", reason: "Saya sudah bayar tapi status masih belum lunas.", submittedDate: "2024-06-10", status: "Baru" },
  { id: "d2", paymentId: "p3", citizenName: "Siti Aminah", rt: "001", rw: "001", reason: "Jumlah pembayaran yang tercatat salah.", submittedDate: "2024-06-11", status: "Diproses" },
];

export const rtResidents = citizens.filter(c => c.rt === '001' && c.rw === '001');

export const wargaHistory = payments.filter(p => p.citizenId === 'c1');
