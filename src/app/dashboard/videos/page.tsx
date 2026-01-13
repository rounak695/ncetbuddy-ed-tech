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
                const data = await getVideoClasses();
                setVideos(data);
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

    const filteredVideos = videos;  // No subject filtering for now since schema doesn't have subject

    return (
        <div className="space-y-10 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-black uppercase tracking-tight italic">Video Classes</h1>
                    <p className="text-black font-bold opacity-60">Master concepts with premium video lectures</p>
                </div>
            </div>

            {/* Categories */}
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {categories.map((cat, i) => (
                    <button
                        key={i}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all border-2 ${activeCategory === cat ? 'bg-primary border-black text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' : 'bg-white border-black text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-primary/10'}`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Video Player Modal */}
            {selectedVideo && (
                <div
                    className="fixed inset-0 bg-black/90 backdrop-blur-md z-[60] flex items-center justify-center p-6"
                    onClick={() => setSelectedVideo(null)}
                >
                    <div
                        className="w-full max-w-5xl bg-white rounded-3xl overflow-hidden border-4 border-black shadow-[16px_16px_0px_0px_rgba(255,208,47,1)]"
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
                        <div className="p-8 bg-white border-t-4 border-black">
                            <div className="flex justify-between items-start gap-4">
                                <div>
                                    <h2 className="text-2xl font-black text-black mb-2 uppercase italic">{selectedVideo.title}</h2>
                                    <span className="inline-block px-3 py-1 bg-primary border-2 border-black text-[10px] font-black uppercase tracking-widest">{selectedVideo.duration} MINUTES</span>
                                </div>
                                <Button
                                    onClick={() => setSelectedVideo(null)}
                                    className="bg-black text-white hover:bg-primary hover:text-black font-black uppercase tracking-widest text-xs px-6 py-3 h-auto"
                                >
                                    CLOSE
                                </Button>
                            </div>
                            {selectedVideo.description && (
                                <p className="text-black font-bold opacity-70 mt-4 leading-relaxed">{selectedVideo.description}</p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <Section title="Premium Lectures">
                {loading ? (
                    <div className="p-12 text-center text-black font-black uppercase tracking-widest animate-pulse">Loading amazing content...</div>
                ) : filteredVideos.length === 0 ? (
                    <Card className="p-16 text-center border-4 border-dashed border-black bg-white rounded-3xl">
                        <p className="text-black font-black uppercase tracking-widest">No video classes available yet.</p>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredVideos.map((vid) => {
                            const videoId = extractYouTubeVideoId(vid.url);
                            return (
                                <div
                                    key={vid.id}
                                    className="group relative bg-white border-4 border-black rounded-3xl overflow-hidden hover:shadow-[8px_8px_0px_0px_rgba(255,208,47,1)] transition-all cursor-pointer transform hover:-translate-y-2"
                                    onClick={() => setSelectedVideo(vid)}
                                >
                                    <div className="aspect-video bg-black relative border-b-4 border-black">
                                        <img
                                            src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                                            alt={vid.title}
                                            className="w-full h-full object-cover group-hover:opacity-40 transition-opacity"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100">
                                            <div className="w-16 h-16 rounded-full bg-primary border-4 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                                <div className="border-t-[10px] border-t-transparent border-l-[16px] border-l-black border-b-[10px] border-b-transparent ml-1"></div>
                                            </div>
                                        </div>
                                        <div className="absolute bottom-4 right-4 px-2 py-1 bg-black text-primary text-[10px] font-black rounded border border-black uppercase tracking-widest">
                                            {vid.duration} MIN
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <h3 className="font-black text-black text-lg leading-tight mb-3 group-hover:text-primary transition-colors uppercase tracking-tight">{vid.title}</h3>
                                        <p className="text-xs text-black font-bold opacity-60 line-clamp-2 italic">
                                            {vid.description}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </Section>
        </div>
    );
}

