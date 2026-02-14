"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getLeaderboardSummary, getUserTestResults, getTestById } from "@/lib/appwrite-db";
import SubjectRadar from "./SubjectRadar";
import TimeAnalysis from "./TimeAnalysis";
import RankPredictor from "./RankPredictor";
import { Test, TestResult } from "@/types";

interface ProAnalyticsDashboardProps {
    userResults: TestResult[];
    testDetailsMap: Map<string, Test>;
    subjectInsights: {
        allSubjects: { subject: string; accuracy: number }[];
    };
    isPremium: boolean;
}

export default function ProAnalyticsDashboard({ userResults, testDetailsMap, subjectInsights, isPremium }: ProAnalyticsDashboardProps) {
    const { user } = useAuth();
    const [userStanding, setUserStanding] = useState<any>(null);

    useEffect(() => {
        const fetchStanding = async () => {
            if (user?.$id) {
                const summary = await getLeaderboardSummary(user.$id);
                setUserStanding(summary.userStanding);
            }
        };
        fetchStanding();
    }, [user, userResults]); // Re-fetch if results change

    if (!isPremium) {
        // Locked State Visualization is handled in parent, this component usually won't mount or will show blurred
        return null;
    }

    return (
        <section className="animate-in fade-in slide-in-from-bottom-5 duration-700">
            <div className="flex items-center gap-3 mb-8">
                <span className="text-3xl">🚀</span>
                <div>
                    <h2 className="text-3xl font-black text-black uppercase tracking-tighter italic">Pro Insights</h2>
                    <p className="text-sm text-black/60 font-bold uppercase tracking-widest">Deep dive into your performance metrics</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* 1. Rank Predictor */}
                <div className="lg:col-span-1 h-full min-h-[400px]">
                    <RankPredictor userStanding={userStanding} />
                </div>

                {/* 2. Weakness Heatmap (Radar Chart) */}
                <div className="lg:col-span-2 min-h-[400px]">
                    <SubjectRadar subjectData={subjectInsights.allSubjects} />
                </div>

                {/* 3. Time Analysis */}
                <div className="lg:col-span-3 min-h-[400px]">
                    <TimeAnalysis results={userResults} testDetailsMap={testDetailsMap} />
                </div>
            </div>
        </section>
    );
}
