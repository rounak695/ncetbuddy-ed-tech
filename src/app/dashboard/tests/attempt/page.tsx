"use client";

import { useSearchParams } from "next/navigation";
import { TestEngine } from "@/components/test/TestEngine";
import { Suspense } from "react";

function TestAttemptContent() {
    const searchParams = useSearchParams();
    const testId = searchParams.get("id");

    if (!testId) {
        return <div style={{ color: "white", padding: "2rem" }}>Test ID not found.</div>;
    }

    return <TestEngine testId={testId} />;
}

export default function TestAttemptPage() {
    return (
        <Suspense fallback={<div style={{ color: "white", padding: "2rem" }}>Loading test...</div>}>
            <TestAttemptContent />
        </Suspense>
    );
}
