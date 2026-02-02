"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function RefundPolicy() {
    return (
        <main className="min-h-screen bg-white">
            {/* Header */}
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
                    <h1 className="text-6xl font-black text-black uppercase tracking-tighter italic mb-4">Refund Policy</h1>
                    <div className="h-4 w-40 bg-primary border-2 border-black"></div>
                    <p className="mt-8 text-black font-bold opacity-60 uppercase tracking-widest text-xs">Last Updated: JANUARY 2026</p>
                </div>

                <div className="space-y-8 text-black leading-relaxed">
                    <section>
                        <h2 className="text-2xl font-black uppercase italic mb-6 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-primary border-2 border-black flex items-center justify-center text-sm">01</span>
                            No Refund Policy
                        </h2>
                        <p className="text-sm font-medium mb-4">
                            At NCET Buddy, all payments made for services, subscriptions, mock tests, or any other products are <span className="font-black">final and non-refundable</span> once the payment transaction is successfully completed.
                        </p>
                        <p className="text-sm font-medium">
                            By completing a payment on our platform, you acknowledge and agree that you will not be eligible for any refund, regardless of the reason, including but not limited to change of mind, dissatisfaction with services, or non-usage of purchased content.
                        </p>
                    </section>

                    <section className="p-8 bg-black text-white border-4 border-black rounded-3xl shadow-[12px_12px_0px_0px_rgba(255,208,47,1)]">
                        <h2 className="text-2xl font-black uppercase italic mb-6 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-primary text-black border-2 border-black flex items-center justify-center text-sm">02</span>
                            Payment Gateway Failures
                        </h2>
                        <p className="text-sm text-gray-300 mb-4">
                            <span className="font-black text-white">Exception:</span> Refunds will ONLY be processed in cases where the payment amount has been deducted from your account but the transaction failed due to a <span className="font-black text-white">payment gateway error or technical issue</span>, and the services/products were not delivered to you.
                        </p>
                        <div className="bg-white/10 border-2 border-white/20 rounded-2xl p-6 mt-4">
                            <p className="text-xs font-black text-primary uppercase tracking-widest mb-3">To Request a Refund for Gateway Failure:</p>
                            <ul className="space-y-2 text-sm">
                                <li className="flex items-start gap-2">
                                    <span className="text-primary font-black">•</span>
                                    <div>Contact us within <span className="font-black text-white">7 days</span> of the failed transaction</div>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-primary font-black">•</span>
                                    <div>Provide transaction ID, payment screenshot, and bank statement proof</div>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-primary font-black">•</span>
                                    <div>Our team will verify the issue within 5-7 business days</div>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-primary font-black">•</span>
                                    <div>If approved, refund will be processed to the original payment method within 10-15 business days</div>
                                </li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black uppercase italic mb-6 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-primary border-2 border-black flex items-center justify-center text-sm">03</span>
                            Non-Refundable Scenarios
                        </h2>
                        <p className="text-sm font-medium mb-4">Refunds will NOT be issued in the following cases:</p>
                        <ul className="space-y-3 pl-11">
                            <li className="flex items-start gap-2">
                                <span className="text-primary font-black">●</span>
                                <div className="text-sm">Change of mind after purchase or subscription</div>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary font-black">●</span>
                                <div className="text-sm">Failure to use the services after payment</div>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary font-black">●</span>
                                <div className="text-sm">Dissatisfaction with mock test scores or performance</div>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary font-black">●</span>
                                <div className="text-sm">Technical issues on user's device (internet connectivity, browser compatibility, etc.)</div>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary font-black">●</span>
                                <div className="text-sm">Violation of our Terms & Conditions resulting in account suspension or termination</div>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary font-black">●</span>
                                <div className="text-sm">Duplicate payments (contact us immediately for resolution)</div>
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black uppercase italic mb-6 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-primary border-2 border-black flex items-center justify-center text-sm">04</span>
                            Subscription Cancellations
                        </h2>
                        <p className="text-sm font-medium">
                            If you have an active subscription, you may cancel future renewals at any time. However, <span className="font-black">no refunds will be provided for the current billing period</span>. You will continue to have access to the services until the end of your current subscription period.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black uppercase italic mb-6 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-primary border-2 border-black flex items-center justify-center text-sm">05</span>
                            Contact Us
                        </h2>
                        <p className="text-sm font-medium">
                            For any queries related to payments or refund requests due to payment gateway failures, please contact us at:
                            <span className="text-primary font-black ml-2 underline underline-offset-4 decoration-2">connect@ncetbuddy.in</span>
                        </p>
                        <p className="text-sm font-medium mt-4">
                            Include the subject line: <span className="font-black">"Refund Request - Payment Gateway Failure"</span>
                        </p>
                    </section>

                    <div className="p-6 bg-primary/10 border-4 border-black rounded-2xl mt-8">
                        <p className="text-xs font-black uppercase tracking-widest">
                            Important Notice: By making a payment on NCET Buddy, you acknowledge that you have read, understood, and agree to this Refund Policy.
                        </p>
                    </div>
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
