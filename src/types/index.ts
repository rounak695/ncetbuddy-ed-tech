export interface Question {
    id: string;
    text: string;
    imageUrl?: string;
    options: string[];
    correctAnswer: number;
}

export type PYQSubject = 'languages' | 'humanities' | 'science' | 'commerce' | 'non-domain';

export interface Test {
    id: string;
    title: string;
    description?: string;
    subject?: string;
    duration: number; // in minutes
    questions: Question[];
    createdBy: string;
    createdAt: number;
    isVisible: boolean;
    status?: 'Draft' | 'Published' | 'Archived';
    // Business model distinction
    testType?: 'pyq' | 'educator'; // PYQ = platform-owned free content, Educator = educator-owned premium content
    pyqSubject?: 'languages' | 'humanities' | 'science' | 'commerce' | 'non-domain'; // For PYQ categorization
    price?: number; // Cost of the test in INR (0 for free)
}

export interface Purchase {
    id: string;
    userId: string;
    testId: string;
    paymentId?: string; // Instamojo Payment ID (available after success)
    paymentRequestId: string; // Instamojo Payment Request ID
    amount: number;
    status: 'pending' | 'completed' | 'failed';
    createdAt: number;
}

export interface TestResult {
    id?: string;
    userId: string;
    testId: string;
    score: number;
    totalQuestions: number;
    answers: Record<number, number>; // question index -> selected option index
    completedAt: number;
}

export interface Book {
    id?: string;
    title: string;
    subject: string;
    chapter?: string;
    url: string;
    thumbnailColor: string;
    isVisible: boolean;
    createdAt?: number;
}

export interface FormulaCard {
    id?: string;
    title: string;
    subject: string;
    chapter?: string;
    content?: string; // Text content
    imageUrl?: string; // Image URL
    url?: string; // External link
    isVisible: boolean;
    createdAt?: number;
}

export interface UserProfile {
    uid: string;
    email: string;
    displayName?: string;
    role: 'user' | 'admin';
    premiumStatus: boolean;
    isBanned?: boolean;
    enrolledEducatorId?: string;
    totalScore?: number;
    testsAttempted?: number;
    stats?: {
        testsAttempted: number;
        booksViewed: number;
        streak: number;
    };
    createdAt?: number;
}

export interface Notification {
    id?: string;
    title: string;
    message: string;
    type: 'info' | 'alert' | 'success';
    createdAt: number;
}

export interface PYQ {
    id?: string;
    title: string;
    subject: string;
    year: number;
    url: string;
    createdAt: number;
}

export interface SiteSettings {
    bannerText: string;
    primaryColor: string;
    contactEmail: string;
    showBanner: boolean;
}

export interface VideoClass {
    id?: string;
    videoId?: string;
    title: string;
    description?: string;
    url: string;  // YouTube URL
    duration?: number;
    authorId?: string;
    subject?: string;
    thumbnailUrl?: string;
    createdAt?: string | number;  // datetime or timestamp
}

export interface Educator {
    id: string; // Document ID
    name: string;
    subject: string;
    logoFileId?: string;
    catalogXmlFileId?: string;
    youtubeChannelId?: string;
}

export interface VideoProgress {
    studentId: string;
    educatorId: string;
    videoId: string;
    watched: boolean;
    lastTimestamp?: number;
    updatedAt?: number | string;
}

export interface EducatorVideo {
    id: string;
    educatorId: string;
    title: string;
    url: string; // YouTube URL
    createdAt: number;
}

export interface EducatorStats {
    totalRevenue: number;
    totalSales: number;
    recentSales: Purchase[];
}
