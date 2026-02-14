import { databases, storage, isAppwriteConfigured } from "./appwrite-student";
import { ID, Query, Models } from "appwrite";
import { Test, Book, FormulaCard, Notification, PYQ, SiteSettings, UserProfile, TestResult, VideoClass, Educator, VideoProgress, Purchase, EducatorVideo, EducatorStats, UserEvent, UserAnalytics, TestRankEntry, TestPerformanceSummary, QuestionAnalysis, AdminTestAnalytics } from "@/types";

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
            createdAt: Math.floor(Date.now() / 1000),
            isVisible: test.isVisible !== undefined ? test.isVisible : true // Default to visible
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

export const updateTest = async (testId: string, data: Partial<Test>): Promise<boolean> => {
    try {
        const { id, ...updateData } = data; // Remove ID from payload if present
        await databases.updateDocument(DB_ID, 'tests', testId, updateData);
        return true;
    } catch (error) {
        console.error("Error updating test:", error);
        return false;
    }
};

export const saveTestResult = async (result: Partial<TestResult> & { correctCount?: number, incorrectCount?: number }) => {
    try {
        // 1. Save the individual test result
        const { correctCount, incorrectCount, ...dataToSave } = result; // Omit these two fields
        const docData: any = {
            ...dataToSave,
            answers: JSON.stringify(dataToSave.answers)
        };
        // Add timeTaken if provided
        if (dataToSave.timeTaken !== undefined) {
            docData.timeTaken = dataToSave.timeTaken;
        }
        // Add questionTimes if provided (stored as JSON string)
        if (dataToSave.questionTimes) {
            docData.questionTimes = JSON.stringify(dataToSave.questionTimes);
        }
        await databases.createDocument(
            DB_ID,
            'test-results',
            ID.unique(),
            docData
        );
        // Note: We are no longer updating the 'users' collection here because the 
        // attributes 'totalScore' and 'testsAttempted' might be missing from the schema.
        // The getLeaderboard function now calculates these values dynamically.
    } catch (error) {
        console.error("Error saving test result:", error);
        throw error;
    }
};

export const getLeaderboard = async (limit: number = 10): Promise<UserProfile[]> => {
    if (!isAppwriteConfigured()) return [];
    try {
        // 1. Fetch all users (needed for names)
        // We fetch a larger limit to ensure we cover the active user base
        const usersResponse = await databases.listDocuments(DB_ID, 'users', [
            Query.limit(100)
        ]);
        const users = usersResponse.documents.map(doc => ({ uid: doc.$id, ...doc })) as unknown as UserProfile[];

        // 2. Fetch all test results
        // We fetch a large number to ensure we have the full history for accurate scoring
        const resultsResponse = await databases.listDocuments(DB_ID, 'test-results', [
            Query.limit(5000),
            Query.select(['userId', 'score']) // Optimize fetch to only needed fields if possible
        ]);

        // 3. Aggregate scores in memory
        const userStats = new Map<string, { totalScore: number, testsAttempted: number }>();

        resultsResponse.documents.forEach((doc: any) => {
            const uid = doc.userId;
            const current = userStats.get(uid) || { totalScore: 0, testsAttempted: 0 };
            userStats.set(uid, {
                totalScore: current.totalScore + (Number(doc.score) || 0),
                testsAttempted: current.testsAttempted + 1
            });
        });

        // 4. Merge stats into users and sort
        const leaderboard = users.map(user => {
            const stats = userStats.get(user.uid) || { totalScore: 0, testsAttempted: 0 };
            return {
                ...user,
                totalScore: stats.totalScore,
                testsAttempted: stats.testsAttempted
            };
        });

        // 5. Sort by Total Score (Descending)
        leaderboard.sort((a, b) => (b.totalScore || 0) - (a.totalScore || 0));

        // 6. Return top N
        return leaderboard.slice(0, limit);

    } catch (error) {
        console.error("Error fetching leaderboard:", error);
        return [];
    }
};

/**
 * Get leaderboard summary for privacy-focused display
 * Returns only the top performer (public) and current user's standing (private)
 * 
 * Percentile Calculation Rule:
 * - Only includes students who have attempted at least 1 test
 * - Percentile = (students with lower score / (total - 1)) * 100
 * - Uses competition ranking (tied scores get same rank)
 */
