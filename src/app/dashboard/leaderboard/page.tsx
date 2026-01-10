"use client";

import { Card } from "@/components/ui/Card";
import { useEffect, useState } from "react";
import { getLeaderboard } from "@/lib/appwrite-db";
import { UserProfile } from "@/types";
import { useAuth } from "@/context/AuthContext";

export default function LeaderboardPage() {
    const { user } = useAuth();
    const [leaderboard, setLeaderboard] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const data = await getLeaderboard(50); // Fetch top 50
                setLeaderboard(data);
            } catch (error) {
                console.error("Failed to fetch leaderboard:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, []);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div>
                <h1 className="text-2xl font-bold text-white">Leaderboard</h1>
                <p className="text-gray-400 mt-1">Top performers across the platform</p>
            </div>

            <Card className="overflow-hidden border-white/5 bg-neutral-900/50">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/5">
                                <th className="p-4 text-sm font-medium text-gray-400">Rank</th>
                                <th className="p-4 text-sm font-medium text-gray-400">Student</th>
                                <th className="p-4 text-sm font-medium text-gray-400">Total Score (XP)</th>
                                <th className="p-4 text-sm font-medium text-gray-400 hidden md:table-cell">Tests Attempted</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-gray-500">
                                        Loading leaderboard...
                                    </td>
                                </tr>
                            ) : leaderboard.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-gray-500">
                                        No data available yet. Be the first to take a test!
                                    </td>
                                </tr>
                            ) : (
                                leaderboard.map((profile, index) => {
                                    const isCurrentUser = user?.$id === profile.uid;
                                    const rank = index + 1;
                                    let rankColor = "text-gray-300";
                                    if (rank === 1) rankColor = "text-yellow-400";
                                    else if (rank === 2) rankColor = "text-gray-300";
                                    else if (rank === 3) rankColor = "text-amber-600";

                                    return (
                                        <tr
                                            key={profile.uid}
                                            className={`border-b border-white/5 hover:bg-white/5 transition-colors ${isCurrentUser ? 'bg-blue-500/10' : ''}`}
                                        >
                                            <td className={`p-4 font-bold ${rankColor}`}>
                                                #{rank}
                                            </td>
                                            <td className="p-4 text-white font-medium">
                                                {profile.displayName || "Anonymous User"}
                                                {isCurrentUser && <span className="ml-2 text-xs text-blue-400">(You)</span>}
                                            </td>
                                            <td className="p-4 text-white font-bold">
                                                {profile.totalScore?.toLocaleString() || 0}
                                            </td>
                                            <td className="p-4 text-gray-400 hidden md:table-cell">
                                                {profile.stats?.testsAttempted || 0}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
