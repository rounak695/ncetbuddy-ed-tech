"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function PrivacyPolicy() {
    return (
        <main className="min-h-screen bg-white">
            {/* Header / Nav Placeholder */}
            <div className="border-b-4 border-black p-6 flex justify-between items-center bg-primary">
                <Link href="/" className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden border-2 border-black bg-white">
                        <img src="/logo.png" alt="NCET Buddy" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-2xl font-black text-black uppercase italic tracking-tighter">NCET Buddy</span>
                </Link>
                <Link href="/">
                    <Button variant="secondary" className="bg-black text-white hover:bg-white hover:text-black transition-all">Go Home</Button>
                </Link>
            </div>

            <div className="max-w-4xl mx-auto py-20 px-6">
                <div className="mb-16">
                    <h1 className="text-6xl font-black text-black uppercase tracking-tighter italic mb-4">Privacy Policy</h1>
                    <div className="h-4 w-40 bg-primary border-2 border-black"></div>
                    <p className="mt-8 text-black font-bold opacity-60 uppercase tracking-widest text-xs">Last Updated: JANUARY 2026</p>
                </div>

                <div className="space-y-12 text-black font-medium leading-relaxed">
                    <section>
                        <h2 className="text-2xl font-black uppercase italic mb-6 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-primary border-2 border-black flex items-center justify-center text-sm">01</span>
                            Introduction
                        </h2>
                        <p>
                            At NCET Buddy, we value your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black uppercase italic mb-6 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-primary border-2 border-black flex items-center justify-center text-sm">02</span>
                            The Data We Collect
                        </h2>
                        <p className="mb-4">
                            We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
                        </p>
                        <ul className="list-none space-y-3 pl-11">
                            <li className="flex items-start gap-2">
                                <span className="text-primary font-black">●</span>
                                <div><strong>Identity Data:</strong> includes first name, last name, username or similar identifier.</div>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary font-black">●</span>
                                <div><strong>Contact Data:</strong> includes email address and telephone numbers.</div>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary font-black">●</span>
                                <div><strong>Technical Data:</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location.</div>
                            </li>
                        </ul>
                    </section>

                    <section className="p-8 bg-primary/5 border-4 border-dashed border-black rounded-3xl">
                        <h2 className="text-2xl font-black uppercase italic mb-6 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-black text-primary border-2 border-black flex items-center justify-center text-sm">03</span>
                            How We Use Your Data
                        </h2>
                        <p>
                            We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
                        </p>
                        <ul className="mt-4 space-y-4">
                            <li>• To provide the services you have requested, such as mock tests and study materials.</li>
                            <li>• To manage our relationship with you, including notification about changes to our terms or privacy policy.</li>
                            <li>• To improve our website, services, marketing, and customer relationships.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black uppercase italic mb-6 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-primary border-2 border-black flex items-center justify-center text-sm">04</span>
                            Cookies
                        </h2>
                        <p>
                            You can set your browser to refuse all or some browser cookies, or to alert you when websites set or access cookies. If you disable or refuse cookies, please note that some parts of this website may become inaccessible or not function properly.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black uppercase italic mb-6 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-primary border-2 border-black flex items-center justify-center text-sm">05</span>
                            Contact Us
                        </h2>
                        <p>
                            If you have any questions about this privacy policy or our privacy practices, please contact us at:
                            <span className="text-primary font-black ml-2 underline underline-offset-4 decoration-2">ncetbuddy@gmail.com</span>
                        </p>
                    </section>
                </div>

                <div className="mt-20 pt-10 border-t-4 border-black text-center">
                    <Link href="/">
                        <Button className="bg-primary border-4 border-black text-black font-black py-4 px-10 h-auto text-lg shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
                            ACCEPT & GO BACK
                        </Button>
                    </Link>
                </div>
            </div>
        </main>
    );
}
