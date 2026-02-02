import { NextRequest, NextResponse } from "next/server";

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Simple in-memory cache
interface CacheEntry {
    data: any;
    timestamp: number;
}
const cache: Record<string, CacheEntry> = {};

export async function GET(req: NextRequest) {
    if (!YOUTUBE_API_KEY) {
        return NextResponse.json({ error: "YouTube API Key missing" }, { status: 500 });
    }

    const { searchParams } = new URL(req.url);
    const action = searchParams.get("action"); // 'live' or 'recent'
    const channelId = searchParams.get("channelId");

    if (!channelId) {
        return NextResponse.json({ error: "Channel ID required" }, { status: 400 });
    }

    const cacheKey = `${action}_${channelId}`;
    const now = Date.now();

    // Check cache
    if (cache[cacheKey] && (now - cache[cacheKey].timestamp < CACHE_DURATION)) {
        return NextResponse.json(cache[cacheKey].data);
    }

    try {
        let result;

        if (action === "live") {
            // Fetch Live Now
            // https://developers.google.com/youtube/v3/docs/search/list
            const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&eventType=live&type=video&key=${YOUTUBE_API_KEY}`;
            const res = await fetch(url);
            const data = await res.json();

            result = {
                isLive: data.items && data.items.length > 0,
                video: data.items && data.items.length > 0 ? {
                    id: data.items[0].id.videoId,
                    title: data.items[0].snippet.title,
                    thumbnail: data.items[0].snippet.thumbnails.medium.url,
                    channelTitle: data.items[0].snippet.channelTitle
                } : null
            };

        } else if (action === "recent") {
            // Fetch Recent Videos (Streams usually, but 'date' order catches recent uploads too)
            const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&type=video&order=date&maxResults=6&key=${YOUTUBE_API_KEY}`;
            const res = await fetch(url);
            const data = await res.json();

            result = {
                videos: data.items ? data.items.map((item: any) => ({
                    id: item.id.videoId,
                    title: item.snippet.title,
                    thumbnail: item.snippet.thumbnails.medium.url,
                    channelTitle: item.snippet.channelTitle,
                    publishedAt: item.snippet.publishedAt
                })) : []
            };
        } else {
            return NextResponse.json({ error: "Invalid action" }, { status: 400 });
        }

        // Update cache
        cache[cacheKey] = {
            data: result,
            timestamp: now
        };

        return NextResponse.json(result);

    } catch (error) {
        console.error("YouTube API Error:", error);
        return NextResponse.json({ error: "Failed to fetch from YouTube" }, { status: 500 });
    }
}
