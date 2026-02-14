"use client";

import {
    Chart as ChartJS,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import { Card } from "@/components/ui/Card";

ChartJS.register(
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
);

interface SubjectRadarProps {
    subjectData: { subject: string; accuracy: number }[];
}

export default function SubjectRadar({ subjectData }: SubjectRadarProps) {
    if (subjectData.length < 3) {
        return (
            <Card className="p-8 border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] h-full flex flex-col items-center justify-center text-center">
                <div className="text-4xl mb-4 opacity-20">🕸️</div>
                <p className="text-sm font-black text-black uppercase opacity-40 italic">
                    Attempt tests in at least 3 different subjects to unlock Radar View
                </p>
            </Card>
        );
    }

    const data = {
        labels: subjectData.map(d => d.subject),
        datasets: [
            {
                label: 'Accuracy %',
                data: subjectData.map(d => d.accuracy),
                backgroundColor: 'rgba(255, 208, 47, 0.2)', // Primary color with opacity
                borderColor: '#FFD02F', // Primary color
                borderWidth: 3,
                pointBackgroundColor: '#000',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: '#000',
            },
        ],
    };

    const options = {
        scales: {
            r: {
                angleLines: {
                    color: 'rgba(0, 0, 0, 0.1)'
                },
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)'
                },
                pointLabels: {
                    font: {
                        size: 11,
                        weight: 900,
                        family: 'sans-serif'
                    },
                    color: '#000',
                    backdropColor: 'transparent' // Hide backdrop behind labels
                },
                ticks: {
                    display: false, // Hide the numbers on the scale lines
                    stepSize: 20
                },
                suggestedMin: 0,
                suggestedMax: 100
            },
        },
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                backgroundColor: '#000',
                titleFont: { weight: 'bold' as const },
                padding: 12,
                cornerRadius: 8,
                displayColors: false,
                callbacks: {
                    label: function (context: any) {
                        return `${context.raw}% Accuracy`;
                    }
                }
            }
        },
        elements: {
            line: {
                tension: 0.2 // Smooth lines
            }
        }
    };

    return (
        <Card className="p-6 md:p-8 border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col h-full">
            <div className="flex items-center gap-3 mb-6">
                <div className="h-8 w-2 bg-primary rounded-full"></div>
                <div>
                    <h2 className="text-xl font-black text-black uppercase tracking-widest italic">Weakness Heatmap</h2>
                    <p className="text-xs text-black/40 font-bold uppercase tracking-widest">Identify gaps at a glance</p>
                </div>
            </div>
            <div className="flex-1 w-full max-h-[350px] relative">
                <Radar data={data} options={options} />
            </div>
        </Card>
    );
}
