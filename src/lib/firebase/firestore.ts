import { db } from "@/lib/firebase";
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, query, where, getDoc } from "firebase/firestore";
import type { Citizen, RTAccount, Payment } from "../data";
import { format } from "date-fns";
import { id } from "date-fns/locale";

// --- Citizen Functions ---

const citizensCollection = collection(db, "citizens");

export const getAllCitizens = async (): Promise<Citizen[]> => {
    try {
        const snapshot = await getDocs(citizensCollection);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Citizen));
    } catch (error) {
        console.error("Error getting all citizens: ", error);
        return [];
    }
};

export const getCitizensByRT = async (rt: string, rw: string): Promise<Citizen[]> => {
    try {
        const q = query(citizensCollection, where("rt", "==", rt), where("rw", "==", rw));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Citizen));
    } catch (error) {
        console.error(`Error getting citizens for RT/RW ${rt}/${rw}: `, error);
        return [];
    }
}

export const getCitizenById = async (id: string): Promise<Citizen | null> => {
    try {
        const docRef = doc(db, "citizens", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as Citizen;
        }
        return null;
    } catch (error) {
        console.error("Error getting citizen by ID: ", error);
        return null;
    }
}

export const addCitizen = async (citizenData: Omit<Citizen, 'id'>): Promise<Citizen | null> => {
    try {
        const docRef = await addDoc(citizensCollection, citizenData);
        return { id: docRef.id, ...citizenData };
    } catch (error) {
        console.error("Error adding citizen: ", error);
        return null;
    }
}

export const updateCitizen = async (id: string, citizenData: Partial<Citizen>): Promise<boolean> => {
    try {
        const docRef = doc(db, "citizens", id);
        await updateDoc(docRef, citizenData);
        return true;
    } catch (error) {
        console.error("Error updating citizen: ", error);
        return false;
    }
}

export const deleteCitizen = async (id: string): Promise<boolean> => {
    try {
        const docRef = doc(db, "citizens", id);
        await deleteDoc(docRef);
        return true;
    } catch (error) {
        console.error("Error deleting citizen: ", error);
        return false;
    }
}


// --- RT Account Functions ---

const rtAccountsCollection = collection(db, "rt_accounts");

export const getRTAccounts = async (): Promise<RTAccount[]> => {
    try {
        const snapshot = await getDocs(rtAccountsCollection);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as RTAccount));
    } catch (error) {
        console.error("Error getting RT accounts: ", error);
        return [];
    }
};

export const addRTAccount = async (accountData: Omit<RTAccount, 'id' | 'lastLogin'>): Promise<RTAccount | null> => {
    try {
        const newAccountData = { ...accountData, lastLogin: format(new Date(), "yyyy-MM-dd HH:mm:ss") };
        const docRef = await addDoc(rtAccountsCollection, newAccountData);
        return { id: docRef.id, ...newAccountData };
    } catch (error) {
        console.error("Error adding RT account: ", error);
        return null;
    }
}

export const updateRTAccountUsername = async (id: string, newUsername: string): Promise<boolean> => {
    try {
        const docRef = doc(db, "rt_accounts", id);
        await updateDoc(docRef, { username: newUsername });
        return true;
    } catch (error) {
        console.error("Error updating RT account username: ", error);
        return false;
    }
}

export const deleteRTAccount = async (id: string): Promise<boolean> => {
    try {
        const docRef = doc(db, "rt_accounts", id);
        await deleteDoc(docRef);
        return true;
    } catch (error) {
        console.error("Error deleting RT account: ", error);
        return false;
    }
}

// --- Payment Functions ---
const paymentsCollection = collection(db, "payments");

export const getPaymentsForCitizen = async (citizenId: string): Promise<Payment[]> => {
    try {
        const q = query(paymentsCollection, where("citizenId", "==", citizenId));
        const snapshot = await getDocs(q);
        const citizen = await getCitizenById(citizenId);
        if (!citizen) return [];

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            citizen: citizen
        } as Payment));

    } catch (error) {
        console.error(`Error getting payments for citizen ${citizenId}: `, error);
        return [];
    }
};

export const recordPayment = async (citizenId: string, paymentData: Omit<Payment, 'id' | 'citizenId' | 'status' | 'proofUrl' | 'citizen'>): Promise<Payment | null> => {
    try {
        const citizen = await getCitizenById(citizenId);
        if (!citizen) throw new Error("Citizen not found");

        const newPaymentData = {
            ...paymentData,
            citizenId: citizenId,
            status: "Lunas" as const,
            proofUrl: "https://placehold.co/400x400.png", // placeholder
        };

        const docRef = await addDoc(paymentsCollection, newPaymentData);
        
        return {
            id: docRef.id,
            ...newPaymentData,
            citizen: citizen,
        };

    } catch (error) {
        console.error("Error recording payment: ", error);
        return null;
    }
}
