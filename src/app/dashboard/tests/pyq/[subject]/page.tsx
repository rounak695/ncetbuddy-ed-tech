"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { getTests, getUserTestResults } from "@/lib/pocketbase-db";
import { Test, PYQSubject } from "@/types";
import { useAuth } from "@/context/AuthContext";

const SUBJECT_INFO: Record<PYQSubject, { label: string; icon: string; description: string }> = {
    'languages': { label: 'Languages', icon: '📝', description: 'English, Hindi & Regional Languages' },
    'humanities': { label: 'Humanities', icon: '📚', description: 'History, Geography & More' },
    'science': { label: 'Science', icon: '🔬', description: 'Physics, Chemistry, Biology, Mathematics' },
    'commerce': { label: 'Commerce', icon: '💼', description: 'Economics, Accounts & Business' },
    'non-domain': { label: 'Non-Domain', icon: '🎯', description: 'General Knowledge & Aptitude' }
};

export default function PYQSubjectPage() {
    const params = useParams();
    const paramSubject = params?.subject as string | undefined;
    const subject = (paramSubject || 'non-domain') as PYQSubject;
    const { user } = useAuth();
    const [tests, setTests] = useState<Test[]>([]);
    const [completedTests, setCompletedTests] = useState<Record<string, any>>({});
    const [loading, setLoading] = useState(true);

    const subjectInfo = SUBJECT_INFO[subject] || SUBJECT_INFO['non-domain'];

    useEffect(() => {
        const fetchTests = async () => {
            try {
                const data = await getTests();
                // Filter for PYQ tests of this specific subject
                // For backward compatibility: tests without testType are treated as PYQ (non-domain)
                const filteredTests = data.filter(t => {
                    const isPYQ = !t.testType || t.testType === 'pyq';
                    const isNRT = t.title.toUpperCase().includes('NRT');
                    const matchesSubject = t.pyqSubject === subject || (!t.pyqSubject && subject === 'non-domain');
                    return isPYQ && !isNRT && matchesSubject && t.isVisible !== false;
                });
                setTests(filteredTests);

                if (user) {
                    const results = await getUserTestResults(user.$id);
                    const completedMap: Record<string, any> = {};
                    if (results) {
                        results.forEach(r => {
                            if (!completedMap[r.testId] || r.score > completedMap[r.testId].score) {
                                completedMap[r.testId] = r;
                            }
                        });
                    }
                    setCompletedTests(completedMap);
                }
            } catch (error) {
                console.error("Error fetching PYQ tests:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTests();
    }, [subject, user]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/dashboard/pyqs">
                    <Button variant="secondary" className="bg-white border-2 border-black text-black hover:bg-black hover:text-white">
                        ← Back
                    </Button>
                </Link>
                <div className="flex-1">
                    <div className="flex items-center gap-3">
                        <span className="text-4xl">{subjectInfo.icon}</span>
                        <div>
                            <h1 className="text-3xl font-bold text-foreground">{subjectInfo.label} - PYQ</h1>
                            <p className="text-foreground/70 mt-1 font-medium">{subjectInfo.description}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tests Grid */}
            {tests.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tests.map((test) => (
                        <Card key={test.id} className="group hover:border-primary/50 transition-all duration-300 shadow-lg">
                            <div className="flex flex-col h-full">
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="px-3 py-1 text-xs font-bold text-black bg-primary rounded-full">
                                            PYQ
                                        </span>
                                        <span className="text-foreground text-sm font-bold flex items-center gap-1">
                                            ⏱️ {test.duration} min
                                        </span>
                                    </div>

                                    <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                                        {test.title}
                                    </h3>

                                    <p className="text-foreground text-sm mb-6 line-clamp-2 font-medium">
                                        {test.description || "Test your knowledge with previous year questions designed to help you prepare effectively."}
                                    </p>
                                </div>

                                <div className="mt-auto flex items-center justify-between pt-4 border-t border-border">
                                    <div className="text-sm text-foreground font-bold whitespace-nowrap hidden sm:block">
                                        <span className="font-bold underline decoration-primary decoration-4">{test.questions.length}</span> Qs
                                    </div>
                                    <div className="flex gap-2 flex-wrap">
                                        {completedTests[test.id] ? (
                                            <>
                                                <Link href={`/dashboard/tests/review?testId=${test.id}&score=${completedTests[test.id].score}&total=${completedTests[test.id].totalQuestions}`}>
                                                    <Button variant="outline" className="text-xs uppercase tracking-wider font-bold shadow-sm">
                                                        Result
                                                    </Button>
                                                </Link>
                                                <Link href={`/dashboard/tests/${test.id}`}>
                                                    <Button className="bg-black text-white hover:bg-black/90 shadow-md text-xs uppercase tracking-wider font-bold">
                                                        Retake
                                                    </Button>
                                                </Link>
                                            </>
                                        ) : (
                                            <Link href={`/dashboard/tests/${test.id}`}>
                                                <Button className="bg-black text-white hover:bg-black/90 shadow-md w-full sm:w-auto">
                                                    Start Test
                                                </Button>
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            ) : (
                // Empty State
                <div className="text-center py-16 bg-white rounded-2xl border-2 border-black">
                    <div className="text-5xl mb-4">{subjectInfo.icon}</div>
                    <h3 className="text-lg font-bold text-foreground mb-2">
                        No {subjectInfo.label} PYQs Yet
                    </h3>
                    <p className="text-foreground/70 font-medium text-sm">
                        PYQs will be added soon.
                    </p>
                </div>
            )}
        </div>
    );
}
