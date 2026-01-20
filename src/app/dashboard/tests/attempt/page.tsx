"use client";

import { useSearchParams } from "next/navigation";
import { TestEngine } from "@/components/test/TestEngine";

export default function TestAttemptPage() {
    const searchParams = useSearchParams();
    const testId = searchParams.get("id");

    if (!testId) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="bg-white p-8 rounded-lg shadow-lg">
                    <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
                    <p className="text-gray-700">No test ID provided.</p>
                </div>
            </div>
        );
    }

    return <TestEngine testId={testId} />;
}
