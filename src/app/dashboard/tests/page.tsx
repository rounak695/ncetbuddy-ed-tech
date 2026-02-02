"use client";

/**
 * BUSINESS MODEL NOTES:
 * 
 * 1. PYQ (Previous Year Questions):
 *    - Platform-owned content
 *    - Always FREE for all users
 *    - Categorized by 5 subjects: Languages, Humanities, Science, Commerce, Non-Domain
 *    - No premium checks required
 * 
 * 2. Educator Mock Tests:
 *    - Educator-owned content
 *    - Premium-gated (future implementation)
 *    - Currently shows empty state: "No educator enrolled yet"
 *    - DO NOT show DEMO_TEST here
 * 
 * This separation is intentional for business model clarity.
 */

import { Card } from "@/components/ui/Card";
import Link from "next/link";
import { PYQSubject } from "@/types";

const PYQ_SUBJECTS: { id: PYQSubject; label: string; icon: string; description: string }[] = [
    { id: 'languages', label: 'Languages', icon: '📝', description: 'English, Hindi & Regional' },
    { id: 'humanities', label: 'Humanities', icon: '📚', description: 'History, Geography & More' },
    { id: 'science', label: 'Science', icon: '🔬', description: 'Physics, Chemistry, Biology, Maths' },
    { id: 'commerce', label: 'Commerce', icon: '💼', description: 'Economics, Accounts & Business' },
    { id: 'non-domain', label: 'Non-Domain', icon: '🎯', description: 'General Knowledge & Aptitude' }
];

export default function TestsPage() {
    return (
        <div className="space-y-12">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold text-foreground">Mock Tests</h1>
                <p className="text-foreground mt-1 font-medium">Practice with real exam-like questions</p>
            </div>

            {/* SECTION A: PYQ (FREE) */}
            <section className="space-y-6">
                <div className="border-b-2 border-border pb-4">
                    <h2 className="text-2xl font-bold text-foreground">PYQ (Previous Year Questions)</h2>
                    <p className="text-foreground/70 text-sm font-medium mt-1">Free practice based on previous year questions</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {PYQ_SUBJECTS.map((subject) => (
                        <Link key={subject.id} href={`/dashboard/tests/pyq/${subject.id}`}>
                            <Card className="group hover:border-primary/50 transition-all duration-300 shadow-lg cursor-pointer h-full">
                                <div className="flex flex-col h-full">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-4xl">{subject.icon}</span>
                                        <span className="px-3 py-1 text-xs font-bold text-black bg-primary rounded-full">
                                            FREE
                                        </span>
                                    </div>

                                    <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                                        {subject.label}
                                    </h3>

                                    <p className="text-foreground/70 text-sm font-medium mb-4">
                                        {subject.description}
                                    </p>

                                    <div className="mt-auto pt-4 border-t border-border">
                                        <span className="text-sm text-foreground font-bold group-hover:text-primary transition-colors">
                                            View Tests →
                                        </span>
                                    </div>
                                </div>
                            </Card>
                        </Link>
                    ))}
                </div>
            </section>

            {/* SECTION B: EDUCATOR MOCK TESTS (PREMIUM) */}
            <section className="space-y-6">
                <div className="border-b-2 border-border pb-4">
                    <h2 className="text-2xl font-bold text-foreground">Educator Mock Tests</h2>
                    <p className="text-foreground/70 text-sm font-medium mt-1">Official mock tests created by educators</p>
                </div>

                {/* Empty State - No Educator Enrolled */}
                <div className="text-center py-16 bg-white rounded-2xl border-2 border-black">
                    <div className="text-5xl mb-4">👨‍🏫</div>
                    <h3 className="text-lg font-bold text-foreground mb-2">
                        No educator enrolled yet.
                    </h3>
                    <p className="text-foreground/70 font-medium text-sm">
                        Mock tests will be updated soon.
                    </p>
                </div>
            </section>
        </div>
    );
}
