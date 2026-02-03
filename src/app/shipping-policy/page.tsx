"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function ShippingPolicy() {
    return (
        <main className="min-h-screen bg-white">
            {/* Simple Header */}
            <div className="border-b-2 border-black p-6 bg-primary">
                <div className="max-w-4xl mx-auto flex justify-between items-center">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 border border-black bg-white">
                            <img src="/logo.png" alt="NCET Buddy" className="w-full h-full object-cover" />
                        </div>
                        <span className="text-xl font-bold text-black uppercase">NCET Buddy</span>
                    </Link>
                    <Link href="/">
                        <Button variant="secondary" className="bg-black text-white text-sm px-4 py-2">Go Home</Button>
                    </Link>
                </div>
            </div>

            <div className="max-w-4xl mx-auto py-16 px-6">
                {/* Page Title */}
                <div className="mb-12">
                    <h1 className="text-4xl font-black text-black uppercase mb-2">Shipping Policy</h1>
                    <div className="h-1 w-32 bg-primary mt-4"></div>
                    <p className="mt-6 text-xs text-black/60 font-bold uppercase">Last Updated: February 2026</p>
                </div>

                {/* Content */}
                <div className="space-y-8 text-black text-sm leading-relaxed">
                    <section>
                        <h2 className="text-lg font-bold uppercase mb-3">Digital Products and Services Only</h2>
                        <p className="mb-3">
                            NCET Buddy provides <strong>only digital products and services</strong>.
                        </p>
                        <p className="mb-3">
                            No physical goods are shipped. Access to digital test series and educational content is provided electronically after successful payment.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold uppercase mb-3">How You Receive Your Purchase</h2>
                        <p className="mb-3">
                            Upon successful completion of your payment, you will receive immediate access to your purchased digital content through your NCET Buddy account dashboard.
                        </p>
                        <div className="p-4 bg-primary/20 border-l-4 border-primary mt-4">
                            <p className="text-xs font-bold uppercase mb-3">What You Get Instant Access To:</p>
                            <ul className="space-y-2">
                                <li>• Mock Test Series (accessible online through your account)</li>
                                <li>• Video Lectures and Study Materials (streaming/downloadable)</li>
                                <li>• Live Class Access (online sessions)</li>
                                <li>• Performance Analytics and Reports (digital dashboard)</li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold uppercase mb-3">No Shipping Required</h2>
                        <p className="mb-3">
                            Since all our products are digital in nature, there are:
                        </p>
                        <ul className="space-y-2 pl-5">
                            <li>• No shipping charges</li>
                            <li>• No physical delivery address required</li>
                            <li>• No waiting for delivery</li>
                            <li>• Instant access upon payment confirmation</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold uppercase mb-3">Account Access</h2>
                        <p>
                            To access your digital purchases, simply log in to your NCET Buddy account at <strong>https://ncetbuddy.in</strong> using your registered email and password. All purchased content will be available in your dashboard.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold uppercase mb-3">Technical Support</h2>
                        <p className="mb-3">
                            If you experience any issues accessing your digital content after purchase, please contact our support team at:
                            <strong className="ml-2">connect@ncetbuddy.in</strong>
                        </p>
                        <p>
                            Include the subject line: <strong>"Digital Content Access Issue"</strong>
                        </p>
                    </section>

                    <div className="p-4 bg-primary/20 border-l-4 border-primary mt-8">
                        <p className="text-xs font-bold uppercase">
                            Important: NCET Buddy is an entirely digital platform. We do not ship, mail, or courier any physical products or materials.
                        </p>
                    </div>
                </div>

                {/* Simple CTA */}
                <div className="mt-16 pt-8 border-t-2 border-black/10 text-center">
                    <Link href="/">
                        <Button className="bg-primary text-black font-bold px-8 py-3 uppercase text-sm">
                            I Understand
                        </Button>
                    </Link>
                </div>
            </div>
        </main>
    );
}
