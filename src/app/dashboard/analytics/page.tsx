"use client";
// Force rebuild

import { Card } from "@/components/ui/Card";
import Section from "@/components/dashboard/Section";
import { useAuth } from "@/context/AuthContext";

import { useEffect, useState, useMemo } from "react";
import { getUserTestResults, getTestById, getUserProfile, getEducator } from "@/lib/appwrite-db";
import { TestResult, Test, UserProfile, Educator } from "@/types";
import Link from "next/link";

export default function AnalyticsPage() {
    const { user } = useAuth();
    const [results, setResults] = useState<TestResult[]>([]);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [educator, setEducator] = useState<Educator | null>(null);

    // New Stats State
    const [stats, setStats] = useState({
        performanceIndex: 0,
        seriousnessScore: 0, // tests taken
        educatorRank: "N/A",
        trueAccuracy: 0,
        last3Accuracy: 0
    });

    const [recentPerformance, setRecentPerformance] = useState<{ title: string; score: number; total: number }[]>([]);
    const [loading, setLoading] = useState(true);

    // Insights State
    const [subjectInsights, setSubjectInsights] = useState<{
        strongest: { subject: string; accuracy: number }[];
        weakest: { subject: string; accuracy: number }[];
        allSubjects: { subject: string; accuracy: number }[]; // For trend tracking
    }>({ strongest: [], weakest: [], allSubjects: [] });

    // Next Action State
    const [nextAction, setNextAction] = useState<{ title: string; subtitle: string }>({
        title: "Start Your Journey",
        subtitle: "Attempt your first mock test to unlock insights"
    });

    useEffect(() => {
        const fetchAnalytics = async () => {
            if (!user) return;

            try {

                // 1. Fetch User Data & Educator Context
                const profile = await getUserProfile(user.$id);
                setUserProfile(profile);

                if (profile?.enrolledEducatorId) {
                    try {
                        const edu = await getEducator(profile.enrolledEducatorId);
                        setEducator(edu);
                    } catch (e) {
                        console.log("No educator found");
                    }
                }

                // 2. Fetch Results
                const userResults = await getUserTestResults(user.$id);
                setResults(userResults);

                const totalTests = userResults.length;

                // --- Calculate Metrics ---

                // A. Performance Index: (Average Score % + Consistency Factor) / 2
                // Simplified: Just Average Score % for now, but label it Performance Index
                let globalAccuracy = 0;
                let last3Accuracy = 0;
                let performanceIndex = 0;

                if (totalTests > 0) {
                    const totalPercentage = userResults.reduce((acc, curr) => {
                        const maxScore = curr.totalQuestions * 4;
                        return acc + ((curr.score / maxScore) * 100);
                    }, 0);
                    globalAccuracy = Math.round(totalPercentage / totalTests);

                    // True Accuracy (Last 3 Tests)
                    const last3 = userResults.slice(0, 3);
                    const last3TotalPercentage = last3.reduce((acc, curr) => {
                        const maxScore = curr.totalQuestions * 4;
                        return acc + ((curr.score / maxScore) * 100);
                    }, 0);
                    last3Accuracy = Math.round(last3TotalPercentage / last3.length);

                    // Performance Index Logic
                    // Base it on Global Accuracy but cap/boost based on consistency?
                    // Let's keep it simple: It's the weighted average of global (40%) and recent (60%)
                    performanceIndex = Math.round((globalAccuracy * 0.4) + (last3Accuracy * 0.6));
                }

                setStats({
                    performanceIndex: totalTests > 0 ? performanceIndex : 0,
                    seriousnessScore: totalTests,
                    educatorRank: "N/A", // Infrastructure placeholder
                    trueAccuracy: globalAccuracy,
                    last3Accuracy: last3Accuracy
                });

                // Helper for Next Action
                if (totalTests === 0) {
                    setNextAction({
                        title: "Start Your Journey",
                        subtitle: "Attempt your first mock test to unlock analytics"
                    });
                } else if (last3Accuracy < 60) {
                    setNextAction({
                        title: "Action Required: Revise Basics",
                        subtitle: "High error rate detected. Review your weakest subject notes."
                    });
                } else if (last3Accuracy >= 90) {
                    setNextAction({
                        title: "Push for Perfection",
                        subtitle: "Excellent accuracy! Try a speed-focused sectional test."
                    });
                } else {
                    setNextAction({
                        title: "Build Consistency",
                        subtitle: "Maintain your streak. Attempt a full-length mock this weekend."
                    });
                }

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
                const strongest = subjectAccuracy.slice(0, 2); // Show top 2
                const weakest = subjectAccuracy.length > 2 ? subjectAccuracy.slice(-2).reverse() : [];

                // Adjust Next Action based on Weakest Topic if actionable
                if (totalTests > 0 && last3Accuracy < 60 && weakest.length > 0) {
                    setNextAction({
                        title: `Revise ${weakest[0].subject}`,
                        subtitle: "You made frequent mistakes in basic concepts. Review notes and try again."
                    });
                }

                setSubjectInsights({ strongest, weakest, allSubjects: subjectAccuracy });


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

            } catch (error) {
                console.error("Error fetching analytics:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, [user]);

    const statCards = [
        { label: "Overall Performance", value: stats.performanceIndex > 0 ? `${stats.performanceIndex}/100` : "N/A", subtext: stats.performanceIndex > 0 ? "Based on accuracy & practice" : "Not enough data yet", positive: true },
        { label: "Practice Consistency", value: `${stats.seriousnessScore} / 12`, subtext: "Tests attempted", positive: true },
        { label: "Class Rank", value: stats.educatorRank, subtext: "Among students", positive: true },
        { label: "Accuracy Rate", value: `${stats.trueAccuracy}%`, subtext: `Recent performance: ${stats.last3Accuracy}%`, positive: true },
    ];

    const radius = 64;
    const circumference = 2 * Math.PI * radius;
    const goalPercentage = Math.min(100, Math.max(0, stats.trueAccuracy));
    const strokeDashoffset = circumference - (goalPercentage / 100) * circumference;

    return (
        <div className="space-y-10 animate-in fade-in duration-500 pb-10">
            <div>
                <h1 className="text-3xl font-black text-black uppercase tracking-tight italic">Performance Overview</h1>
                <p className="text-sm md:text-base text-black font-bold opacity-60 mt-1 uppercase tracking-wider">
                    {educator ? `${educator.name} • NCET Preparation` : "Practice Mode • NCET Preparation"}
                </p>
                <p className="text-xs text-black/50 font-bold mt-2">
                    This report updates after every mock test.
                </p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, idx) => (
                    <Card key={idx} className="p-6 md:p-8 border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(255,208,47,1)] transition-all transform hover:-translate-y-1 flex flex-col justify-between h-full">
                        <div>
                            <div className="text-[10px] md:text-xs font-black text-black mb-3 uppercase tracking-widest opacity-40">{stat.label}</div>
                            <div className="text-2xl md:text-4xl font-black text-black mb-2 uppercase italic truncate" title={stat.value}>{stat.value}</div>
                        </div>
                        <div className={`text-[10px] font-bold uppercase tracking-widest inline-block text-black/40`}>
                            {stat.subtext}
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
                            <h2 className="text-xl font-black text-black uppercase tracking-widest italic">Subject-wise Performance</h2>
                        </div>
                        <Card className="p-10 min-h-[400px] flex items-end justify-between gap-6 border-4 border-black bg-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] overflow-x-auto">
                            {recentPerformance.length === 0 ? (
                                <div className="w-full h-full flex flex-col items-center justify-center text-black/20 font-black uppercase tracking-widest py-20 italic">
                                    <div className="text-6xl mb-4 opacity-10">📈</div>
                                    Attempt a mock test to unlock subject insights
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
                                                    {data.score} / {data.total} • Accuracy: {Math.round((data.score / data.total) * 100)}%
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-center gap-1 w-full text-center">
                                            <span className="text-[10px] font-black text-black uppercase tracking-tighter truncate w-full italic" title={data.title}>
                                                {data.title.substring(0, 15)}
                                            </span>
                                            {/* Logic to show trend arrow based on comparison with previous index? Hard to do in map without context, purely visual for now */}
                                            <span className="text-[10px] font-bold text-black/40">
                                                {Math.round((data.score / data.total) * 100)}%
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </Card>
                    </section>

                    <section>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-8 w-2 bg-black rounded-full"></div>
                            <h2 className="text-xl font-black text-black uppercase tracking-widest italic">Recent Exam Attempts</h2>
                        </div>
                        <div className="space-y-4">
                            {results.slice(0, 5).map((res, i) => (
                                <div key={i} className="flex flex-col md:flex-row md:items-center justify-between p-6 rounded-3xl bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(255,208,47,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all group gap-4">
                                    <div className="flex items-center gap-6">
                                        <div className="w-14 h-14 rounded-2xl bg-black flex items-center justify-center text-primary text-2xl border-2 border-black group-hover:bg-primary group-hover:text-black transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex-shrink-0">
                                            📜
                                        </div>
                                        <div>
                                            <h4 className="font-black text-black text-lg uppercase italic tracking-tight">{results.find(r => r.id === res.id) ? "Mock Test" : "Exam"}</h4>
                                            <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3 text-xs text-black font-bold uppercase tracking-widest opacity-60">
                                                <span>{new Date(res.completedAt * 1000).toLocaleDateString()}</span>
                                                <span className="hidden md:inline">•</span>
                                                <span>Scored {res.score}/{res.totalQuestions * 4}</span>
                                                <span className="hidden md:inline">•</span>
                                                <span className="text-green-600">Integrity: Clean</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button className="text-[10px] font-black uppercase tracking-widest text-black border-2 border-black px-6 py-2.5 rounded-xl hover:bg-black hover:text-white transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-center">
                                        VIEW REPORT
                                    </button>
                                </div>
                            ))}
                            {results.length === 0 && (
                                <div className="p-10 text-center border-4 border-dashed border-black rounded-3xl text-black font-black uppercase opacity-20 italic">
                                    No official exams attempted yet
                                </div>
                            )}
                        </div>
                    </section>
                </div>

                <div className="space-y-10">
                    <section>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-8 w-2 bg-black rounded-full"></div>
                            <h2 className="text-xl font-black text-black uppercase tracking-widest italic">Performance Insights</h2>
                        </div>
                        <Card className="p-0 overflow-hidden border-4 border-black bg-white rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                            <div className="p-6 border-b-4 border-black bg-primary/10">
                                <h4 className="font-black text-black uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
                                    <span className="text-lg">🔥</span> Your Strengths
                                </h4>
                                {subjectInsights.strongest.length === 0 ? (
                                    <div className="text-xs font-bold text-black/40 uppercase tracking-widest text-center py-4">Attempt more tests to unlock insights</div>
                                ) : (
                                    <div className="space-y-4">
                                        {subjectInsights.strongest.map(t => (
                                            <div key={t.subject} className="space-y-2">
                                                <div className="flex justify-between text-[10px] font-black uppercase tracking-tighter">
                                                    <span className="text-black">{t.subject}</span>
                                                    <span className="text-green-600 font-black">{t.accuracy}%</span>
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
                                    <span className="text-lg">⚡</span> Needs Improvement
                                </h4>
                                {subjectInsights.weakest.length === 0 && subjectInsights.strongest.length === 0 ? (
                                    <div className="text-xs font-bold text-black/40 uppercase tracking-widest text-center py-4">Detailed analysis arriving soon</div>
                                ) : subjectInsights.weakest.length === 0 ? (
                                    <div className="text-xs font-bold text-green-600 uppercase tracking-widest text-center py-4">All systems normal!</div>
                                ) : (
                                    <div className="space-y-4">
                                        {subjectInsights.weakest.map(t => (
                                            <div key={t.subject} className="space-y-2">
                                                <div className="flex justify-between text-[10px] font-black uppercase tracking-tighter">
                                                    <span className="text-black">{t.subject}</span>
                                                    <span className="text-red-600 font-black">{t.accuracy}%</span>
                                                </div>
                                                <div className="w-full h-3 bg-black/5 rounded-full overflow-hidden border border-black/10">
                                                    <div className="h-full bg-red-500 rounded-full border-r border-black transition-all duration-1000" style={{ width: `${t.accuracy}%` }}></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* NEXT ACTION BLOCK */}
                            <div className="p-6 border-t-4 border-black bg-black text-white">
                                <h4 className="font-black uppercase tracking-widest text-xs mb-2 text-primary">
                                    What to Do Next
                                </h4>
                                <div className="flex flex-col gap-1">
                                    <h5 className="font-black text-lg uppercase italic leading-tight">
                                        {nextAction.title}
                                    </h5>
                                    <p className="text-xs font-bold text-white/60">
                                        {nextAction.subtitle}
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </section>

                    <div className="p-8 rounded-3xl bg-primary border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] text-center relative overflow-hidden group">
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-white opacity-10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                        <h3 className="font-black text-black text-xl uppercase tracking-tighter italic mb-6">Daily Practice Progress</h3>
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
                                <span className="text-4xl font-black text-black">{stats.trueAccuracy}%</span>
                                <span className="text-[10px] uppercase font-black tracking-widest text-black opacity-40">ACCURACY</span>
                            </div>
                        </div>
                        <p className="text-xs text-black font-black uppercase tracking-widest opacity-60 leading-relaxed italic">
                            {educator ? "Daily target set by your educator" : "Set a daily goal to improve consistency"}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
