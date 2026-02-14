"use client";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Card } from "@/components/ui/Card";
import { Test, TestResult } from '@/types';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

interface TimeAnalysisProps {
    results: TestResult[];
    testDetailsMap: Map<string, Test>;
}

export default function TimeAnalysis({ results, testDetailsMap }: TimeAnalysisProps) {
    // Process data: Avg time per question per test
    const processedData = results
        .slice(0, 10) // Last 10 tests
        .reverse() // Chronological order
        .map(res => {
            const test = testDetailsMap.get(res.testId);
            const title = test?.title || `Test ${res.id?.substring(0, 4)}`;

            // Calculate avg time per question in seconds
            let avgTime = 0;
            if (res.timeTaken && res.totalQuestions > 0) {
                avgTime = res.timeTaken / res.totalQuestions;
            } else if (res.questionTimes) {
                // If total timeTaken missing but questionTimes exists
                const total = Object.values(res.questionTimes).reduce((a, b) => a + b, 0);
                avgTime = total / res.totalQuestions;
            }

            return {
                title,
                avgTime: Math.round(avgTime), // seconds
                score: res.score,
                accuracy: Math.round((res.score / (res.totalQuestions * 4)) * 100)
            };
        });

    const data = {
        labels: processedData.map(d => d.title.substring(0, 10) + (d.title.length > 10 ? '...' : '')),
        datasets: [
            {
                label: 'Avg Time / Question (sec)',
                data: processedData.map(d => d.avgTime),
                borderColor: '#000',
                backgroundColor: 'rgba(0, 0, 0, 0.05)',
                borderWidth: 3,
                tension: 0.4,
                fill: true,
                yAxisID: 'y',
            },
            {
                label: 'Accuracy (%)',
                data: processedData.map(d => d.accuracy),
                borderColor: '#ef4444', // Red for contrast
                backgroundColor: 'transparent',
                borderWidth: 3,
                borderDash: [5, 5],
                tension: 0.4,
                yAxisID: 'y1',
            }
        ],
    };

    const options = {
        responsive: true,
        interaction: {
            mode: 'index' as const,
            intersect: false,
        },
        plugins: {
            legend: {
                display: true,
                labels: {
                    font: { weight: 'bold' as const, family: 'sans-serif' },
                    color: '#000',
                    usePointStyle: true,
                    boxWidth: 8
                }
            },
            tooltip: {
                backgroundColor: '#000',
                titleFont: { weight: 'bold' as const },
                padding: 12,
                cornerRadius: 8,
                displayColors: true,
            }
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: {
                    font: { weight: 'bold' as const, size: 10 },
                    color: '#000'
                }
            },
            y: {
                type: 'linear' as const,
                display: true,
                position: 'left' as const,
                title: { display: true, text: 'Seconds', font: { weight: 'bold' as const, size: 10 } },
                grid: { color: 'rgba(0,0,0,0.05)' }
            },
            y1: {
                type: 'linear' as const,
                display: true,
                position: 'right' as const,
                title: { display: true, text: 'Accuracy %', font: { weight: 'bold' as const, size: 10 } },
                grid: { drawOnChartArea: false }, // only want the grid lines for one axis to show up
                min: 0,
                max: 100
            },
        },
    };

    return (
        <Card className="p-6 md:p-8 border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] h-full">
            <div className="flex items-center gap-3 mb-6">
                <div className="h-8 w-2 bg-black rounded-full"></div>
                <div>
                    <h2 className="text-xl font-black text-black uppercase tracking-widest italic">Time vs Efficiency</h2>
                    <p className="text-xs text-black/40 font-bold uppercase tracking-widest">Are you rushing or taking too long?</p>
                </div>
            </div>

            {processedData.length > 1 ? (
                <div className="w-full h-[300px]">
                    <Line data={data} options={options} />
                </div>
            ) : (
                <div className="w-full h-[300px] flex flex-col items-center justify-center opacity-30">
                    <span className="text-4xl mb-2">⏱️</span>
                    <p className="text-xs font-black uppercase tracking-widest">Attempt more tests to see time analysis</p>
                </div>
            )}
        </Card>
    );
}
