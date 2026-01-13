import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const channelId = searchParams.get('channelId');

    if (!channelId) {
        return NextResponse.json({ error: 'Channel ID is required' }, { status: 400 });
    }

    try {
        const response = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`, {
            next: { revalidate: 3600 } // Cache for 1 hour
        });
        const text = await response.text();

        // Basic RSS/Atom parsing using regex to avoid external dependencies
        // This is safer on the server than DOMParser
        const entries = text.split('<entry>');
        entries.shift(); // Remove the header part

        const videos = entries.map(entry => {
            const videoId = entry.match(/<yt:videoId>(.*?)<\/yt:videoId>/)?.[1] || '';
            const title = entry.match(/<title>(.*?)<\/title>/)?.[1] || '';
            const publishedAt = entry.match(/<published>(.*?)<\/published>/)?.[1] || '';
            const description = entry.match(/<media:description>(.*?)<\/media:description>/)?.[1]?.substring(0, 200) || '';

            const lowerTitle = title.toLowerCase();
            let subject = 'General';
            if (lowerTitle.includes('physics')) subject = 'Physics';
            else if (lowerTitle.includes('chemistry')) subject = 'Chemistry';
            else if (lowerTitle.includes('maths') || lowerTitle.includes('mathematics')) subject = 'Maths';

            return {
                id: videoId,
                videoId: videoId,
                title: title,
                subject: subject,
                description: description,
                url: `https://www.youtube.com/watch?v=${videoId}`,
                thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
                createdAt: publishedAt,
                duration: 15 // Placeholder duration
            };
        });

        return NextResponse.json(videos);
    } catch (error) {
        console.error('YouTube fetch error:', error);
        return NextResponse.json({ error: 'Failed to fetch YouTube videos' }, { status: 500 });
    }
}
