"use client";

import { Card } from "@/components/ui/Card";

export default function LeaderboardPage() {
    // Placeholder data
    const leaderboard = [
        { rank: 1, name: "Alice Smith", score: 98, tests: 12 },
        { rank: 2, name: "Bob Johnson", score: 95, tests: 10 },
        { rank: 3, name: "Charlie Brown", score: 92, tests: 15 },
        { rank: 4, name: "David Lee", score: 88, tests: 8 },
        { rank: 5, name: "Eve Wilson", score: 85, tests: 11 },
    ];

    return (
        <div>
            <h1 style={{ marginBottom: "2rem" }}>Leaderboard</h1>

            <Card>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                    <thead>
                        <tr style={{ borderBottom: "1px solid #333" }}>
                            <th style={{ padding: "1rem", color: "var(--text-secondary)" }}>Rank</th>
                            <th style={{ padding: "1rem", color: "var(--text-secondary)" }}>Student</th>
                            <th style={{ padding: "1rem", color: "var(--text-secondary)" }}>Avg Score</th>
                            <th style={{ padding: "1rem", color: "var(--text-secondary)" }}>Tests Taken</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leaderboard.map((user) => (
                            <tr key={user.rank} style={{ borderBottom: "1px solid #222" }}>
                                <td style={{ padding: "1rem", fontWeight: "bold", color: user.rank <= 3 ? "var(--primary)" : "inherit" }}>
                                    #{user.rank}
                                </td>
                                <td style={{ padding: "1rem" }}>{user.name}</td>
                                <td style={{ padding: "1rem" }}>{user.score}%</td>
                                <td style={{ padding: "1rem" }}>{user.tests}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>
        </div>
    );
}
