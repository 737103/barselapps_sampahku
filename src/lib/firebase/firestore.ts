import { db } from "@/lib/firebase";
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, query, where, getDoc, serverTimestamp, writeBatch } from "firebase/firestore";
import type { Citizen, RTAccount, Payment, Dispute, Notification } from "../data";
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

export const getCitizenByNIK = async (nik: string): Promise<Citizen | null> => {
    try {
        const q = query(citizensCollection, where("nik", "==", nik));
        const snapshot = await getDocs(q);
        if (snapshot.empty) {
            return null;
        }
        const docSnap = snapshot.docs[0];
        return { id: docSnap.id, ...docSnap.data() } as Citizen;
    } catch (error) {
        console.error("Error getting citizen by NIK: ", error);
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

export const authenticateRT = async (username: string, password: string): Promise<RTAccount | null> => {
    try {
        const q = query(rtAccountsCollection, where("username", "==", username));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            console.log("No matching user found");
            return null;
        }

        const userDoc = snapshot.docs[0];
        const userData = userDoc.data() as RTAccount;

        // Check if account is deactivated
        if (userData.isDeactivated) {
            console.log("Account is deactivated");
            return null;
        }

        // In a real app, you'd compare a hashed password.
        // For this prototype, we'll compare plaintext.
        if (userData.password === password) {
            // Update last login timestamp
            const updatedUserData = { ...userData, lastLogin: format(new Date(), "yyyy-MM-dd HH:mm:ss") };
            await updateDoc(userDoc.ref, { lastLogin: updatedUserData.lastLogin });
            return { id: userDoc.id, ...updatedUserData };
        } else {
            console.log("Password does not match");
            return null;
        }
    } catch (error) {
        console.error("Error authenticating RT user: ", error);
        return null;
    }
};

export const getRTAccounts = async (): Promise<RTAccount[]> => {
    try {
        const snapshot = await getDocs(rtAccountsCollection);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as RTAccount));
    } catch (error) {
        console.error("Error getting RT accounts: ", error);
        return [];
    }
};

export const getRTAccountById = async (id: string): Promise<RTAccount | null> => {
    try {
        const docRef = doc(db, "rt_accounts", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as RTAccount;
        }
        return null;
    } catch (error) {
        console.error("Error getting RT account by ID: ", error);
        return null;
    }
}

export const addRTAccount = async (accountData: Omit<RTAccount, 'id' | 'lastLogin'>): Promise<RTAccount | null> => {
    try {
        const newAccountData = { ...accountData, lastLogin: "Belum pernah login", isDeactivated: false };
        const docRef = await addDoc(rtAccountsCollection, newAccountData);
        return { id: docRef.id, ...newAccountData };
    } catch (error) {
        console.error("Error adding RT account: ", error);
        return null;
    }
}

export const updateRTAccount = async (id: string, data: Partial<RTAccount>): Promise<boolean> => {
    try {
        const docRef = doc(db, "rt_accounts", id);
        await updateDoc(docRef, data);
        return true;
    } catch (error) {
        console.error("Error updating RT account: ", error);
        return false;
    }
}

export const updateRTAccountUsername = async (id: string, newUsername: string): Promise<boolean> => {
    return updateRTAccount(id, { username: newUsername });
}

export const updateRTAccountPassword = async (id: string, newPassword: string): Promise<boolean> => {
    return updateRTAccount(id, { password: newPassword });
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

export const getPaymentById = async(id: string): Promise<Payment | null> => {
    try {
        const docRef = doc(db, "payments", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const paymentData = docSnap.data() as Payment;
            const citizen = await getCitizenById(paymentData.citizenId);
            return { id: docSnap.id, ...paymentData, citizen };
        }
        return null;
    } catch (error) {
        console.error("Error getting payment by ID: ", error);
        return null;
    }
}

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

        // Add payment document
        const docRef = await addDoc(paymentsCollection, newPaymentData);

        // Mark relevant payment reminder notifications as read
        const notificationsQuery = query(
            notificationsCollection, 
            where("citizenId", "==", citizenId),
            where("type", "==", "payment_reminder"),
            where("period", "==", paymentData.period),
            where("isRead", "==", false)
        );
        const notificationsSnapshot = await getDocs(notificationsQuery);
        if (!notificationsSnapshot.empty) {
            const batch = writeBatch(db);
            notificationsSnapshot.docs.forEach(notificationDoc => {
                batch.update(notificationDoc.ref, { isRead: true });
            });
            await batch.commit();
            console.log(`Marked ${notificationsSnapshot.size} notifications as read for citizen ${citizenId} for period ${paymentData.period}`);
        }
        
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

// --- Dispute Functions ---
const disputesCollection = collection(db, "disputes");

export const addDispute = async (disputeData: Omit<Dispute, 'id' | 'submittedDate' | 'status'>): Promise<Dispute | null> => {
    try {
        const newDisputeData = {
            ...disputeData,
            submittedDate: format(new Date(), "yyyy-MM-dd"),
            status: "Baru" as const,
        };
        const docRef = await addDoc(disputesCollection, newDisputeData);
        return { id: docRef.id, ...newDisputeData };
    } catch (error) {
        console.error("Error adding dispute: ", error);
        return null;
    }
};

export const getAllDisputes = async (): Promise<Dispute[]> => {
    try {
        const snapshot = await getDocs(disputesCollection);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Dispute));
    } catch (error) {
        console.error("Error getting all disputes: ", error);
        return [];
    }
}

