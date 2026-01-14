"use client";

import { Card } from "@/components/ui/Card";
import { useEffect, useState } from "react";
import { getLeaderboard } from "@/lib/appwrite-db";
import { UserProfile } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";

import client from "@/lib/appwrite"; // Import the client instance

export default function LeaderboardPage() {
    const { user } = useAuth();
    const [leaderboard, setLeaderboard] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchLeaderboard = async (isBackground = false) => {
        try {
            if (!isBackground) setLoading(true);
            const data = await getLeaderboard(50); // Fetch top 50
            setLeaderboard(data);
        } catch (error) {
            console.error("Failed to fetch leaderboard:", error);
        } finally {
            if (!isBackground) setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeaderboard();

        // Subscribe to realtime updates for the users collection
        let unsubscribe: (() => void) | undefined;
        try {
            // Subscribe to any changes in the 'users' collection
            const channel = `databases.${process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'ncet-buddy-db'}.collections.users.documents`;
            console.log("Subscribing to Leaderboard updates on channel:", channel);

            unsubscribe = client.subscribe(channel, (response) => {
                // Log payload for debugging
                console.log("Leaderboard Realtime Event:", response);

                // Refresh if any action happens on users collection
                const eventType = response.events[0];
                if (eventType.includes('.create') || eventType.includes('.update') || eventType.includes('.delete')) {
                    console.log("Refreshing leaderboard due to realtime update...");
                    fetchLeaderboard(true); // Background update
                }
            });
        } catch (error) {
            console.error("Failed to subscribe to leaderboard updates:", error);
        }

        return () => {
            if (unsubscribe) {
                try {
                    unsubscribe();
                } catch (error) {
                    // Suppress WebSocket closing errors during unmount as they are often harmless noise
                    console.debug("Error during leaderboard unsubscribe:", error);
                }
            }
        };
    }, []);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Leaderboard</h1>
                    <p className="text-foreground mt-1 font-medium">Top performers across the platform</p>
                </div>
                <Button
                    onClick={() => fetchLeaderboard(false)}
                    variant="outline"
                    className="border-2 border-black text-black hover:bg-black hover:text-white transition-all font-black text-xs uppercase tracking-widest"
                    disabled={loading}
                >
                    {loading ? "Syncing..." : "Refresh Rank"}
                </Button>
            </div>

            <Card className="overflow-hidden border-2 border-black bg-white shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b-2 border-black bg-primary">
                                <th className="p-4 text-sm font-bold text-black uppercase tracking-wider">Rank</th>
                                <th className="p-4 text-sm font-bold text-black uppercase tracking-wider">Student</th>
                                <th className="p-4 text-sm font-bold text-black uppercase tracking-wider">Total Score (XP)</th>
                                <th className="p-4 text-sm font-bold text-black uppercase tracking-wider hidden md:table-cell">Tests Attempted</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading && leaderboard.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-foreground font-bold">
                                        Loading leaderboard...
                                    </td>
                                </tr>
                            ) : leaderboard.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-foreground font-bold">
                                        No data available yet. Be the first to take a test!
                                    </td>
                                </tr>
                            ) : (
                                leaderboard.map((profile, index) => {
                                    const isCurrentUser = user?.$id === profile.uid;
                                    const rank = index + 1;
                                    let rankBadge = "text-foreground";
                                    if (rank === 1) rankBadge = "bg-primary text-black";
                                    else if (rank === 2) rankBadge = "bg-black text-white";
                                    else if (rank === 3) rankBadge = "bg-yellow-100 text-black";

                                    return (
                                        <tr
                                            key={profile.uid}
                                            className={`border-b border-border hover:bg-primary/5 transition-colors ${isCurrentUser ? 'bg-primary/20 shadow-inner' : ''}`}
                                        >
                                            <td className="p-4">
                                                <span className={`inline-flex items-center justify-center w-10 h-10 rounded-full font-black ${rankBadge}`}>
                                                    {rank}
                                                </span>
                                            </td>
                                            <td className="p-4 text-foreground font-black">
                                                {profile.displayName || "Anonymous User"}
                                                {isCurrentUser && <span className="ml-2 text-xs bg-black text-white px-2 py-0.5 rounded-full">(You)</span>}
                                            </td>
                                            <td className="p-4 text-foreground font-black">
                                                {profile.totalScore?.toLocaleString() || 0}
                                            </td>
                                            <td className="p-4 text-foreground font-bold hidden md:table-cell">
                                                {profile.testsAttempted || 0}
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
