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
        totalScore: 0,
        testsTaken: 0,
        accuracy: 0,
        trend: "0%",
        isPositive: true
    });
    const [recentPerformance, setRecentPerformance] = useState<{ title: string; score: number; total: number }[]>([]);
    const [loading, setLoading] = useState(true);
    const [subjectInsights, setSubjectInsights] = useState<{
        strongest: { subject: string; accuracy: number }[];
        weakest: { subject: string; accuracy: number }[];
    }>({ strongest: [], weakest: [] });

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

                    // Calculate Global Accuracy
                    const totalPercentage = userResults.reduce((acc, curr) => {
                        const maxScore = curr.totalQuestions * 4;
                        return acc + ((curr.score / maxScore) * 100);
                    }, 0);
                    const accuracy = totalPercentage / totalTests;

                    setStats({
                        totalScore: totalScore,
                        testsTaken: totalTests,
                        accuracy: Math.round(accuracy),
                        trend: "+5%",
                        isPositive: true
                    });

                    // --- Insights Calculation ---
                    // 1. Get Unique Test IDs
                    const uniqueTestIds = Array.from(new Set(userResults.map(r => r.testId)));

                    // 2. Fetch Test Details (specifically for Subject)
                    const testDetailsMap = new Map<string, Test>();
                    await Promise.all(uniqueTestIds.map(async (tid) => {
                        try {
                            const t = await getTestById(tid);
                            if (t) testDetailsMap.set(tid, t);
                        } catch (e) {
                            console.error(`Failed to fetch test ${tid}`, e);
                        }
                    }));

                    // 3. Aggregate Scores by Subject
                    const subjectStats = new Map<string, { totalScore: number; maxScore: number }>();

                    userResults.forEach(res => {
                        const test = testDetailsMap.get(res.testId);
                        const subject = test?.subject || "General";

                        const current = subjectStats.get(subject) || { totalScore: 0, maxScore: 0 };
                        current.totalScore += res.score;
                        current.maxScore += (res.totalQuestions * 4); // Assuming 4 marks per q
                        subjectStats.set(subject, current);
                    });

                    // 4. Calculate Accuracy per Subject
                    const subjectAccuracy = Array.from(subjectStats.entries()).map(([sub, data]) => ({
                        subject: sub,
                        accuracy: Math.round((data.totalScore / data.maxScore) * 100)
                    }));

                    // 5. Sort
                    subjectAccuracy.sort((a, b) => b.accuracy - a.accuracy);

                    // 6. Split into Strongest / Weakest
                    // If less than 3 subjects, show them in strongest.
                    // Weakest are those below 60% or just the bottom list if enough data.
                    const strongest = subjectAccuracy.slice(0, 3);
                    const weakest = subjectAccuracy.length > 3 ? subjectAccuracy.slice(-3).reverse() : [];

                    // If we have few subjects but low scores, put them in weakest? 
                    // For UI simplicity: Just Top 3 and Bottom 3 (if distinct).

                    setSubjectInsights({ strongest, weakest });


                    // Prepare Graph Data
                    const recentResults = userResults.slice(0, 5);
                    const graphData = recentResults.map(res => {
                        const test = testDetailsMap.get(res.testId);
                        return {
                            title: test?.title || `Test`,
                            score: res.score,
                            total: res.totalQuestions * 4
                        };
                    });
                    setRecentPerformance(graphData.reverse());
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
        { label: "Total Score", value: `${stats.totalScore}`, trend: stats.trend, positive: stats.isPositive },
        { label: "Tests Taken", value: `${stats.testsTaken}`, trend: "Lifetime", positive: true },
        { label: "Class Rank", value: "N/A", trend: "Coming Soon", positive: true },
        { label: "Accuracy", value: `${stats.accuracy}%`, trend: "Global Avg", positive: true },
    ];

    const radius = 64;
    const circumference = 2 * Math.PI * radius;
    const goalPercentage = Math.min(100, Math.max(0, stats.accuracy));
    const strokeDashoffset = circumference - (goalPercentage / 100) * circumference;

    return (
        <div className="space-y-10 animate-in fade-in duration-500 pb-10">
            <div>
                <h1 className="text-3xl font-black text-black uppercase tracking-tight italic">Performance Analytics</h1>
                <p className="text-black font-bold opacity-60">Deep dive into your strengths and weaknesses</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, idx) => (
                    <Card key={idx} className="p-8 border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(255,208,47,1)] transition-all transform hover:-translate-y-1">
                        <div className="text-xs font-black text-black mb-3 uppercase tracking-widest opacity-40">{stat.label}</div>
                        <div className="text-4xl font-black text-black mb-4 uppercase italic">{stat.value}</div>
                        <div className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border-2 border-black inline-block ${stat.positive ? 'bg-primary text-black' : 'bg-black text-white'}`}>
                            {stat.trend}
                        </div>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Main Graph Area */}
                <div className="lg:col-span-2 space-y-10">
                    <section>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-8 w-2 bg-primary rounded-full"></div>
                            <h2 className="text-xl font-black text-black uppercase tracking-widest italic">Subject Tracking</h2>
                        </div>
                        <Card className="p-10 min-h-[400px] flex items-end justify-between gap-6 border-4 border-black bg-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] overflow-x-auto">
                            {recentPerformance.length === 0 ? (
                                <div className="w-full h-full flex flex-col items-center justify-center text-black/20 font-black uppercase tracking-widest py-20 italic">
                                    <div className="text-6xl mb-4 opacity-10">📈</div>
                                    No data points yet
                                </div>
                            ) : (
                                recentPerformance.map((data, idx) => (
                                    <div key={idx} className="w-full flex flex-col items-center gap-4 group min-w-[80px]">
                                        <div className="relative w-full bg-black/5 rounded-t-2xl overflow-hidden h-64 flex items-end border-2 border-black/5 group-hover:bg-primary/5 transition-colors">
                                            <div
                                                className="w-full bg-black group-hover:bg-primary transition-all duration-700 rounded-t-xl relative border-t-2 border-black"
                                                style={{ height: `${(data.score / data.total) * 100}%` }}
                                            >
                                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-primary text-[10px] font-black px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-xl whitespace-nowrap border border-black z-20">
                                                    {data.score} / {data.total}
                                                </div>
                                            </div>
                                        </div>
                                        <span className="text-[10px] font-black text-black uppercase tracking-tighter truncate w-full text-center italic" title={data.title}>
                                            {data.title.substring(0, 15)}
                                        </span>
                                    </div>
                                ))
                            )}
                        </Card>
                    </section>

                    <section>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-8 w-2 bg-black rounded-full"></div>
                            <h2 className="text-xl font-black text-black uppercase tracking-widest italic">Recent Logs</h2>
                        </div>
                        <div className="space-y-4">
                            {results.slice(0, 5).map((res, i) => (
                                <div key={i} className="flex items-center justify-between p-6 rounded-3xl bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(255,208,47,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all group">
                                    <div className="flex items-center gap-6">
                                        <div className="w-14 h-14 rounded-2xl bg-black flex items-center justify-center text-primary text-2xl border-2 border-black group-hover:bg-primary group-hover:text-black transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                            📊
                                        </div>
                                        <div>
                                            <h4 className="font-black text-black text-lg uppercase italic tracking-tight">Test Attempt</h4>
                                            <p className="text-xs text-black font-bold uppercase tracking-widest opacity-40">
                                                {new Date(res.completedAt).toLocaleDateString()} • Scored {res.score}/{res.totalQuestions * 4}
                                            </p>
                                        </div>
                                    </div>
                                    <button className="text-[10px] font-black uppercase tracking-widest text-black border-2 border-black px-6 py-2.5 rounded-xl hover:bg-black hover:text-white transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                        ANALYSIS
                                    </button>
                                </div>
                            ))}
                            {results.length === 0 && (
                                <div className="p-10 text-center border-4 border-dashed border-black rounded-3xl text-black font-black uppercase opacity-20 italic">
                                    No logs recorded
                                </div>
                            )}
                        </div>
                    </section>
                </div>

                <div className="space-y-10">
                    <section>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-8 w-2 bg-black rounded-full"></div>
                            <h2 className="text-xl font-black text-black uppercase tracking-widest italic">Insights</h2>
                        </div>
                        <Card className="p-0 overflow-hidden border-4 border-black bg-white rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                            <div className="p-6 border-b-4 border-black bg-primary/10">
                                <h4 className="font-black text-black uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
                                    <span className="text-lg">🔥</span> Strongest Topics
                                </h4>
                                {subjectInsights.strongest.length === 0 ? (
                                    <div className="text-xs font-bold text-black/40 uppercase tracking-widest text-center py-4">Not enough data</div>
                                ) : (
                                    <div className="space-y-4">
                                        {subjectInsights.strongest.map(t => (
                                            <div key={t.subject} className="space-y-2">
                                                <div className="flex justify-between text-[10px] font-black uppercase tracking-tighter">
                                                    <span className="text-black">{t.subject}</span>
                                                    <span className="text-black">{t.accuracy}%</span>
                                                </div>
                                                <div className="w-full h-3 bg-black/5 rounded-full overflow-hidden border border-black/10">
                                                    <div className="h-full bg-black rounded-full transition-all duration-1000" style={{ width: `${t.accuracy}%` }}></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="p-6 bg-white">
                                <h4 className="font-black text-black uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
                                    <span className="text-lg">⚡</span> Focus Needed
                                </h4>
                                {subjectInsights.weakest.length === 0 ? (
                                    <div className="text-xs font-bold text-black/40 uppercase tracking-widest text-center py-4">Keep practicing!</div>
                                ) : (
                                    <div className="space-y-4">
                                        {subjectInsights.weakest.map(t => (
                                            <div key={t.subject} className="space-y-2">
                                                <div className="flex justify-between text-[10px] font-black uppercase tracking-tighter">
                                                    <span className="text-black">{t.subject}</span>
                                                    <span className="text-black">{t.accuracy}%</span>
                                                </div>
                                                <div className="w-full h-3 bg-black/5 rounded-full overflow-hidden border border-black/10">
                                                    <div className="h-full bg-primary rounded-full border-r border-black transition-all duration-1000" style={{ width: `${t.accuracy}%` }}></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </Card>
                    </section>

                    <div className="p-8 rounded-3xl bg-primary border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] text-center relative overflow-hidden group">
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-white opacity-10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                        <h3 className="font-black text-black text-xl uppercase tracking-tighter italic mb-6">Goal Achievement</h3>
                        <div className="relative w-36 h-36 mx-auto mb-6 flex items-center justify-center">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle cx="72" cy="72" r={radius} stroke="currentColor" strokeWidth="12" fill="transparent" className="text-black/5" />
                                <circle
                                    cx="72"
                                    cy="72"
                                    r={radius}
                                    stroke="currentColor"
                                    strokeWidth="12"
                                    fill="transparent"
                                    className="text-black transition-all duration-1000 ease-out"
                                    strokeDasharray={circumference}
                                    strokeDashoffset={strokeDashoffset}
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div className="absolute flex flex-col items-center">
                                <span className="text-4xl font-black text-black">{stats.accuracy}%</span>
                                <span className="text-[10px] uppercase font-black tracking-widest text-black opacity-40">ACCURACY</span>
                            </div>
                        </div>
                        <p className="text-xs text-black font-black uppercase tracking-widest opacity-60 leading-relaxed italic">
                            {stats.accuracy > 70 ? "Excellent work! Keep it up." : "Consistency is key. Keep pushing!"}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
