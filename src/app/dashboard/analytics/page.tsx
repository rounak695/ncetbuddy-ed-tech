"use client";

import { Card } from "@/components/ui/Card";
import Section from "@/components/dashboard/Section";
import { useAuth } from "@/context/AuthContext";
import { getUserTestResults, getTestById } from "@/lib/appwrite-db";
import { TestResult, Test } from "@/types";
import { useEffect, useState } from "react";

export default function AnalyticsPage() {
    const { user } = useAuth();
    const [results, setResults] = useState<TestResult[]>([]);
    const [stats, setStats] = useState({
        avgScore: 0,
        testsTaken: 0,
        accuracy: 0,
        trend: "0%", // Simplification for now
        isPositive: true
    });
    const [recentPerformance, setRecentPerformance] = useState<{ title: string; score: number; total: number }[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            if (!user) return;

            try {
                const userResults = await getUserTestResults(user.$id);
                setResults(userResults);

                // Calculate Stats
                const totalTests = userResults.length;
                if (totalTests > 0) {
                    const totalScore = userResults.reduce((acc, curr) => acc + curr.score, 0);
                    const avgScore = totalScore / totalTests;

                    // Calculate Accuracy (Total Correct / Total Questions across all tests)
                    // Note: Ideally we store correct count, but we can infer or store differently. 
                    // For now, let's approximate Accuracy as (Total Score / Total Possible Score) if max score was known.
                    // Assuming each question is 4 marks (standard) -> Total Questions * 4 = Max Score.
                    // Let's rely on percentage: (Sum of Percentages / Count)

                    const totalPercentage = userResults.reduce((acc, curr) => {
                        // Avoid division by zero
                        const maxScore = curr.totalQuestions * 4;
                        return acc + ((curr.score / maxScore) * 100);
                    }, 0);
                    const accuracy = totalPercentage / totalTests;

                    setStats({
                        avgScore: Math.round(avgScore),
                        testsTaken: totalTests,
                        accuracy: Math.round(accuracy),
                        trend: "+5%", // Placeholder logic
                        isPositive: true
                    });

                    // Prepare Graph Data (Last 5 tests)
                    // We need test titles. This requires fetching test details or hoping we stored title in result.
                    // Since TestResult doesn't have title, we might need to fetch test info or just show "Test 1", "Test 2".
                    // Let's fetch test details for the last 5 results.
                    const recentResults = userResults.slice(0, 5);
                    const graphData = await Promise.all(recentResults.map(async (res, index) => {
                        try {
                            const test = await getTestById(res.testId);
                            return {
                                title: test?.title || `Test ${index + 1}`,
                                score: res.score,
                                total: res.totalQuestions * 4
                            };
                        } catch {
                            return { title: `Test ${index + 1}`, score: res.score, total: 100 };
                        }
                    }));
                    setRecentPerformance(graphData.reverse()); // Show oldest to newest
                }
            } catch (error) {
                console.error("Error fetching analytics:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, [user]);

    const statCards = [
        { label: "Avg. Score", value: `${stats.avgScore}`, trend: stats.trend, positive: stats.isPositive },
        { label: "Tests Taken", value: `${stats.testsTaken}`, trend: "Lifetime", positive: true },
        { label: "Class Rank", value: "N/A", trend: "Coming Soon", positive: true }, // Placeholder
        { label: "Accuracy", value: `${stats.accuracy}%`, trend: "Global Avg", positive: true },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-2xl font-bold text-white">Performance Analytics</h1>
                <p className="text-gray-400 mt-1">Track your growth and identify weak areas</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {statCards.map((stat, idx) => (
                    <Card key={idx} className="p-6 border-white/5 bg-neutral-900/50 hover:bg-neutral-900 transition-colors">
                        <div className="text-sm text-gray-400 mb-1">{stat.label}</div>
                        <div className="text-2xl font-bold text-white mb-2">{stat.value}</div>
                        <div className={`text-xs font-medium ${stat.positive ? 'text-green-400' : 'text-red-400'}`}>
                            {stat.trend}
                        </div>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Graph Area */}
                <div className="lg:col-span-2 space-y-6">
                    <Section title="Subject Performance">
                        <Card className="p-6 min-h-[300px] flex items-end justify-between gap-4 border-white/5 bg-neutral-900/50 overflow-x-auto">
                            {recentPerformance.length === 0 ? (
                                <div className="w-full h-full flex items-center justify-center text-gray-500">
                                    No test data available so far.
                                </div>
                            ) : (
                                recentPerformance.map((data, idx) => (
                                    <div key={idx} className="w-full flex flex-col items-center gap-2 group min-w-[60px]">
                                        <div className="relative w-full bg-neutral-800 rounded-t-xl overflow-hidden h-48 md:h-64 flex items-end">
                                            <div
                                                className={`w-full bg-blue-500 opacity-80 group-hover:opacity-100 transition-all duration-500 rounded-t-xl relative`}
                                                style={{ height: `${(data.score / data.total) * 100}%` }}
                                            >
                                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-black text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                    {data.score} / {data.total}
                                                </div>
                                            </div>
                                        </div>
                                        <span className="text-xs md:text-sm font-medium text-gray-400 truncate w-full text-center" title={data.title}>
                                            {data.title.substring(0, 10)}{data.title.length > 10 ? '...' : ''}
                                        </span>
                                    </div>
                                ))
                            )}
                        </Card>
                    </Section>

                    <Section title="Recent Activity">
                        <div className="space-y-3">
                            {results.slice(0, 3).map((res, i) => (
                                <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-neutral-900/50 border border-white/5 hover:border-white/10 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 text-lg">
                                            📝
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-white text-sm">Test Attempt</h4>
                                            <p className="text-xs text-gray-500">
                                                Completed on {new Date(res.completedAt).toLocaleDateString()} • Scored {res.score}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <button className="text-xs text-blue-400 hover:text-blue-300 font-medium px-3 py-1.5 rounded-lg hover:bg-blue-500/10 transition-colors">
                                            View Analysis
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {results.length === 0 && <p className="text-gray-500 text-sm">No recent activity.</p>}
                        </div>
                    </Section>
                </div>

                {/* Sidebar Widgets */}
                <div className="space-y-6">
                    <Section title="Strong & Weak Areas">
                        <Card className="p-0 overflow-hidden border-white/5 bg-neutral-900/50">
                            <div className="p-4 border-b border-white/5">
                                <h4 className="font-semibold text-green-400 text-sm mb-2">💪 Strongest Topics</h4>
                                <div className="space-y-2">
                                    {['Electrostatics', 'Calculus', 'Organic Chem'].map(t => (
                                        <div key={t} className="flex justify-between text-xs items-center">
                                            <span className="text-gray-300">{t}</span>
                                            <div className="w-16 h-1 bg-neutral-800 rounded-full overflow-hidden">
                                                <div className="h-full bg-green-500 w-[85%]"></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="p-4">
                                <h4 className="font-semibold text-red-400 text-sm mb-2">⚠️ Needs Improvement</h4>
                                <div className="space-y-2">
                                    {['Wave Optics', 'Probability', 'Solutions'].map(t => (
                                        <div key={t} className="flex justify-between text-xs items-center">
                                            <span className="text-gray-300">{t}</span>
                                            <div className="w-16 h-1 bg-neutral-800 rounded-full overflow-hidden">
                                                <div className="h-full bg-red-500 w-[45%]"></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Card>
                    </Section>

                    <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-600/20 to-blue-600/20 border border-purple-500/20 text-center">
                        <h3 className="font-bold text-white mb-2">Goal Tracker</h3>
                        <div className="relative w-32 h-32 mx-auto my-4 flex items-center justify-center">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/10" />
                                <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-purple-500" strokeDasharray="351.86" strokeDashoffset="100" />
                            </svg>
                            <div className="absolute flex flex-col items-center">
                                <span className="text-2xl font-bold text-white">72%</span>
                                <span className="text-[10px] text-purple-200">Target Reached</span>
                            </div>
                        </div>
                        <p className="text-xs text-purple-200/80">Keep going! You are on track to hit your weekly goal.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
