import { TestEngine } from "@/components/test/TestEngine";

export default async function TestPage({ params }: { params: Promise<{ testId: string }> }) {
    const { testId } = await params;
    return <TestEngine testId={testId} />;
}
