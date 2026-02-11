import { databases, storage, isAppwriteConfigured } from "./appwrite-student";
import { ID, Query, Models } from "appwrite";
import { Test, Book, FormulaCard, Notification, PYQ, SiteSettings, UserProfile, TestResult, VideoClass, Educator, VideoProgress, UserEvent, UserAnalytics } from "@/types";

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

export const saveTestResult = async (result: Partial<TestResult> & { correctCount?: number, incorrectCount?: number }) => {
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
            Query.select(['userId', 'score'])
        ]);

        // 3. Aggregate scores per user
        const userStats = new Map<string, { totalScore: number, testsAttempted: number }>();

        resultsResponse.documents.forEach((doc: any) => {
            const uid = doc.userId;
            const current = userStats.get(uid) || { totalScore: 0, testsAttempted: 0 };
            userStats.set(uid, {
                totalScore: current.totalScore + (Number(doc.score) || 0),
                testsAttempted: current.testsAttempted + 1
            });
        });

        // 4. Build leaderboard with only users who attempted tests
        const leaderboard = users
            .map(user => {
                const stats = userStats.get(user.uid);
                if (!stats || stats.testsAttempted === 0) return null; // Exclude users with 0 attempts
                return {
                    ...user,
                    totalScore: stats.totalScore,
                    testsAttempted: stats.testsAttempted
                };
            })
            .filter(Boolean) as (UserProfile & { totalScore: number; testsAttempted: number })[];

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
                totalParticipants
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

export interface TestLeaderboardEntry {
    rank: number;
    userId: string;
    userName: string;
    score: number;
    completedAt: number;
    isCurrentUser: boolean;
    accuracy: number;
    timeTaken: number; // in seconds
}

export const getTestLeaderboard = async (testId: string, currentUserId?: string): Promise<{ leaderboard: TestLeaderboardEntry[], userRank: TestLeaderboardEntry | null }> => {
    if (!isAppwriteConfigured()) return { leaderboard: [], userRank: null };
    try {
        // 1. Fetch all test results for this test
        // We order by score descending
        const resultsResponse = await databases.listDocuments(DB_ID, 'test-results', [
            Query.equal('testId', testId),
            Query.orderDesc('score'),
            Query.limit(5000) // Adjust limit as needed
        ]);

        if (resultsResponse.documents.length === 0) {
            return { leaderboard: [], userRank: null };
        }

        // 2. Deduplicate users - keep highest score
        const userBestResults = new Map<string, any>();
        resultsResponse.documents.forEach((doc: any) => {
            const existing = userBestResults.get(doc.userId);
            if (!existing || doc.score > existing.score) {
                userBestResults.set(doc.userId, doc);
            }
            // Tie-breaking: if scores equal, maybe use earlier completion?
            // For now, simplistic overwrite if score is higher, or if equal (later in list means earlier date? No, depends on sort order)
            // If we sort by score DESC, we still need secondary sort.
            // Let's assume the first one we see is the best if we sorted by score DESC.
            // But if multiple attempts have same score, which one to keep?
            // Usually the one with less time or earlier date.
            // The DB query sorted by score. If we want second level sort, it's safer to do in memory.
        });

        // Convert map to array
        let sortedResults = Array.from(userBestResults.values());

        // 3. Sort in memory for precise ranking (Score DESC, Duration/Time ASC)
        // Note: We don't have 'duration' explicitly in TestResult type in this file yet (it has completedAt).
        // If we don't have start time, we can't calculate duration from result alone unless result has 'duration' or 'timeTaken'.
        // TestResult in types/index.ts doesn't have duration.
        // We will just sort by score DESC.
        sortedResults.sort((a, b) => b.score - a.score);

        // 4. Fetch User details
        // Collect user IDs
        const userIds = sortedResults.map(r => r.userId);

        // Fetch users in batches or using contains
        // Appwrite limit is usually 100 per request.
        // If many users, this loop might be needed.
        // For efficiency, let's just fetch all users if list is small, or use `getUsers` helper logic.
        // Assuming we have a helper or can just list users.

        // Let's try to fetch all users (up to reasonable limit) to map names.
        // Or better: fetch only needed users if count is small.
        let userMap = new Map<string, string>();

        // Chunk userIds into batches of 100 for queries
        const chunkSize = 50; // slightly conservative
        for (let i = 0; i < userIds.length; i += chunkSize) {
            const chunk = userIds.slice(i, i + chunkSize);
            if (chunk.length === 0) continue;

            try {
                const usersResponse = await databases.listDocuments(DB_ID, 'users', [
                    Query.equal('$id', chunk)
                ]);
                usersResponse.documents.forEach((u: any) => {
                    userMap.set(u.$id, u.name || u.displayName || 'Anonymous');
                });
            } catch (e) {
                console.error("Error fetching users batch:", e);
                // Fallback: try to fetch individual if batch fails? Or just continue.
            }
        }

        // If map is empty (maybe permissions issue or query not supported), we might have fallback names

        // 5. Build Leaderboard Entries
        const leaderboard: TestLeaderboardEntry[] = sortedResults.map((doc, index) => {
            // Calculate additional stats if needed
            return {
                rank: index + 1,
                userId: doc.userId,
                userName: userMap.get(doc.userId) || 'Unknown User',
                score: doc.score,
                completedAt: doc.completedAt,
                isCurrentUser: doc.userId === currentUserId,
                accuracy: doc.totalQuestions > 0 ? (doc.score / (doc.totalQuestions * 4)) * 100 : 0, // approximation
                timeTaken: 0 // placeholder
            };
        });

        // 6. Find current user's rank
        const userRank = leaderboard.find(e => e.userId === currentUserId) || null;

        return { leaderboard, userRank };

    } catch (error) {
        console.error("Error fetching test leaderboard:", error);
        return { leaderboard: [], userRank: null };
    }
};
