
"use client";

import { useEffect, useState } from "react";
import { getTestLeaderboard, TestLeaderboardEntry } from "@/lib/appwrite-db";
import { Card } from "@/components/ui/Card";

interface TestLeaderboardProps {
    testId: string;
    currentUserId?: string;
}

export const TestLeaderboard: React.FC<TestLeaderboardProps> = ({ testId, currentUserId }) => {
    const [leaderboard, setLeaderboard] = useState<TestLeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [userRank, setUserRank] = useState<TestLeaderboardEntry | null>(null);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            if (!testId) return;
            setLoading(true);
            try {
                const { leaderboard: data, userRank: rank } = await getTestLeaderboard(testId, currentUserId);
                setLeaderboard(data);
                setUserRank(rank);
            } catch (error) {
                console.error("Error loading test leaderboard:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, [testId, currentUserId]);

    if (loading) {
        return (
            <div className="w-full h-64 flex items-center justify-center bg-gray-50 rounded-lg border-2 border-gray-200">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (leaderboard.length === 0) {
        return (
            <div className="w-full text-center p-8 bg-gray-50 rounded-lg border-2 border-gray-200">
                <p className="text-gray-500 font-bold">No results yet. Be the first to take this test!</p>
            </div>
        );
    }

    return (
        <div className="w-full space-y-4">
            <h2 className="text-2xl font-black text-black flex items-center gap-2">
                🏆 Leaderboard
                <span className="text-sm font-bold bg-primary px-2 py-1 rounded-full text-black">
                    {leaderboard.length} Participants
                </span>
            </h2>

            {userRank && (
                <Card className="bg-blue-50 border-blue-200 border-2 p-4 flex items-center justify-between mb-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)]">
                    <div className="flex items-center gap-4">
                        <div className="flex flex-col items-center justify-center w-12 h-12 bg-white rounded-full border-2 border-blue-300 font-black text-blue-600 text-lg">
                            #{userRank.rank}
                        </div>
                        <div>
                            <p className="font-bold text-black text-lg">Your Rank</p>
                            <p className="text-xs text-gray-600 font-bold uppercase">
                                Top {Math.round((userRank.rank / leaderboard.length) * 100)}%
                            </p>
                        </div>
                    </div>
                </Card>
            )}

            <div className="bg-white border-2 border-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
                <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-100 border-b-2 border-black sticky top-0 z-10">
                            <tr>
                                <th className="p-4 font-black text-xs md:text-sm uppercase tracking-wide text-gray-600">Rank</th>
                                <th className="p-4 font-black text-xs md:text-sm uppercase tracking-wide text-gray-600">Name</th>
                                <th className="p-4 font-black text-xs md:text-sm uppercase tracking-wide text-gray-600 text-right">Score</th>
                                <th className="p-4 font-black text-xs md:text-sm uppercase tracking-wide text-gray-600 text-right hidden sm:table-cell">Accuracy</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y-2 divide-gray-100">
                            {leaderboard.map((entry) => (
                                <tr
                                    key={entry.userId}
                                    className={`
                                        ${entry.isCurrentUser ? 'bg-blue-50' : 'hover:bg-gray-50'} 
                                        transition-colors
                                    `}
                                >
                                    <td className="p-4 whitespace-nowrap">
                                        <div className={`
                                            w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm
                                            ${entry.rank === 1 ? 'bg-yellow-100 text-yellow-700 border-2 border-yellow-300' :
                                                entry.rank === 2 ? 'bg-gray-100 text-gray-700 border-2 border-gray-300' :
                                                    entry.rank === 3 ? 'bg-orange-100 text-orange-700 border-2 border-orange-300' :
                                                        'text-gray-500'}
                                        `}>
                                            {entry.rank <= 3 ? ['🥇', '🥈', '🥉'][entry.rank - 1] : entry.rank}
                                        </div>
                                    </td>
                                    <td className="p-4 font-bold text-black flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-gray-300 flex items-center justify-center text-xs font-bold text-gray-500">
                                            {entry.userName.charAt(0).toUpperCase()}
                                        </div>
                                        <span className={entry.isCurrentUser ? 'text-blue-600' : ''}>
                                            {entry.userName} {entry.isCurrentUser && '(You)'}
                                        </span>
                                    </td>
                                    <td className="p-4 font-black text-black text-right">
                                        {entry.score}
                                    </td>
                                    <td className="p-4 font-bold text-gray-600 text-right hidden sm:table-cell">
                                        {Math.round(entry.accuracy)}%
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
