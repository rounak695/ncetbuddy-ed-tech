"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function RefundPolicy() {
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
                    <h1 className="text-4xl font-black text-black uppercase mb-2">Refund Policy</h1>
                    <div className="h-1 w-32 bg-primary mt-4"></div>
                    <p className="mt-6 text-xs text-black/60 font-bold uppercase">Last Updated: January 2026</p>
                </div>

                {/* Content */}
                <div className="space-y-8 text-black text-sm leading-relaxed">
                    <section>
                        <h2 className="text-lg font-bold uppercase mb-3">No Refund Policy</h2>
                        <p className="mb-3">
                            At NCET Buddy, all payments made for services, subscriptions, mock tests, or any other products are <strong>final and non-refundable</strong> once the payment transaction is successfully completed.
                        </p>
                        <p>
                            By completing a payment on our platform, you acknowledge and agree that you will not be eligible for any refund, regardless of the reason, including but not limited to change of mind, dissatisfaction with services, or non-usage of purchased content.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold uppercase mb-3">Payment Gateway Failures</h2>
                        <p className="mb-3">
                            <strong>Exception:</strong> Refunds will ONLY be processed in cases where the payment amount has been deducted from your account but the transaction failed due to a <strong>payment gateway error or technical issue</strong>, and the services/products were not delivered to you.
                        </p>
                        <div className="p-4 bg-gray-50 border-l-4 border-black mt-4">
                            <p className="text-xs font-bold uppercase mb-3">To Request a Refund for Gateway Failure:</p>
                            <ul className="space-y-2">
                                <li>• Contact us within <strong>7 days</strong> of the failed transaction</li>
                                <li>• Provide transaction ID, payment screenshot, and bank statement proof</li>
                                <li>• Our team will verify the issue within 5-7 business days</li>
                                <li>• If approved, refund will be processed to the original payment method within 10-15 business days</li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold uppercase mb-3">Non-Refundable Scenarios</h2>
                        <p className="mb-3">Refunds will NOT be issued in the following cases:</p>
                        <ul className="space-y-2 pl-5">
                            <li>• Change of mind after purchase or subscription</li>
                            <li>• Failure to use the services after payment</li>
                            <li>• Dissatisfaction with mock test scores or performance</li>
                            <li>• Technical issues on user's device (internet connectivity, browser compatibility, etc.)</li>
                            <li>• Violation of our Terms & Conditions resulting in account suspension or termination</li>
                            <li>• Duplicate payments (contact us immediately for resolution)</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold uppercase mb-3">Subscription Cancellations</h2>
                        <p>
                            If you have an active subscription, you may cancel future renewals at any time. However, <strong>no refunds will be provided for the current billing period</strong>. You will continue to have access to the services until the end of your current subscription period.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold uppercase mb-3">Contact Us</h2>
                        <p className="mb-3">
                            For any queries related to payments or refund requests due to payment gateway failures, please contact us at:
                            <strong className="ml-2">connect@ncetbuddy.in</strong>
                        </p>
                        <p>
                            Include the subject line: <strong>"Refund Request - Payment Gateway Failure"</strong>
                        </p>
                    </section>

                    <div className="p-4 bg-primary/20 border-l-4 border-primary mt-8">
                        <p className="text-xs font-bold uppercase">
                            Important Notice: By making a payment on NCET Buddy, you acknowledge that you have read, understood, and agree to this Refund Policy.
                        </p>
                    </div>
                </div>

                {/* Simple CTA */}
                <div className="mt-16 pt-8 border-t-2 border-black/10 text-center">
                    <Link href="/">
                        <Button className="bg-primary text-black font-bold px-8 py-3 uppercase text-sm">
                            I Agree
                        </Button>
                    </Link>
                </div>
            </div>
        </main>
    );
}
