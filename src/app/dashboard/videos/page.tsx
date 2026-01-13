"use client";

import { Card } from "@/components/ui/Card";
import Section from "@/components/dashboard/Section";
import { Button } from "@/components/ui/Button";
import { useState, useEffect } from "react";
import { getVideoClasses } from "@/lib/appwrite-db";
import { VideoClass } from "@/types";

export default function VideosPage() {
    const [videos, setVideos] = useState<VideoClass[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedVideo, setSelectedVideo] = useState<VideoClass | null>(null);
    const [activeCategory, setActiveCategory] = useState("All");

    const categories = ["All", "Physics", "Chemistry", "Maths", "General"];

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                // 1. Fetch from YouTube Channel
                const ytResponse = await fetch('/api/youtube?channelId=UCVijTMH5H7gzVPnJF8HXKhQ');
                const ytData = await ytResponse.json();

                // 2. Fetch from Appwrite (Internal manual videos)
                const dbData = await getVideoClasses();

                // Combined data
                const combined = Array.isArray(ytData) ? [...ytData, ...dbData] : dbData;

                // Remove duplicates by videoId/url
                const uniqueVideos = combined.reduce((acc: VideoClass[], current) => {
                    const x = acc.find(item => item.url === current.url);
                    if (!x) return acc.concat([current]);
                    return acc;
                }, []);

                setVideos(uniqueVideos);
            } catch (error) {
                console.error("Error fetching videos:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchVideos();
    }, []);

    const extractYouTubeVideoId = (url: string): string | null => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const filteredVideos = activeCategory === "All"
        ? videos
        : videos.filter(v => v.subject?.toLowerCase() === activeCategory.toLowerCase());

    return (
        <div className="space-y-6 md:space-y-10 animate-in fade-in duration-500 pb-20 md:pb-0">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-black uppercase tracking-tight italic">Video Classes</h1>
                    <p className="text-sm md:text-base text-black font-bold opacity-60">Master concepts with premium video lectures</p>
                </div>
            </div>

            {/* Categories */}
            <div className="flex gap-3 md:gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
                {categories.map((cat, i) => (
                    <button
                        key={i}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-4 md:px-6 py-2 md:py-2.5 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all border-2 whitespace-nowrap ${activeCategory === cat ? 'bg-primary border-black text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' : 'bg-white border-black text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-primary/10'}`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Video Player Modal */}
            {selectedVideo && (
                <div
                    className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex items-center justify-center p-4 md:p-6"
                    onClick={() => setSelectedVideo(null)}
                >
                    <div
                        className="w-full max-w-5xl bg-white rounded-2xl md:rounded-3xl overflow-hidden border-2 md:border-4 border-black shadow-[8px_8px_0px_0px_rgba(255,208,47,1)] md:shadow-[16px_16px_0px_0px_rgba(255,208,47,1)]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="aspect-video relative bg-black">
                            <iframe
                                src={`https://www.youtube.com/embed/${extractYouTubeVideoId(selectedVideo.url)}?autoplay=1`}
                                className="w-full h-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                        <div className="p-4 md:p-8 bg-white border-t-2 md:border-t-4 border-black max-h-[40vh] overflow-y-auto">
                            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                                <div className="flex-1">
                                    <h2 className="text-lg md:text-2xl font-black text-black mb-2 uppercase italic leading-tight">{selectedVideo.title}</h2>
                                    <span className="inline-block px-3 py-1 bg-primary border-2 border-black text-[10px] font-black uppercase tracking-widest">{selectedVideo.duration} MINUTES</span>
                                </div>
                                <Button
                                    onClick={() => setSelectedVideo(null)}
                                    className="w-full md:w-auto bg-black text-white hover:bg-primary hover:text-black font-black uppercase tracking-widest text-xs px-6 py-3 h-auto shrink-0"
                                >
                                    CLOSE
                                </Button>
                            </div>
                            {selectedVideo.description && (
                                <p className="text-xs md:text-base text-black font-bold opacity-70 mt-4 leading-relaxed whitespace-pre-wrap">{selectedVideo.description}</p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <div className="space-y-6">
                <div className="px-1 mb-4 flex justify-between items-end">
                    <h2 className="text-lg md:text-xl font-bold text-foreground tracking-tight">Premium Lectures</h2>
                </div>

                {loading ? (
                    <div className="p-12 text-center text-black font-black uppercase tracking-widest animate-pulse">Loading amazing content...</div>
                ) : filteredVideos.length === 0 ? (
                    <Card className="p-16 text-center border-4 border-dashed border-black bg-white rounded-3xl">
                        <p className="text-black font-black uppercase tracking-widest">No video classes available yet.</p>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                        {filteredVideos.map((vid) => {
                            const videoId = extractYouTubeVideoId(vid.url);
                            return (
                                <div
                                    key={vid.id}
                                    className="group relative bg-white border-2 md:border-4 border-black rounded-2xl md:rounded-3xl overflow-hidden hover:shadow-[4px_4px_0px_0px_rgba(255,208,47,1)] md:hover:shadow-[8px_8px_0px_0px_rgba(255,208,47,1)] transition-all cursor-pointer transform hover:-translate-y-1 md:hover:-translate-y-2 active:scale-95 md:active:scale-100"
                                    onClick={() => setSelectedVideo(vid)}
                                >
                                    <div className="aspect-video bg-black relative border-b-2 md:border-b-4 border-black">
                                        <img
                                            src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                                            alt={vid.title}
                                            className="w-full h-full object-cover group-hover:opacity-40 transition-opacity"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100">
                                            <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-primary border-2 md:border-4 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] md:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                                <div className="border-t-[8px] md:border-t-[10px] border-t-transparent border-l-[12px] md:border-l-[16px] border-l-black border-b-[8px] md:border-b-[10px] border-b-transparent ml-1"></div>
                                            </div>
                                        </div>
                                        <div className="absolute bottom-2 right-2 md:bottom-4 md:right-4 px-2 py-1 bg-black text-primary text-[8px] md:text-[10px] font-black rounded border border-black uppercase tracking-widest">
                                            {vid.duration} MIN
                                        </div>
                                    </div>
                                    <div className="p-4 md:p-6">
                                        <h3 className="font-black text-black text-base md:text-lg leading-tight mb-2 md:mb-3 group-hover:text-primary transition-colors uppercase tracking-tight line-clamp-2">{vid.title}</h3>
                                        <p className="text-[10px] md:text-xs text-black font-bold opacity-60 line-clamp-2 italic">
                                            {vid.description}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

