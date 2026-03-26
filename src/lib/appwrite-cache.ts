/**
 * Client-side in-memory cache for Appwrite database queries.
 * Dramatically reduces database reads by caching frequently-accessed data.
 * 
 * Design:
 * - In-memory Map for fast access
 * - TTL-based expiration
 * - Manual invalidation for write-after-read consistency
 * - Cache-miss rate monitor: auto-alerts Discord if > MISS_ALERT_THRESHOLD misses/minute
 */

interface CacheEntry<T> {
    data: T;
    expiresAt: number;
}

const cache = new Map<string, CacheEntry<any>>();

// TTL constants (in milliseconds)
export const CACHE_TTL = {
    /** Static content that rarely changes (tests, books, formula cards, videos) */
    STATIC: 10 * 60 * 1000,      // 10 minutes
    /** User-specific data (test results, profile) */
    USER: 3 * 60 * 1000,          // 3 minutes
    /** Aggregated data (leaderboard, analytics) */
    AGGREGATE: 5 * 60 * 1000,     // 5 minutes
    /** Forum and social data */
    SOCIAL: 5 * 60 * 1000,        // 5 minutes
} as const;

// ── Cache-Miss Rate Monitor ─────────────────────────────────────────────────
// Tracks how many cache misses occur in the current 60-second window.
// If it exceeds MISS_ALERT_THRESHOLD we fire a Discord alert (once per window).

const MISS_WINDOW_MS = 60 * 1000;        // 1-minute sliding window
const MISS_ALERT_THRESHOLD = 50;          // misses per minute before alerting
const ALERT_FUNCTION_ID = '69c5affd0022e5873f9c'; // Appwrite Function ID

let missTimes: number[] = [];             // timestamps of recent misses
let alertFiredAt = 0;                     // epoch of last alert (avoid spam)

function recordCacheMiss(key: string): void {
    const now = Date.now();
    missTimes.push(now);

    // Prune entries outside the window
    missTimes = missTimes.filter(t => now - t < MISS_WINDOW_MS);

    // Only alert once per window and only in browser context
    if (
        missTimes.length >= MISS_ALERT_THRESHOLD &&
        now - alertFiredAt > MISS_WINDOW_MS &&
        typeof window !== 'undefined'
    ) {
        alertFiredAt = now;
        fireDiscordAlert(missTimes.length, key);
    }
}

async function fireDiscordAlert(missCount: number, triggerKey: string): Promise<void> {
    try {
        // Dynamically import to avoid circular deps and SSR issues
        const { functions } = await import('./appwrite-student');
        const route = typeof window !== 'undefined' ? window.location.pathname : 'SSR';

        await functions.createExecution(
            ALERT_FUNCTION_ID,
            JSON.stringify({
                message: `⚠️ ${missCount} cache misses in 60s — possible infinite loop or unoptimized fetch. Last key: \`${triggerKey}\``,
                userId: 'session', // generic — user ID not available here
                route,
                missCount,
            }),
            true // async — don't block UI
        );
        console.warn(`[appwrite-cache] Alert sent: ${missCount} cache misses in 60s`);
    } catch (err) {
        // Silently fail — alerting should never crash the app
        console.error('[appwrite-cache] Failed to fire usage alert:', err);
    }
}
// ────────────────────────────────────────────────────────────────────────────

/**
 * Fetch data with caching. Returns cached data if fresh, otherwise calls fetcher.
 * Records cache misses — if misses exceed 50/min a Discord alert is fired.
 *
 * @param key - Unique cache key (e.g., "tests", "user_results_<userId>")
 * @param fetcher - Async function that fetches fresh data
 * @param ttlMs - Time-to-live in milliseconds
 * @returns Cached or fresh data
 */
export async function cachedFetch<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttlMs: number
): Promise<T> {
    const existing = cache.get(key);
    if (existing && Date.now() < existing.expiresAt) {
        return existing.data;
    }

    // Cache miss — record it and fetch fresh data
    recordCacheMiss(key);
    const data = await fetcher();
    cache.set(key, {
        data,
        expiresAt: Date.now() + ttlMs,
    });
    return data;
}

/**
 * Invalidate a specific cache key.
 * Call this after write operations to ensure fresh data on next read.
 */
export function invalidateCache(key: string): void {
    cache.delete(key);
}

/**
 * Invalidate all cache keys matching a prefix.
 * Useful for invalidating all user-specific entries, e.g., "user_results_*"
 */
export function invalidateCacheByPrefix(prefix: string): void {
    for (const key of cache.keys()) {
        if (key.startsWith(prefix)) {
            cache.delete(key);
        }
    }
}

/**
 * Clear entire cache. Use sparingly (e.g., on logout).
 */
export function clearAllCache(): void {
    cache.clear();
}

// Cache key builders for consistency
export const CacheKeys = {
    tests: () => 'tests_list',
    testsListOnly: () => 'tests_list_only',
    testById: (id: string) => `test_${id}`,
    books: () => 'books_list',
    formulaCards: () => 'formula_cards_list',
    videoClasses: () => 'video_classes_list',
    forumPosts: (category?: string) => `forum_posts_${category || 'all'}`,
    userTestResults: (userId: string) => `user_results_${userId}`,
    userProfile: (userId: string) => `user_profile_${userId}`,
    leaderboardSummary: (userId: string) => `leaderboard_summary_${userId}`,
    leaderboard: () => 'leaderboard',
    dailyProgress: (userId: string) => `daily_progress_${userId}`,
    notifications: () => 'notifications_list',
    educators: () => 'educators_list',
    activeBanners: () => 'active_banners',
    educatorVideos: (educatorId: string) => `educator_videos_${educatorId}`,
    allEducatorVideos: () => 'all_educator_videos',
    userPayments: (userId: string) => `user_payments_${userId}`,
    userPurchases: (userId: string) => `user_purchases_${userId}`,
    hasUserPaid: (userId: string, product: string) => `paid_${userId}_${product}`,
} as const;
