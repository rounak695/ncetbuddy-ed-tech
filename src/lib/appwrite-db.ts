import { databases, isAppwriteConfigured } from "./appwrite";
import { ID, Query } from "appwrite";
import { Test, Book, FormulaCard, Notification, PYQ, SiteSettings, UserProfile, TestResult, VideoClass } from "@/types";

const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'ncet-buddy-db';

// --- Tests ---
export const getTests = async (): Promise<Test[]> => {
    if (!isAppwriteConfigured()) return [];
    try {
        const response = await databases.listDocuments(DB_ID, 'tests', [
            Query.orderDesc('createdAt')
        ]);
        return response.documents.map(doc => {
            let questions = doc.questions;
            try {
                while (typeof questions === 'string') {
                    questions = JSON.parse(questions);
                }
            } catch (e) {
                console.error("Error parsing questions for test:", doc.$id, e);
                questions = [];
            }
            return {
                id: doc.$id,
                ...doc,
                questions: Array.isArray(questions) ? questions : []
            };
        }) as unknown as Test[];
    } catch (error) {
        console.error("Error fetching tests:", error);
        return [];
    }
};

export const getTestById = async (id: string): Promise<Test | null> => {
    if (!isAppwriteConfigured()) return null;
    try {
        const doc = await databases.getDocument(
            DB_ID,
            'tests',
            id
        );
        let questions = doc.questions;
        try {
            while (typeof questions === 'string') {
                questions = JSON.parse(questions);
            }
        } catch (e) {
            console.error("Error parsing questions for test:", doc.$id, e);
            questions = [];
        }
        return {
            id: doc.$id,
            ...doc,
            questions: Array.isArray(questions) ? questions : []
        } as unknown as Test;
    } catch (error) {
        console.error("Error fetching test:", error);
        return null;
    }
};

export const createTest = async (test: Omit<Test, "id">): Promise<string | null> => {
    if (!isAppwriteConfigured()) return null;
    try {
        const response = await databases.createDocument(DB_ID, 'tests', ID.unique(), {
            ...test,
            questions: JSON.stringify(test.questions),
            createdAt: Math.floor(Date.now() / 1000)
        });
        return response.$id;
    } catch (error) {
        console.error("Error creating test:", error);
        return null;
    }
};

export const deleteTest = async (testId: string): Promise<boolean> => {
    try {
        await databases.deleteDocument(DB_ID, 'tests', testId);
        return true;
    } catch (error) {
        console.error("Error deleting test:", error);
        return false;
    }
};

export const saveTestResult = async (result: any) => {
    try {
        // 1. Save the individual test result
        const { correctCount, incorrectCount, ...dataToSave } = result; // Omit these two fields
        await databases.createDocument(
            DB_ID,
            'test-results',
            ID.unique(),
            {
                ...dataToSave,
                answers: JSON.stringify(dataToSave.answers)
            }
        );

        // 2. Update User Profile (Total Score & Tests Attempted)
        // DISABLED: These fields don't exist in the Appwrite users collection schema
        // If you want to track user stats, add 'totalScore' and 'testsAttempted' attributes to the users collection
        /*
        try {
            const userDoc = await databases.getDocument(DB_ID, 'users', result.userId);

            if (userDoc) {
                const currentScore = userDoc.totalScore || 0;
                const currentTests = userDoc.testsAttempted || 0;

                await databases.updateDocument(DB_ID, 'users', userDoc.$id, {
                    totalScore: Number(currentScore || 0) + Number(result.score || 0),
                    testsAttempted: Number(currentTests || 0) + 1
                });
            }
        } catch (profileError) {
            console.error("Failed to update user profile stats:", profileError);
        }
        */

    } catch (error) {
        console.error("Error saving test result:", error);
        throw error;
    }
};

export const getLeaderboard = async (limit: number = 10): Promise<UserProfile[]> => {
    if (!isAppwriteConfigured()) return [];
    try {
        const response = await databases.listDocuments(DB_ID, 'users', [
            Query.orderDesc('totalScore'),
            Query.limit(limit)
        ]);
        return response.documents.map(doc => ({ uid: doc.$id, ...doc })) as unknown as UserProfile[];
    } catch (error) {
        console.error("Error fetching leaderboard:", error);
        return [];
    }
};

export const getUserTestResults = async (userId: string): Promise<TestResult[]> => {
    if (!isAppwriteConfigured()) return [];
    try {
        const response = await databases.listDocuments(DB_ID, 'test-results', [
            Query.equal('userId', userId),
            Query.orderDesc('completedAt')
        ]);
        return response.documents.map(doc => ({
            id: doc.$id,
            ...doc,
            answers: typeof doc.answers === 'string' ? JSON.parse(doc.answers) : doc.answers
        })) as unknown as TestResult[];
    } catch (error) {
        console.error("Error fetching user test results:", error);
        return [];
    }
};

// --- Books / Notes ---
export const getBooks = async (): Promise<Book[]> => {
    if (!isAppwriteConfigured()) return [];
    try {
        const response = await databases.listDocuments(DB_ID, 'books', [
            Query.orderDesc('createdAt')
        ]);
        return response.documents.map(doc => ({ id: doc.$id, ...doc })) as unknown as Book[];
    } catch (error) {
        console.error("Error fetching books:", error);
        return [];
    }
};

export const createBook = async (book: Omit<Book, "id">) => {
    try {
        await databases.createDocument(DB_ID, 'books', ID.unique(), book);
    } catch (error) {
        console.error("Error creating book:", error);
        throw error;
    }
};

