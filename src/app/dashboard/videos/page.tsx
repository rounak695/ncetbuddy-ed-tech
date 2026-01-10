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
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Video Classes</h1>
                    <p className="text-gray-400 mt-1">Watch high-quality lectures from top educators</p>
                </div>
            </div>

            {/* Categories */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {categories.map((cat, i) => (
                    <button
                        key={i}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeCategory === cat ? 'bg-white text-black' : 'bg-white/5 text-gray-300 hover:bg-white/10'}`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Video Player Modal */}
            {selectedVideo && (
                <div
                    className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
                    onClick={() => setSelectedVideo(null)}
                >
                    <div
                        className="w-full max-w-4xl bg-neutral-900 rounded-2xl overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="aspect-video">
                            <iframe
                                src={`https://www.youtube.com/embed/${extractYouTubeVideoId(selectedVideo.url)}?autoplay=1`}
                                className="w-full h-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                        <div className="p-4">
                            <h2 className="text-xl font-bold text-white mb-1">{selectedVideo.title}</h2>
                            <p className="text-gray-400 text-sm">{selectedVideo.duration} minutes</p>
                            {selectedVideo.description && (
                                <p className="text-gray-500 text-sm mt-2">{selectedVideo.description}</p>
                            )}
                            <Button
                                variant="secondary"
                                className="mt-4"
                                onClick={() => setSelectedVideo(null)}
                            >
                                Close
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            <Section title="Available Classes">
                {loading ? (
                    <p className="text-gray-400">Loading videos...</p>
                ) : filteredVideos.length === 0 ? (
                    <Card className="p-8 text-center">
                        <p className="text-gray-500">No video classes available yet.</p>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredVideos.map((vid) => {
                            const videoId = extractYouTubeVideoId(vid.url);
                            return (
                                <div
                                    key={vid.id}
                                    className="group relative bg-neutral-900 border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-all cursor-pointer"
                                    onClick={() => setSelectedVideo(vid)}
                                >
                                    <div className="aspect-video bg-neutral-800 relative">
                                        <img
                                            src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                                            alt={vid.title}
                                            className="w-full h-full object-cover group-hover:opacity-80 transition-opacity"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <div className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center shadow-lg">
                                                <div className="border-t-[10px] border-t-transparent border-l-[16px] border-l-white border-b-[10px] border-b-transparent ml-1"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">{vid.duration} min</span>
                                        </div>
                                        <h3 className="font-bold text-white leading-snug mb-1 group-hover:text-blue-400 transition-colors">{vid.title}</h3>
                                        <p className="text-xs text-gray-500">
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