export const getDisputesForCitizen = async (citizenId: string): Promise<Dispute[]> => {
    try {
        const q = query(disputesCollection, where("citizenId", "==", citizenId));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Dispute));
    } catch (error) {
        console.error(`Error getting disputes for citizen ${citizenId}: `, error);
        return [];
    }
};

export const updateDisputeStatus = async (id: string, status: Dispute['status']): Promise<boolean> => {
    try {
        const docRef = doc(db, "disputes", id);
        await updateDoc(docRef, { status });
        return true;
    } catch (error) {
        console.error("Error updating dispute status: ", error);
        return false;
    }
}

// --- Admin Account Functions ---
const adminsCollection = collection(db, "admins");
const ADMIN_DOC_ID = "main_admin"; // Hardcoded ID for the single admin document

export const authenticateAdmin = async (username: string, password: string):Promise<{username: string} | null> => {
    try {
        const docRef = doc(db, "admins", ADMIN_DOC_ID);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            console.log("Admin document not found. Please create it in Firestore.");
            // Optional: Create a default admin if it doesn't exist
            // await setDoc(docRef, { username: "admin", password: "admin" });
            // return { username: "admin" };
            return null;
        }

        const adminData = docSnap.data();

        if (adminData.username === username && adminData.password === password) {
            return { username: adminData.username };
        }

        return null;
    } catch (error) {
        console.error("Error authenticating admin: ", error);
        return null;
    }
}

export const getAdminAccount = async (): Promise<{username: string} | null> => {
    try {
        const docRef = doc(db, "admins", ADMIN_DOC_ID);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return { username: docSnap.data().username };
        }
        return null;
    } catch (error) {
        console.error("Error getting admin account: ", error);
        return null;
    }
}

export const updateAdminUsername = async (newUsername: string): Promise<boolean> => {
    try {
        const docRef = doc(db, "admins", ADMIN_DOC_ID);
        await updateDoc(docRef, { username: newUsername });
        return true;
    } catch (error) {
        console.error("Error updating admin username: ", error);
        return false;
    }
};

export const updateAdminPassword = async (newPassword: string): Promise<boolean> => {
    try {
        const docRef = doc(db, "admins", ADMIN_DOC_ID);
        await updateDoc(docRef, { password: newPassword });
        return true;
    } catch (error) {
        console.error("Error updating admin password: ", error);
        return false;
    }
};

// --- Notification Functions ---
const notificationsCollection = collection(db, "notifications");

export const createNotification = async (notificationData: Omit<Notification, 'id' | 'createdAt' | 'isRead'>): Promise<Notification | null> => {
    try {
        const newNotificationData = {
            ...notificationData,
            createdAt: new Date().toISOString(),
            isRead: false,
        };
        const docRef = await addDoc(notificationsCollection, newNotificationData);
        return { id: docRef.id, ...newNotificationData };
    } catch (error) {
        console.error("Error creating notification: ", error);
        return null;
    }
};

export const getNotificationsForCitizen = async (citizenId: string): Promise<Notification[]> => {
    try {
        const q = query(notificationsCollection, where("citizenId", "==", citizenId), where("isRead", "==", false));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Notification));
    } catch (error) {
        console.error(`Error getting notifications for citizen ${citizenId}: `, error);
        return [];
    }
};

export const markNotificationAsRead = async (notificationId: string): Promise<boolean> => {
    try {
        const docRef = doc(db, "notifications", notificationId);
        await updateDoc(docRef, { isRead: true });
        return true;
    } catch (error) {
        console.error("Error marking notification as read: ", error);
        return false;
    }
}
