"use client";

import { Card } from "@/components/ui/Card";
import { Wand2 } from "lucide-react";

interface RankPredictorProps {
    userStanding: {
        rank: number;
        percentile: number;
        totalParticipants: number;
        testsAttempted: number;
        totalScore: number;
    } | null;
}

export default function RankPredictor({ userStanding }: RankPredictorProps) {
    if (!userStanding || userStanding.testsAttempted < 3) {
        return (
            <Card className="p-6 md:p-8 border-4 border-black bg-primary shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] h-full flex flex-col items-center justify-center text-center">
                <div className="mb-4"><Wand2 size={40} className="text-black/40 mx-auto" /></div>
                <h3 className="text-xl font-black text-black uppercase italic mb-2">Rank Predictor</h3>
                <p className="text-xs font-bold text-black/60 uppercase tracking-widest max-w-[200px]">
                    Attempt at least 3 tests to unlock your predicted All India Rank.
                </p>
            </Card>
        );
    }

    const { percentile, rank, totalParticipants } = userStanding;

    // Simulate "Predicted AIR" based on percentile
    // Assumption: ~5000 students might appear for NCET (Just a number for projection)
    const hypotheticalTotalStudents = 5000;
    const predictedRank = Math.max(1, Math.floor(hypotheticalTotalStudents * ((100 - percentile) / 100)));

    return (
        <Card className="p-6 md:p-8 border-4 border-black bg-primary shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] h-full relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute -right-10 -bottom-10 text-[150px] opacity-10 font-black select-none pointer-events-none">
                #1
            </div>

            <div className="flex items-center gap-3 mb-6 relative z-10">
                <div className="h-8 w-2 bg-black rounded-full"></div>
                <div>
                    <h2 className="text-xl font-black text-black uppercase tracking-widest italic">Rank Predictor</h2>
                    <p className="text-xs text-black/60 font-bold uppercase tracking-widest">Based on current performance</p>
                </div>
            </div>

            <div className="space-y-6 relative z-10">
                <div className="flex items-end gap-2">
                    <span className="text-6xl font-black text-black tracking-tighter leading-none">
                        {predictedRank}
                    </span>
                    <span className="text-sm font-bold text-black/60 uppercase tracking-widest mb-1.5">
                        / {hypotheticalTotalStudents}
                    </span>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between text-xs font-black text-black uppercase tracking-widest">
                        <span>Current Percentile</span>
                        <span>{percentile}%</span>
                    </div>
                    <div className="w-full h-4 bg-white/40 border-2 border-black rounded-full overflow-hidden p-0.5">
                        <div
                            className="h-full bg-black rounded-full transition-all duration-1000"
                            style={{ width: `${percentile}%` }}
                        ></div>
                    </div>
                </div>

                <div className="p-4 bg-black/5 rounded-xl border-2 border-black/10">
                    <p className="text-[10px] font-bold text-black leading-relaxed uppercase tracking-wide">
                        You are currently performing better than <span className="font-black text-black bg-white px-1 border border-black rounded mx-0.5">{Math.floor(percentile)}%</span> of students.
                        Maintain this consistency to secure a top rank!
                    </p>
                </div>

                <div className="text-[10px] text-black/40 font-bold uppercase tracking-widest text-center mt-2">
                    * Projection based on platform data
                </div>
            </div>
        </Card>
    );
}