export const deleteBook = async (id: string) => {
    try {
        await databases.deleteDocument(DB_ID, 'books', id);
    } catch (error) {
        console.error("Error deleting book:", error);
        throw error;
    }
};

export const updateBook = async (id: string, data: Partial<Book>) => {
    try {
        await databases.updateDocument(DB_ID, 'books', id, data);
    } catch (error) {
        console.error("Error updating book:", error);
        throw error;
    }
};

// --- Formula Cards ---
export const getFormulaCards = async (): Promise<FormulaCard[]> => {
    if (!isAppwriteConfigured()) return [];
    try {
        const response = await databases.listDocuments(DB_ID, 'formula_cards', [
            Query.orderDesc('createdAt')
        ]);
        return response.documents.map(doc => ({ id: doc.$id, ...doc })) as unknown as FormulaCard[];
    } catch (error) {
        console.error("Error fetching formula cards:", error);
        return [];
    }
};

export const createFormulaCard = async (card: Omit<FormulaCard, "id">) => {
    try {
        await databases.createDocument(DB_ID, 'formula_cards', ID.unique(), card);
    } catch (error) {
        console.error("Error creating formula card:", error);
        throw error;
    }
};

export const deleteFormulaCard = async (id: string) => {
    try {
        await databases.deleteDocument(DB_ID, 'formula_cards', id);
    } catch (error) {
        console.error("Error deleting formula card:", error);
        throw error;
    }
};

export const updateFormulaCard = async (id: string, data: Partial<FormulaCard>) => {
    try {
        await databases.updateDocument(DB_ID, 'formula_cards', id, data);
    } catch (error) {
        console.error("Error updating formula card:", error);
        throw error;
    }
};

// --- PYQs ---
export const getPYQs = async (): Promise<PYQ[]> => {
    if (!isAppwriteConfigured()) return [];
    try {
        const response = await databases.listDocuments(DB_ID, 'pyqs', [
            Query.orderDesc('year')
        ]);
        return response.documents.map(doc => ({ id: doc.$id, ...doc })) as unknown as PYQ[];
    } catch (error) {
        console.error("Error fetching PYQs:", error);
        return [];
    }
};

export const createPYQ = async (pyq: Omit<PYQ, "id">) => {
    try {
        await databases.createDocument(DB_ID, 'pyqs', ID.unique(), pyq);
    } catch (error) {
        console.error("Error creating PYQ:", error);
        throw error;
    }
};

export const deletePYQ = async (id: string) => {
    try {
        await databases.deleteDocument(DB_ID, 'pyqs', id);
    } catch (error) {
        console.error("Error deleting PYQ:", error);
        throw error;
    }
};

// --- Users ---
export const getUsers = async (): Promise<UserProfile[]> => {
    if (!isAppwriteConfigured()) return [];
    try {
        const response = await databases.listDocuments(DB_ID, 'users');
        return response.documents.map(doc => ({ uid: doc.$id, ...doc })) as unknown as UserProfile[];
    } catch (error) {
        console.error("Error fetching users:", error);
        return [];
    }
};

export const updateUser = async (uid: string, data: any) => {
    try {
        await databases.updateDocument(DB_ID, 'users', uid, data);
    } catch (error) {
        console.error("Error updating user:", error);
        throw error;
    }
};

// --- Notifications ---
export const getNotifications = async (): Promise<Notification[]> => {
    if (!isAppwriteConfigured()) return [];
    try {
        const response = await databases.listDocuments(DB_ID, 'notifications', [
            Query.orderDesc('createdAt')
        ]);
        return response.documents.map(doc => ({ id: doc.$id, ...doc })) as unknown as Notification[];
    } catch (error) {
        console.error("Error fetching notifications:", error);
        return [];
    }
};

export const createNotification = async (notification: Omit<Notification, "id">) => {
    try {
        await databases.createDocument(DB_ID, 'notifications', ID.unique(), notification);
    } catch (error) {
        console.error("Error creating notification:", error);
        throw error;
    }
};

// --- Settings ---
export const getSettings = async (): Promise<SiteSettings | null> => {
    if (!isAppwriteConfigured()) return null;
    try {
        const doc = await databases.getDocument(
            DB_ID,
            'settings',
            'global'
        );
        return doc as unknown as SiteSettings;
    } catch (error) {
        return null;
    }
};

export const saveSettings = async (settings: SiteSettings) => {
    try {
        try {
            await databases.updateDocument(
                DB_ID,
                'settings',
                'global',
                settings as any
            );
        } catch (e) {
            await databases.createDocument(
                DB_ID,
                'settings',
                'global',
                settings as any
            );
        }
    } catch (error) {
        console.error("Error saving settings:", error);
        throw error;
    }
};

// --- Video Classes ---
export const getVideoClasses = async (): Promise<VideoClass[]> => {
    if (!isAppwriteConfigured()) return [];
    try {
        const response = await databases.listDocuments(DB_ID, 'videos', [
            Query.orderDesc('createdAt')
        ]);
        return response.documents.map(doc => ({ id: doc.$id, ...doc })) as unknown as VideoClass[];
    } catch (error) {
        console.error("Error fetching video classes:", error);
        return [];
    }
};

export const createVideoClass = async (video: Omit<VideoClass, "id">) => {
    try {
        await databases.createDocument(DB_ID, 'videos', ID.unique(), video);
    } catch (error) {
        console.error("Error creating video class:", error);
        throw error;
    }
};

export const deleteVideoClass = async (videoId: string) => {
    try {
        await databases.deleteDocument(DB_ID, 'videos', videoId);
    } catch (error) {
        console.error("Error deleting video class:", error);
        throw error;
    }
};
