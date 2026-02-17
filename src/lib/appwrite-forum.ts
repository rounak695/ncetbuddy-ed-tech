import { ID, Query } from "appwrite";
import { databases } from "./appwrite-student";

const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'ncet-buddy-db';

export interface ForumPost {
    id: string;
    userId: string;
    authorName: string;
    title: string;
    content: string;
    category: 'General' | 'Doubt' | 'Exam Update' | 'Strategy';
    upvotes: number;
    views: number;
    createdAt: number;
}

export interface ForumComment {
    id: string;
    postId: string;
    userId: string;
    authorName: string;
    content: string;
    createdAt: number;
}

// --- Posts ---
export const getForumPosts = async (category?: string): Promise<ForumPost[]> => {
    try {
        const queries = [Query.orderDesc('createdAt')];
        if (category && category !== 'All') {
            queries.push(Query.equal('category', category));
        }

        const response = await databases.listDocuments(DB_ID, 'forum_posts', queries);
        return response.documents.map(doc => ({
            id: doc.$id,
            ...doc
        })) as unknown as ForumPost[];
    } catch (error) {
        console.error("Error fetching forum posts:", error);
        return [];
    }
};

export const createForumPost = async (post: Omit<ForumPost, "id" | "createdAt" | "upvotes" | "views">) => {
    try {
        await databases.createDocument(DB_ID, 'forum_posts', ID.unique(), {
            ...post,
            upvotes: 0,
            views: 0,
            createdAt: Math.floor(Date.now() / 1000)
        });
    } catch (error) {
        console.error("Error creating post:", error);
        throw error;
    }
};

export const getPostById = async (postId: string): Promise<ForumPost | null> => {
    try {
        const doc = await databases.getDocument(DB_ID, 'forum_posts', postId);
        return { id: doc.$id, ...doc } as unknown as ForumPost;
    } catch (error) {
        return null;
    }
};

// --- Comments ---
export const getPostComments = async (postId: string): Promise<ForumComment[]> => {
    try {
        const response = await databases.listDocuments(DB_ID, 'forum_comments', [
            Query.equal('postId', postId),
            Query.orderAsc('createdAt')
        ]);
        return response.documents.map(doc => ({
            id: doc.$id,
            ...doc
        })) as unknown as ForumComment[];
    } catch (error) {
        console.error("Error fetching comments:", error);
        return [];
    }
};

export const createComment = async (comment: Omit<ForumComment, "id" | "createdAt">) => {
    try {
        await databases.createDocument(DB_ID, 'forum_comments', ID.unique(), {
            ...comment,
            createdAt: Math.floor(Date.now() / 1000)
        });
    } catch (error) {
        console.error("Error creating comment:", error);
        throw error;
    }
};