export const getLeaderboardSummary = async (currentUserId: string): Promise<{
    topPerformer: (UserProfile & { rank: number }) | null;
    userStanding: {
        rank: number;
        totalScore: number;
        testsAttempted: number;
        percentile: number;
        aheadOfPercent: number;
        totalParticipants: number;
        mockTestPerformances: { testId: string; title: string; score: number; obtainedAt: number }[];
        pyqPerformance: { totalScore: number; testsAttempted: number };
    } | null;
    totalParticipants: number;
}> => {
    if (!isAppwriteConfigured()) {
        return { topPerformer: null, userStanding: null, totalParticipants: 0 };
    }

    try {
        // 1. Fetch all users
        const usersResponse = await databases.listDocuments(DB_ID, 'users', [
            Query.limit(100)
        ]);
        const users = usersResponse.documents.map(doc => ({ uid: doc.$id, ...doc })) as unknown as UserProfile[];

        // 2. Fetch all test results
        const resultsResponse = await databases.listDocuments(DB_ID, 'test-results', [
            Query.limit(5000),
            // We need createdAt to show date in test-wise performance
            Query.select(['userId', 'score', 'testId', '$createdAt'])
        ]);

        // 2.1 Fetch all tests to determine type (Mock vs PYQ) and get Titles
        // We fetch only needed fields to optimize
        const testsResponse = await databases.listDocuments(DB_ID, 'tests', [
            Query.limit(1000),
            Query.select(['$id', 'title', 'testType'])
        ]);

        const testMetadata = new Map<string, { title: string, type: 'pyq' | 'educator' | undefined }>();
        testsResponse.documents.forEach((doc: any) => {
            testMetadata.set(doc.$id, { title: doc.title, type: doc.testType });
        });

        // 3. Aggregate scores per user
        interface UserStats {
            totalScore: number;
            testsAttempted: number; // Overall
            mockTests: { testId: string; title: string; score: number; obtainedAt: number }[];
            pyqTotalScore: number;
            pyqAttempts: number;
        }

        const userStats = new Map<string, UserStats>();

        resultsResponse.documents.forEach((doc: any) => {
            const uid = doc.userId;
            const score = Number(doc.score) || 0;
            const testId = doc.testId;
            const createdAt = new Date(doc.$createdAt).getTime(); // Timestamp

            const meta = testMetadata.get(testId);
            const isPyq = meta?.type === 'pyq';
            const testTitle = meta?.title || 'Unknown Test';

            const current = userStats.get(uid) || {
                totalScore: 0,
                testsAttempted: 0,
                mockTests: [],
                pyqTotalScore: 0,
                pyqAttempts: 0
            };

            // Update Overall
            current.totalScore += score;
            current.testsAttempted += 1;

            // Update Specifics
            if (isPyq) {
                current.pyqTotalScore += score;
                current.pyqAttempts += 1;
            } else {
                // Assume it's a Mock Test (educator or undefined)
                current.mockTests.push({
                    testId,
                    title: testTitle,
                    score,
                    obtainedAt: createdAt
                });
            }

            userStats.set(uid, current);
        });

        // 4. Build leaderboard with only users who attempted tests
        const leaderboard = users
            .map(user => {
                const stats = userStats.get(user.uid);
                if (!stats || stats.testsAttempted === 0) return null; // Exclude users with 0 attempts

                // Sort mock tests by date desc (most recent first)
                stats.mockTests.sort((a, b) => b.obtainedAt - a.obtainedAt);

                return {
                    ...user,
                    totalScore: stats.totalScore,
                    testsAttempted: stats.testsAttempted,
                    mockTestPerformances: stats.mockTests,
                    pyqPerformance: {
                        totalScore: stats.pyqTotalScore,
                        testsAttempted: stats.pyqAttempts
                    }
                };
            })
            .filter(Boolean) as (UserProfile & {
                totalScore: number;
                testsAttempted: number;
                mockTestPerformances: { testId: string; title: string; score: number; obtainedAt: number }[];
                pyqPerformance: { totalScore: number; testsAttempted: number };
            })[];

        // 5. Sort by total score (descending)
        leaderboard.sort((a, b) => (b.totalScore || 0) - (a.totalScore || 0));

        const totalParticipants = leaderboard.length;

        // 6. Get top performer (rank #1)
        const topPerformer = leaderboard.length > 0
            ? { ...leaderboard[0], rank: 1 }
            : null;

        // 7. Calculate current user's standing
        let userStanding = null;
        const userIndex = leaderboard.findIndex(u => u.uid === currentUserId);

        if (userIndex !== -1) {
            const userProfile = leaderboard[userIndex];
            const rank = userIndex + 1; // 1-based rank

            // Calculate percentile
            // "Ahead of X%" = users with lower score / (total - 1) * 100
            const usersWithLowerScore = leaderboard.filter(u => (u.totalScore || 0) < (userProfile.totalScore || 0)).length;

            let aheadOfPercent = 0;
            if (totalParticipants > 1) {
                aheadOfPercent = Math.floor((usersWithLowerScore / (totalParticipants - 1)) * 100);
            }

            userStanding = {
                rank,
                totalScore: userProfile.totalScore || 0,
                testsAttempted: userProfile.testsAttempted || 0,
                percentile: 100 - aheadOfPercent, // Traditional percentile (higher is better)
                aheadOfPercent, // For display: "ahead of X%"
                totalParticipants,
                mockTestPerformances: userProfile.mockTestPerformances,
                pyqPerformance: userProfile.pyqPerformance
            };
        }

        return {
            topPerformer,
            userStanding,
            totalParticipants
        };

    } catch (error) {
        console.error("Error fetching leaderboard summary:", error);
        return { topPerformer: null, userStanding: null, totalParticipants: 0 };
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

export const updateUser = async (uid: string, data: Partial<UserProfile>) => {
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
        await databases.createDocument(DB_ID, 'videos', ID.unique(), {
            ...video,
            createdAt: video.createdAt || Math.floor(Date.now() / 1000)
        });
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

// --- Educator Video System (New) ---

export const getEducator = async (id: string): Promise<Educator | null> => {
    if (!isAppwriteConfigured()) return null;
    try {
        const doc = await databases.getDocument(DB_ID, 'educators', id);
        return { id: doc.$id, ...doc } as unknown as Educator;
    } catch (error) {
        console.error("Error fetching educator:", error);
        return null;
    }
};

// --- Analytics ---

export const createUserSession = async (userId: string, deviceInfo?: string): Promise<string | null> => {
    if (!isAppwriteConfigured()) return null;
    try {
        const response = await databases.createDocument(DB_ID, 'sessions', ID.unique(), {
            userId,
            startTime: Math.floor(Date.now() / 1000),
            deviceInfo: deviceInfo || 'unknown'
        });
        return response.$id;
    } catch (error) {
        // console.error("Error creating session:", error); // Silent fail for analytics
        return null;
    }
};

export const getAllEducators = async (): Promise<Educator[]> => {
    if (!isAppwriteConfigured()) return [];
    try {
        const response = await databases.listDocuments(DB_ID, 'educators', [
            Query.orderAsc('name')
        ]);
        return response.documents.map(doc => ({ id: doc.$id, ...doc })) as unknown as Educator[];
    } catch (error: any) {
        // Suppress "Collection not found" error to avoid UI toast, just return empty list
        if (error?.code === 404 || error?.message?.includes('not found')) {
            console.warn("Educators collection missing. Please run setup script.");
            return [];
        }
        console.error("Error fetching all educators:", error);
        return [];
    }
};

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
    if (!isAppwriteConfigured()) return null;
    try {
        // First try 'user_profiles' (preferred)
        try {
            const doc = await databases.getDocument(DB_ID, 'user_profiles', userId);
            return { uid: doc.$id, ...doc } as unknown as UserProfile;
        } catch (e) {
            // Fallback to 'users' if legacy or not migrated
            const doc = await databases.getDocument(DB_ID, 'users', userId);
            return { uid: doc.$id, ...doc } as unknown as UserProfile;
        }
    } catch (error) {
        console.error("Error fetching user profile:", error);
        return null;
    }
};

export const getVideoProgress = async (studentId: string, educatorId: string): Promise<VideoProgress[]> => {
    if (!isAppwriteConfigured()) return [];
    try {
        const response = await databases.listDocuments(DB_ID, 'video_progress', [
            Query.equal('studentId', studentId),
            Query.equal('educatorId', educatorId)
        ]);
        return response.documents.map(doc => ({ ...doc })) as unknown as VideoProgress[];
    } catch (error) {
        console.error("Error fetching video progress:", error);
        return [];
    }
};

export const updateVideoProgress = async (studentId: string, educatorId: string, videoId: string, watched: boolean) => {
    if (!isAppwriteConfigured()) return;
    try {
        // Check if exists
        const result = await databases.listDocuments(DB_ID, 'video_progress', [
            Query.equal('studentId', studentId),
            Query.equal('educatorId', educatorId),
            Query.equal('videoId', videoId)
        ]);

        const data = {
            studentId,
            educatorId,
            videoId,
            watched,
            updatedAt: new Date().toISOString() // Using string format as Appwrite handles it
        } as any;

        if (result.documents.length > 0) {
            // Update
            await databases.updateDocument(DB_ID, 'video_progress', result.documents[0].$id, data);
        } else {
            // Create
            await databases.createDocument(DB_ID, 'video_progress', ID.unique(), data);
        }
    } catch (error) {
        console.error("Error updating video progress:", error);
        throw error;
    }
};

export const getFileViewUrl = (bucketId: string, fileId: string) => {
    return storage.getFileView(bucketId, fileId);
};

export const getFileDownloadUrl = (bucketId: string, fileId: string) => {
    return storage.getFileDownload(bucketId, fileId);
};

// --- Purchases (Payment) ---

export const createPurchase = async (purchase: Omit<Purchase, "id" | "createdAt">): Promise<string | null> => {
    if (!isAppwriteConfigured()) return null;
    try {
        const response = await databases.createDocument(DB_ID, 'purchases', ID.unique(), {
            ...purchase,
            createdAt: Math.floor(Date.now() / 1000)
        });
        return response.$id;
    } catch (error) {
        console.error("Error creating purchase record:", error);
        return null;
    }
};

export const updatePurchaseStatus = async (purchaseId: string, status: 'pending' | 'completed' | 'failed', paymentId?: string) => {
    try {
        const data: any = { status };
        if (paymentId) data.paymentId = paymentId;

        await databases.updateDocument(DB_ID, 'purchases', purchaseId, data);
    } catch (error) {
        console.error("Error updating purchase status:", error);
        throw error;
    }
};

export const getPurchaseByPaymentRequestId = async (paymentRequestId: string): Promise<Purchase | null> => {
    if (!isAppwriteConfigured()) return null;
    try {
        const response = await databases.listDocuments(DB_ID, 'purchases', [
            Query.equal('paymentRequestId', paymentRequestId),
            Query.limit(1)
        ]);
        if (response.documents.length === 0) return null;
        return { id: response.documents[0].$id, ...response.documents[0] } as unknown as Purchase;
    } catch (error) {
        console.error("Error fetching purchase by payment request ID:", error);
        return null;
    }
};

export const getUserPurchases = async (userId: string): Promise<Purchase[]> => {
    if (!isAppwriteConfigured()) return [];
    try {
        const response = await databases.listDocuments(DB_ID, 'purchases', [
            Query.equal('userId', userId),
            Query.orderDesc('createdAt')
        ]);
        return response.documents.map(doc => ({ id: doc.$id, ...doc })) as unknown as Purchase[];
    } catch (error) {
        console.error("Error fetching user purchases:", error);
        return [];
    }
};

export const hasUserPurchasedTest = async (userId: string, testId: string): Promise<boolean> => {
    if (!isAppwriteConfigured()) return false;
    try {
        const response = await databases.listDocuments(DB_ID, 'purchases', [
            Query.equal('userId', userId),
            Query.equal('testId', testId),
            Query.equal('status', 'completed')
        ]);
        return response.documents.length > 0;
    } catch (error) {
        console.error("Error checking test purchase:", error);
        return false;
    }
};

// Check if user has made ANY completed purchase (for premium features)
export const hasCompletedAnyPurchase = async (userId: string): Promise<boolean> => {
    if (!isAppwriteConfigured()) return false;
    try {
        const response = await databases.listDocuments(DB_ID, 'purchases', [
            Query.equal('userId', userId),
            Query.equal('status', 'completed'),
            Query.limit(1)
        ]);
        return response.documents.length > 0;
    } catch (error) {
        console.error("Error checking purchases:", error);
        return false;
    }
};


// --- Educator Portal Functions ---

export const getEducatorVideos = async (educatorId: string): Promise<EducatorVideo[]> => {
    if (!isAppwriteConfigured()) return [];
    try {
        const response = await databases.listDocuments(DB_ID, 'educator_videos', [
            Query.equal('educatorId', educatorId),
            Query.orderDesc('createdAt')
        ]);
        return response.documents.map(doc => ({ id: doc.$id, ...doc })) as unknown as EducatorVideo[];
    } catch (error) {
        console.error("Error fetching educator videos:", error);
        return [];
    }
};

export const createEducatorVideo = async (video: Omit<EducatorVideo, "id">) => {
    try {
        await databases.createDocument(DB_ID, 'educator_videos', ID.unique(), video);
    } catch (error) {
        console.error("Error creating educator video:", error);
        throw error;
    }
};

export const deleteEducatorVideo = async (id: string) => {
    try {
        await databases.deleteDocument(DB_ID, 'educator_videos', id);
    } catch (error) {
        console.error("Error deleting educator video:", error);
        throw error;
    }
};

export const getEducatorStats = async (educatorId: string): Promise<EducatorStats> => {
    if (!isAppwriteConfigured()) return { totalRevenue: 0, totalSales: 0, recentSales: [] };

    try {
        // Fetch ALL completed purchases (Simulating single-educator platform for MVP)
        const response = await databases.listDocuments(DB_ID, 'purchases', [
            Query.equal('status', 'completed'),
            Query.orderDesc('createdAt'),
            Query.limit(100)
        ]);

        const purchases = response.documents.map(doc => ({ id: doc.$id, ...doc })) as unknown as Purchase[];
        const totalSales = response.total;
        const totalRevenue = purchases.reduce((sum, p) => sum + (p.amount || 0), 0);

        return {
            totalRevenue,
            totalSales,
            recentSales: purchases.slice(0, 5)
        };
    } catch (error) {
        console.error("Error fetching educator stats:", error);
        return { totalRevenue: 0, totalSales: 0, recentSales: [] };
    }
};

export const endUserSession = async (sessionId: string) => {
    if (!isAppwriteConfigured()) return;
    try {
        const endTime = Math.floor(Date.now() / 1000);
        const session = await databases.getDocument(DB_ID, 'sessions', sessionId);

        const startTime = typeof session.startTime === 'string'
            ? parseInt(session.startTime)
            : (session.startTime || endTime);

        const duration = Math.max(0, endTime - startTime);

        await databases.updateDocument(DB_ID, 'sessions', sessionId, {
            endTime,
            duration
        });

        await updateUserAnalytics(session.userId, {
            lastActive: endTime,
            totalTime: duration,
            sessionCount: 1
        });

    } catch (error) {
        // console.error("Error ending session:", error);
    }
};

export const logUserEvent = async (event: Omit<UserEvent, "$id" | "timestamp">) => {
    if (!isAppwriteConfigured()) return;
    try {
        await databases.createDocument(DB_ID, 'events', ID.unique(), {
            ...event,
            timestamp: Math.floor(Date.now() / 1000)
        });

        const updates: any = { lastActive: Math.floor(Date.now() / 1000) };
        if (event.eventType === 'test_start') {
            updates.testsAttempted = 1;
        }
        // Only update stats for significant events to reduce writes
        if (event.eventType === 'page_visit' || event.eventType === 'test_start') {
            await updateUserAnalytics(event.userId, updates);
        }

    } catch (error) {
        // console.error("Error logging event:", error);
    }
};

const extractNumber = (val: unknown): number => {
    if (typeof val === 'number') return val;
    if (typeof val === 'string') return parseFloat(val) || 0;
    return 0;
}

const calculateEngagement = (totalTime: number, sessions: number): 'High' | 'Medium' | 'Low' => {
    const hours = totalTime / 3600;
    if (hours > 10 || sessions > 50) return 'High';
    if (hours > 2 || sessions > 10) return 'Medium';
    return 'Low';
}

const updateUserAnalytics = async (userId: string, updates: {
    totalTime?: number,
    lastActive?: number,
    sessionCount?: number,
    testsAttempted?: number
}) => {
    try {
        let analyticsDoc: (Models.Document & UserAnalytics) | null = null;
        try {
            const response = await databases.listDocuments(DB_ID, 'user_analytics', [
                Query.equal('userId', userId),
                Query.limit(1)
            ]);
            if (response.documents.length > 0) {
                analyticsDoc = response.documents[0] as unknown as (Models.Document & UserAnalytics);
            }
        } catch (e) {
            // Ignore
        }

        if (analyticsDoc) {
            const currentTotalTime = extractNumber(analyticsDoc.totalTime);
            const currentSessions = extractNumber(analyticsDoc.sessions);
            const currentTests = extractNumber(analyticsDoc.testsAttempted);

            const newTotalTime = currentTotalTime + (updates.totalTime || 0);
            const newSessions = currentSessions + (updates.sessionCount || 0);

            await databases.updateDocument(DB_ID, 'user_analytics', analyticsDoc.$id, {
                totalTime: newTotalTime,
                lastActive: updates.lastActive || analyticsDoc.lastActive,
                sessions: newSessions,
                testsAttempted: currentTests + (updates.testsAttempted || 0),
                engagementLevel: calculateEngagement(newTotalTime, newSessions)
            });
        } else {
            const newTotalTime = updates.totalTime || 0;
            const newSessions = updates.sessionCount || 0;

            await databases.createDocument(DB_ID, 'user_analytics', ID.unique(), {
                userId,
                totalTime: newTotalTime,
                lastActive: updates.lastActive || Math.floor(Date.now() / 1000),
                sessions: newSessions,
                testsAttempted: updates.testsAttempted || 0,
                engagementLevel: calculateEngagement(newTotalTime, newSessions),
                mostUsedFeature: 'General'
            });
        }
    } catch (error) {
        // console.error("Error updating user analytics:", error);
    }
}

export const getAllUserAnalytics = async (): Promise<UserAnalytics[]> => {
    if (!isAppwriteConfigured()) return [];
    try {
        const response = await databases.listDocuments(DB_ID, 'user_analytics', [
            Query.orderDesc('lastActive'),
            Query.limit(100) // Limit to 100 for now
        ]);

        const users = await databases.listDocuments(DB_ID, 'users', [Query.limit(100)]);
        const userMap = new Map(users.documents.map(u => [u.$id, u]));

        return response.documents.map(doc => {
            // Try to merge actual user email/name if needed, or rely on a separate join in UI
            // For now just return analytics data
            return {
                id: doc.$id,
                ...doc,
                totalTime: extractNumber(doc.totalTime),
                lastActive: extractNumber(doc.lastActive),
                sessions: extractNumber(doc.sessions),
                testsAttempted: extractNumber(doc.testsAttempted)
            };
        }) as unknown as UserAnalytics[];
    } catch (error) {
        console.error("Error fetching all analytics", error);
        return [];
    }
}

// Legacy alias for backward compatibility
export type TestLeaderboardEntry = TestRankEntry;

/**
 * Enhanced Test Ranking Engine
 * - Competition ranking (ties get same rank)
 * - Tie-breaking by time taken (less time = better)
 * - Percentile calculation per-test
 * - Only considers users who attempted this specific test
 */
export const getTestLeaderboard = async (testId: string, currentUserId?: string): Promise<{ leaderboard: TestRankEntry[], userRank: TestRankEntry | null }> => {
    if (!isAppwriteConfigured()) return { leaderboard: [], userRank: null };
    try {
        // 1. Fetch ALL test results for this test
        const resultsResponse = await databases.listDocuments(DB_ID, 'test-results', [
            Query.equal('testId', testId),
            Query.limit(5000)
        ]);

        if (resultsResponse.documents.length === 0) {
            return { leaderboard: [], userRank: null };
        }

        // 2. Get the test info for totalQuestions / maxScore
        let testDoc: any = null;
        try {
            testDoc = await databases.getDocument(DB_ID, 'tests', testId);
        } catch (e) { /* ignore */ }
        const totalQuestionsFromTest = testDoc?.questions
            ? (typeof testDoc.questions === 'string' ? JSON.parse(testDoc.questions) : testDoc.questions).length
            : 0;

        // 3. Deduplicate users - keep BEST score; tie-break by less time
        const userBestResults = new Map<string, any>();
        resultsResponse.documents.forEach((doc: any) => {
            const existing = userBestResults.get(doc.userId);
            if (!existing) {
                userBestResults.set(doc.userId, doc);
            } else {
                // Higher score wins
                if (doc.score > existing.score) {
                    userBestResults.set(doc.userId, doc);
                } else if (doc.score === existing.score) {
                    // Same score → less time wins
                    const docTime = extractNumber(doc.timeTaken);
                    const existingTime = extractNumber(existing.timeTaken);
                    if (docTime > 0 && existingTime > 0 && docTime < existingTime) {
                        userBestResults.set(doc.userId, doc);
                    }
                }
            }
        });

        // 4. Sort: Score DESC, then timeTaken ASC
        let sortedResults = Array.from(userBestResults.values());
        sortedResults.sort((a, b) => {
            if (b.score !== a.score) return b.score - a.score;
            const timeA = extractNumber(a.timeTaken);
            const timeB = extractNumber(b.timeTaken);
            if (timeA > 0 && timeB > 0) return timeA - timeB;
            return 0;
        });

        const totalParticipants = sortedResults.length;

        // 5. Fetch user names
        const userIds = sortedResults.map(r => r.userId);
        const userMap = new Map<string, string>();
        const chunkSize = 50;
        for (let i = 0; i < userIds.length; i += chunkSize) {
            const chunk = userIds.slice(i, i + chunkSize);
            if (chunk.length === 0) continue;
            try {
                const usersResponse = await databases.listDocuments(DB_ID, 'users', [
                    Query.equal('$id', chunk)
                ]);
                usersResponse.documents.forEach((u: any) => {
                    userMap.set(u.$id, u.name || u.displayName || 'Student');
                });
            } catch (e) {
                console.error("Error fetching users batch:", e);
            }
        }

        // 6. Competition ranking + percentile calculation
        const leaderboard: TestRankEntry[] = [];
        let currentRank = 1;

        for (let i = 0; i < sortedResults.length; i++) {
            const doc = sortedResults[i];
            const totalQ = doc.totalQuestions || totalQuestionsFromTest;
            const maxScore = totalQ * 4;
            const timeTaken = extractNumber(doc.timeTaken);

            // Parse answers to count correct/incorrect
            let answers: Record<string, number> = {};
            try {
                answers = typeof doc.answers === 'string' ? JSON.parse(doc.answers) : (doc.answers || {});
            } catch (e) { answers = {}; }

            const answeredCount = Object.keys(answers).length;
            // Score = correct*4 - incorrect*1, so: correct = (score + incorrect) / 4 and incorrect = answered - correct
            // But simpler: correct = count where answer matches correctAnswer... we don't have correctAnswers here
            // Approximate from score: if score = correct*4 - (answered - correct)*1 = 5*correct - answered
            // correct = (score + answered) / 5
            const correctCount = Math.max(0, Math.round((doc.score + answeredCount) / 5));
            const incorrectCount = answeredCount - correctCount;
            const unattempted = totalQ - answeredCount;

            // Competition ranking: same score & time gets same rank
            if (i > 0) {
                const prev = sortedResults[i - 1];
                if (doc.score !== prev.score || extractNumber(doc.timeTaken) !== extractNumber(prev.timeTaken)) {
                    currentRank = i + 1;
                }
            }

            // Percentile: % of students who scored LESS than this user
            const studentsBelow = sortedResults.filter(r => r.score < doc.score).length;
            const percentile = totalParticipants > 1
                ? Math.round((studentsBelow / totalParticipants) * 10000) / 100
                : 100;

            leaderboard.push({
                rank: currentRank,
                userId: doc.userId,
                userName: userMap.get(doc.userId) || 'Unknown User',
                score: doc.score,
                totalMarks: maxScore,
                correctCount,
                incorrectCount,
                unattempted,
                accuracy: answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0,
                percentile,
                timeTaken,
                isCurrentUser: doc.userId === currentUserId,
            });
        }

        const userRank = leaderboard.find(e => e.userId === currentUserId) || null;

        return { leaderboard, userRank };

    } catch (error) {
        console.error("Error fetching test leaderboard:", error);
        return { leaderboard: [], userRank: null };
    }
};


/**
 * Get complete test performance summary for a user
 * Used on the post-test result/review page
 */
export const getTestPerformanceSummary = async (testId: string, currentUserId: string): Promise<TestPerformanceSummary | null> => {
    if (!isAppwriteConfigured()) return null;
    try {
        const { leaderboard, userRank } = await getTestLeaderboard(testId, currentUserId);

        if (leaderboard.length === 0) return null;

        // Get test details
        let testTitle = 'Test';
        try {
            const testDoc = await databases.getDocument(DB_ID, 'tests', testId);
            testTitle = testDoc.title || 'Test';
        } catch (e) { /* ignore */ }

        // Compute aggregate stats
        const scores = leaderboard.map(e => e.score);
        const averageScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
        const highestScore = Math.max(...scores);

        return {
            testId,
            testTitle,
            totalScore: userRank?.score || 0,
            maxScore: userRank?.totalMarks || leaderboard[0]?.totalMarks || 0,
            rank: userRank?.rank || 0,
            totalAttemptees: leaderboard.length,
            percentile: userRank?.percentile || 0,
            correctCount: userRank?.correctCount || 0,
            incorrectCount: userRank?.incorrectCount || 0,
            unattemptedCount: userRank?.unattempted || 0,
            accuracy: userRank?.accuracy || 0,
            timeTaken: userRank?.timeTaken || 0,
            averageScore,
            highestScore,
            leaderboard,
            userEntry: userRank,
        };
    } catch (error) {
        console.error("Error getting test performance summary:", error);
        return null;
    }
};


/**
 * Get question-level analysis for a specific test attempt
 * Computes global success rates by analyzing all submissions
 */
export const getQuestionLevelAnalysis = async (testId: string, userAnswers: Record<number, number>, questionTimes?: Record<number, number>): Promise<QuestionAnalysis[]> => {
    if (!isAppwriteConfigured()) return [];
    try {
        // Get test data
        const testDoc = await databases.getDocument(DB_ID, 'tests', testId);
        let questions = testDoc.questions;
        try {
            while (typeof questions === 'string') questions = JSON.parse(questions);
        } catch (e) { questions = []; }
        if (!Array.isArray(questions)) questions = [];

        // Fetch all results for global stats
        const resultsResponse = await databases.listDocuments(DB_ID, 'test-results', [
            Query.equal('testId', testId),
            Query.limit(5000)
        ]);

        // Calculate per-question success rates
        const questionStats = new Map<number, { correct: number, total: number }>();
        resultsResponse.documents.forEach((doc: any) => {
            let ans: Record<string, number> = {};
            try {
                ans = typeof doc.answers === 'string' ? JSON.parse(doc.answers) : (doc.answers || {});
            } catch (e) { return; }

            questions.forEach((_: any, qIdx: number) => {
                const stats = questionStats.get(qIdx) || { correct: 0, total: 0 };
                if (ans[qIdx.toString()] !== undefined || ans[qIdx] !== undefined) {
                    stats.total++;
                    const userAns = ans[qIdx.toString()] ?? ans[qIdx];
                    if (userAns === questions[qIdx].correctAnswer) {
                        stats.correct++;
                    }
                }
                questionStats.set(qIdx, stats);
            });
        });

        // Build analysis
        return questions.map((q: any, idx: number) => {
            const userAnswer = userAnswers[idx];
            const correctAnswer = q.correctAnswer;
            const stats = questionStats.get(idx) || { correct: 0, total: 0 };

            let status: 'correct' | 'incorrect' | 'skipped' = 'skipped';
            if (userAnswer !== undefined) {
                status = userAnswer === correctAnswer ? 'correct' : 'incorrect';
            }

            return {
                questionIndex: idx,
                questionText: q.text || '',
                userAnswer,
                correctAnswer,
                status,
                timeSpent: questionTimes?.[idx] || 0,
                globalCorrectPercent: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0,
            };
        });
    } catch (error) {
        console.error("Error getting question-level analysis:", error);
        return [];
    }
};


/**
 * Admin: Get comprehensive test analytics
 * Includes score distribution, question success rates, drop-off analysis
 */
export const getAdminTestAnalytics = async (testId: string): Promise<AdminTestAnalytics | null> => {
    if (!isAppwriteConfigured()) return null;
    try {
        // Get test info
        const testDoc = await databases.getDocument(DB_ID, 'tests', testId);
        let questions = testDoc.questions;
        try {
            while (typeof questions === 'string') questions = JSON.parse(questions);
        } catch (e) { questions = []; }
        if (!Array.isArray(questions)) questions = [];

        const totalQ = questions.length;

        // Get all results
        const resultsResponse = await databases.listDocuments(DB_ID, 'test-results', [
            Query.equal('testId', testId),
            Query.limit(5000)
        ]);

        const docs = resultsResponse.documents;
        if (docs.length === 0) {
            return {
                testId,
                testTitle: testDoc.title || 'Test',
                totalAttemptees: 0,
                averageScore: 0,
                highestScore: 0,
                lowestScore: 0,
                medianScore: 0,
                averageTimeTaken: 0,
                scoreDistribution: [],
                questionSuccessRates: [],
                dropOffPoints: [],
            };
        }

        // Score stats
        const scores = docs.map((d: any) => d.score || 0).sort((a: number, b: number) => a - b);
        const sum = scores.reduce((a: number, b: number) => a + b, 0);
        const avg = Math.round(sum / scores.length);
        const median = scores.length % 2 === 0
            ? Math.round((scores[scores.length / 2 - 1] + scores[scores.length / 2]) / 2)
            : scores[Math.floor(scores.length / 2)];

        // Time stats
        const times = docs.map((d: any) => extractNumber(d.timeTaken)).filter((t: number) => t > 0);
        const avgTime = times.length > 0 ? Math.round(times.reduce((a: number, b: number) => a + b, 0) / times.length) : 0;

        // Score distribution (buckets)
        const maxScore = totalQ * 4;
        const bucketSize = Math.max(1, Math.ceil(maxScore / 8)); // 8 buckets
        const distribution: { range: string; count: number }[] = [];
        for (let i = -totalQ; i <= maxScore; i += bucketSize) {
            const lo = i;
            const hi = Math.min(i + bucketSize - 1, maxScore);
            const count = scores.filter((s: number) => s >= lo && s <= hi).length;
            if (count > 0 || lo >= 0) {
                distribution.push({ range: `${lo} - ${hi}`, count });
            }
        }

        // Question success rates
        const questionSuccessRates: { questionIndex: number; correctPercent: number }[] = [];
        const questionAttemptCount: number[] = new Array(totalQ).fill(0);

        questions.forEach((_: any, qIdx: number) => {
            let correctCount = 0;
            let attemptCount = 0;

            docs.forEach((doc: any) => {
                let ans: Record<string, number> = {};
                try {
                    ans = typeof doc.answers === 'string' ? JSON.parse(doc.answers) : (doc.answers || {});
                } catch (e) { return; }

                const userAns = ans[qIdx.toString()] ?? ans[qIdx];
                if (userAns !== undefined) {
                    attemptCount++;
                    if (userAns === questions[qIdx].correctAnswer) {
                        correctCount++;
                    }
                }
            });

            questionAttemptCount[qIdx] = attemptCount;
            questionSuccessRates.push({
                questionIndex: qIdx,
                correctPercent: attemptCount > 0 ? Math.round((correctCount / attemptCount) * 100) : 0,
            });
        });

        // Drop-off points: questions where significantly fewer students attempted
        const dropOffPoints: { questionIndex: number; dropCount: number }[] = [];
        for (let i = 1; i < totalQ; i++) {
            const drop = questionAttemptCount[i - 1] - questionAttemptCount[i];
            if (drop > 0) {
                dropOffPoints.push({ questionIndex: i, dropCount: drop });
            }
        }
        dropOffPoints.sort((a, b) => b.dropCount - a.dropCount);

        return {
            testId,
            testTitle: testDoc.title || 'Test',
            totalAttemptees: docs.length,
            averageScore: avg,
            highestScore: Math.max(...scores),
            lowestScore: Math.min(...scores),
            medianScore: median,
            averageTimeTaken: avgTime,
            scoreDistribution: distribution,
            questionSuccessRates,
            dropOffPoints: dropOffPoints.slice(0, 10), // Top 10 drop-off points
        };
    } catch (error) {
        console.error("Error getting admin test analytics:", error);
        return null;
    }
};


/**
 * Get all test results for computing admin-level stats across all tests
 */
export const getAllTestResults = async (): Promise<TestResult[]> => {
    if (!isAppwriteConfigured()) return [];
    try {
        const response = await databases.listDocuments(DB_ID, 'test-results', [
            Query.limit(5000),
            Query.orderDesc('completedAt')
        ]);
        return response.documents.map(doc => ({
            id: doc.$id,
            ...doc,
            answers: typeof doc.answers === 'string' ? JSON.parse(doc.answers) : doc.answers,
            timeTaken: extractNumber(doc.timeTaken),
        })) as unknown as TestResult[];
    } catch (error) {
        console.error("Error fetching all test results:", error);
        return [];
    }
};

