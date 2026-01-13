"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function TermsOfService() {
    return (
        <main className="min-h-screen bg-white">
            {/* Header / Nav Placeholder */}
            <div className="border-b-4 border-black p-6 flex justify-between items-center bg-primary">
                <Link href="/" className="text-2xl font-black text-black uppercase italic tracking-tighter">NCET Buddy</Link>
                <Link href="/">
                    <Button variant="secondary" className="bg-black text-white hover:bg-white hover:text-black transition-all">Go Home</Button>
                </Link>
            </div>

            <div className="max-w-4xl mx-auto py-20 px-6">
                <div className="mb-16">
                    <h1 className="text-6xl font-black text-black uppercase tracking-tighter italic mb-4">Terms of Service</h1>
                    <div className="h-4 w-40 bg-primary border-2 border-black"></div>
                    <p className="mt-8 text-black font-bold opacity-60 uppercase tracking-widest text-xs">Last Updated: January 2024</p>
                </div>

                <div className="space-y-12 text-black font-medium leading-relaxed">
                    <section>
                        <h2 className="text-2xl font-black uppercase italic mb-6 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-primary border-2 border-black flex items-center justify-center text-sm">01</span>
                            Agreement to Terms
                        </h2>
                        <p>
                            By accessing or using our website, you agree to be bound by these Terms of Service. If you do not agree to all of these terms, do not access or use the website.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black uppercase italic mb-6 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-primary border-2 border-black flex items-center justify-center text-sm">02</span>
                            User Conduct
                        </h2>
                        <p className="mb-4">
                            You agree not to use the website for any purpose that is prohibited by these Terms of Service. You are responsible for all of your activity in connection with the website.
                        </p>
                        <ul className="list-none space-y-3 pl-11">
                            <li className="flex items-start gap-2">
                                <span className="text-primary font-black">●</span>
                                <div>You shall not attempt to gain unauthorized access to any portion of the website.</div>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary font-black">●</span>
                                <div>You shall not use the website to distribute viruses or other malicious computer code.</div>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary font-black">●</span>
                                <div>You shall not interfere with or disrupt the performance of the website.</div>
                            </li>
                        </ul>
                    </section>

                    <section className="p-8 bg-black text-white border-4 border-black rounded-3xl shadow-[12px_12px_0px_0px_rgba(255,208,47,1)]">
                        <h2 className="text-2xl font-black uppercase italic mb-6 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-primary text-black border-2 border-black flex items-center justify-center text-sm">03</span>
                            Intellectual Property
                        </h2>
                        <p className="text-gray-300">
                            The content on the website, including without limitation, the text, software, scripts, graphics, photos, sounds, music, videos, and interactive features and the trademarks, service marks and logos contained therein, are owned by or licensed to NCET Buddy.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black uppercase italic mb-6 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-primary border-2 border-black flex items-center justify-center text-sm">04</span>
                            Limitation of Liability
                        </h2>
                        <p>
                            In no event shall NCET Buddy be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black uppercase italic mb-6 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-primary border-2 border-black flex items-center justify-center text-sm">05</span>
                            Termination
                        </h2>
                        <p>
                            We may terminate or suspend access to our service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black uppercase italic mb-6 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-primary border-2 border-black flex items-center justify-center text-sm">06</span>
                            Contact Us
                        </h2>
                        <p>
                            If you have any questions about these Terms, please contact us at:
                            <span className="text-primary font-black ml-2 underline underline-offset-4 decoration-2">ncetbuddy@gmail.com</span>
                        </p>
                    </section>
                </div>

                <div className="mt-20 pt-10 border-t-4 border-black text-center">
                    <Link href="/">
                        <Button className="bg-primary border-4 border-black text-black font-black py-4 px-10 h-auto text-lg shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
                            I AGREE
                        </Button>
                    </Link>
                </div>
            </div>
        </main>
    );
}
