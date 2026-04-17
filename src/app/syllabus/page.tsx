import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "NCET Syllabus & Exam Pattern 2025-26 — Subject-wise Breakdown",
  description:
    "Complete NCET syllabus 2025-26: General Awareness, Teaching Aptitude, English Language, Logical Reasoning & Domain subjects. Exam pattern: 160 questions, 640 marks, 180 minutes.",
  alternates: { canonical: "https://www.ncetbuddy.in/syllabus" },
  openGraph: {
    title: "NCET Syllabus & Exam Pattern 2025-26",
    description:
      "Full NCET syllabus breakdown with subject-wise topics, marks, and exam pattern for the 2025-26 cycle.",
    url: "https://www.ncetbuddy.in/syllabus",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is the NCET exam pattern?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "NCET has 160 multiple-choice questions for a total of 640 marks. The exam duration is 3 hours (180 minutes). There is a negative marking of 1 mark for each wrong answer.",
      },
    },
    {
      "@type": "Question",
      name: "What subjects are in the NCET syllabus?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "NCET syllabus includes: General Awareness (Current Affairs, History, Geography, General Science), Teaching Aptitude (Pedagogy, Child Development), English Language (Grammar, Comprehension), Logical Reasoning, and a Domain Subject chosen by the candidate.",
      },
    },
    {
      "@type": "Question",
      name: "How many questions are there in NCET?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "NCET has a total of 160 questions across all sections, carrying 4 marks each, totalling 640 marks.",
      },
    },
    {
      "@type": "Question",
      name: "Is there negative marking in NCET?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, there is a negative marking of 1 mark for each incorrect answer in NCET.",
      },
    },
  ],
};



import React from 'react';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { Book, CheckCircle2, Clock, ListChecks } from 'lucide-react';

export default function SyllabusPage() {
    const subjects = [
        { title: "General Awareness", topics: "Current Affairs, History, Geography, General Science, Indian Constitution." },
        { title: "Teaching Aptitude", topics: "Teaching Methods, Child Development, Classroom Management, Educational Psychology." },
        { title: "English Language", topics: "Reading Comprehension, Vocabulary, Grammar, Synonyms & Antonyms." },
        { title: "Logical Reasoning", topics: "Number Series, Coding-Decoding, Directions, Blood Relations, Syllogisms." },
    ];

    return (
        <main className="min-h-screen bg-white">
            <JsonLd data={faqSchema} />
            <Navbar />

            <div className="pt-32 pb-24">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-16">
                            <h1 className="text-5xl font-bold text-[#0F172A] mb-6">Syllabus & Pattern</h1>
                            <p className="text-zinc-500 text-xl max-w-2xl mx-auto">Master the NCET exam structure and detailed module-wise syllabus to focus your preparation.</p>
                            <div className="h-1.5 w-24 bg-[#fad776] mx-auto mt-8 rounded-full"></div>
                        </div>

                        <section className="mb-20">
                            <h2 className="text-3xl font-bold text-[#0F172A] mb-10 flex items-center">
                                <Clock className="mr-4 text-rose-500" /> Exam Pattern
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="p-8 rounded-[2rem] bg-zinc-50 border border-zinc-100">
                                    <div className="text-rose-500 font-bold uppercase tracking-widest text-xs mb-2">Duration</div>
                                    <div className="text-3xl font-black text-[#0F172A]">180 Minutes</div>
                                    <p className="text-zinc-500 mt-2">Total time for the computer-based test.</p>
                                </div>
                                <div className="p-8 rounded-[2rem] bg-zinc-50 border border-zinc-100">
                                    <div className="text-rose-500 font-bold uppercase tracking-widest text-xs mb-2">Total Marks</div>
                                    <div className="text-3xl font-black text-[#0F172A]">640 Marks</div>
                                    <p className="text-zinc-500 mt-2">160 Questions in total.</p>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-3xl font-bold text-[#0F172A] mb-10 flex items-center">
                                <ListChecks className="mr-4 text-rose-500" /> Subject-wise Breakdown
                            </h2>
                            <div className="space-y-6">
                                {subjects.map((subject, index) => (
                                    <div key={index} className="flex gap-6 p-8 rounded-[2rem] border border-zinc-100 hover:border-rose-200 transition-colors group">
                                        <div className="shrink-0 w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center group-hover:bg-rose-500 group-hover:text-white transition-colors duration-300">
                                            <CheckCircle2 className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-[#0F172A] mb-2">{subject.title}</h3>
                                            <p className="text-zinc-500 leading-relaxed">{subject.topics}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <div className="mt-20 p-10 bg-rose-50 border border-rose-100 rounded-[2.5rem]">
                            <div className="flex flex-col md:flex-row items-center gap-8">
                                <div className="shrink-0 w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-lg">
                                    <Book className="text-[#E11D48] w-10 h-10" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-[#0F172A] mb-2">Download Detailed PDF</h3>
                                    <p className="text-zinc-500">Get the full chapter-wise syllabus PDF including Domain Subjects and Language choices.</p>
                                </div>
                                <a 
                                    href="https://exams.nta.nic.in/ncet-2026-syllabus/" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="md:ml-auto whitespace-nowrap bg-[#E11D48] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#BE123C] transition-colors"
                                >
                                    Download Now
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
