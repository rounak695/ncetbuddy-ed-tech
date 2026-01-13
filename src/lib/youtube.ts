export interface YouTubeVideo {
    id: string;
    title: string;
    thumbnail: string;
    url: string;
    description: string;
    publishedAt: string;
}

export const fetchYouTubeVideos = async (channelId: string): Promise<YouTubeVideo[]> => {
    try {
        // We use a CORS proxy or direct fetch if allowed
        // For local development and some environments, direct fetch to YouTube might be blocked by CORS
        // But since this is often run on a server or behind a proxy, we'll try direct first
        const response = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`);
        const text = await response.text();

        // Simple XML parsing (basic)
        // Note: For a more robust solution, use a proper XML parser library
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(text, "text/xml");
        const entries = xmlDoc.getElementsByTagName("entry");

        const videos: YouTubeVideo[] = [];

        for (let i = 0; i < entries.length; i++) {
            const entry = entries[i];
            const id = entry.getElementsByTagName("yt:videoId")[0]?.textContent || "";
            const title = entry.getElementsByTagName("title")[0]?.textContent || "";
            const publishedAt = entry.getElementsByTagName("published")[0]?.textContent || "";
            const description = entry.getElementsByTagName("media:description")[0]?.textContent || "";
            const thumbnail = `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
            const url = `https://www.youtube.com/watch?v=${id}`;

            videos.push({
                id,
                title,
                thumbnail,
                url,
                description,
                publishedAt
            });
        }

        return videos;
    } catch (error) {
        console.error("Error fetching YouTube videos:", error);
        return [];
    }
};
