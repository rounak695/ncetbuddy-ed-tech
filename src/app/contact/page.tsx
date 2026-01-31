"use client";

import Link from "next/link";

export default function ContactPage() {
    return (
        <main className="min-h-screen bg-white">
            {/* Header / Nav */}
            <div className="border-b-4 border-black p-6 flex justify-between items-center bg-primary">
                <Link href="/" className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden border-2 border-black bg-white">
                        <img src="/logo.png" alt="NCET Buddy" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-2xl font-black text-black uppercase italic tracking-tighter">NCET Buddy</span>
                </Link>
                <Link
                    href="/"
                    className="px-6 py-3 bg-black text-white font-black uppercase tracking-widest rounded-2xl hover:bg-white hover:text-black transition-all border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1"
                >
                    Go Home
                </Link>
            </div>

            <div className="max-w-4xl mx-auto py-20 px-6">
                {/* Page Header */}
                <div className="mb-16">
                    <h1 className="text-6xl font-black text-black uppercase tracking-tighter italic mb-4">Contact Us</h1>
                    <div className="h-4 w-40 bg-primary border-2 border-black"></div>
                    <p className="mt-8 text-black font-bold opacity-60 uppercase tracking-widest text-xs">
                        Get in touch with the NCET Buddy team
                    </p>
                </div>

                {/* Instructions Section */}
                <div className="mb-12 p-8 bg-primary/10 border-4 border-dashed border-black rounded-3xl">
                    <h2 className="text-2xl font-black uppercase italic mb-4 flex items-center gap-3">
                        <span className="w-8 h-8 rounded-lg bg-primary border-2 border-black flex items-center justify-center text-sm">💬</span>
                        We'd Love to Hear from You!
                    </h2>
                    <p className="text-black font-medium leading-relaxed">
                        Have questions, feedback, or need assistance? Fill out the form below and we'll get back to you as soon as possible at <span className="text-primary font-black underline underline-offset-4 decoration-2">connect@ncetbuddy.in</span>
                    </p>
                </div>

                {/* Google Form Embed - PLACEHOLDER */}
                <div className="relative w-full border-4 border-black rounded-3xl overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    {/* 
                        INSTRUCTIONS FOR INTEGRATION:
                        
                        1. Follow the setup guide in GOOGLE_FORM_SETUP.md
                        2. Create the Google Form and get the embed code
                        3. Replace the iframe src below with your Google Form embed URL
                        4. The form should look like this:
                           <iframe src="YOUR_GOOGLE_FORM_EMBED_URL_HERE" width="100%" height="800" frameborder="0" marginheight="0" marginwidth="0">Loading…</iframe>
                        
                        Example URL format:
                        https://docs.google.com/forms/d/e/FORM_ID/viewform?embedded=true
                    */}

                    <div className="bg-gradient-to-br from-primary/20 to-white p-12 text-center min-h-[800px] flex flex-col items-center justify-center">
                        <div className="max-w-2xl">
                            <div className="w-24 h-24 rounded-2xl bg-primary border-4 border-black flex items-center justify-center text-5xl mb-6 mx-auto shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                📋
                            </div>
                            <h3 className="text-3xl font-black uppercase italic mb-4">Google Form Integration Required</h3>
                            <p className="text-lg font-bold mb-6 text-black/70">
                                Follow these steps to complete the setup:
                            </p>
                            <ol className="text-left space-y-4 mb-8 text-black font-medium">
                                <li className="flex items-start gap-3">
                                    <span className="w-8 h-8 rounded-lg bg-primary border-2 border-black flex items-center justify-center text-sm flex-shrink-0 font-black">1</span>
                                    <div>
                                        <strong className="font-black">Open the setup guide:</strong> Read <code className="bg-black text-primary px-2 py-1 rounded font-mono text-sm">GOOGLE_FORM_SETUP.md</code> in the artifacts directory
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="w-8 h-8 rounded-lg bg-primary border-2 border-black flex items-center justify-center text-sm flex-shrink-0 font-black">2</span>
                                    <div>
                                        <strong className="font-black">Create Google Form:</strong> Sign in to <code className="bg-black text-primary px-2 py-1 rounded font-mono text-sm">connect@ncetbuddy.in</code> and create the form
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="w-8 h-8 rounded-lg bg-primary border-2 border-black flex items-center justify-center text-sm flex-shrink-0 font-black">3</span>
                                    <div>
                                        <strong className="font-black">Get embed code:</strong> Click Send → Embed HTML and copy the iframe URL
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="w-8 h-8 rounded-lg bg-primary border-2 border-black flex items-center justify-center text-sm flex-shrink-0 font-black">4</span>
                                    <div>
                                        <strong className="font-black">Update this file:</strong> Replace the commented section in <code className="bg-black text-primary px-2 py-1 rounded font-mono text-sm">src/app/contact/page.tsx</code>
                                    </div>
                                </li>
                            </ol>
                            <div className="p-6 bg-black text-white rounded-2xl border-4 border-primary">
                                <p className="font-black uppercase text-sm mb-2">Quick Code Reference:</p>
                                <code className="text-xs font-mono block text-left bg-primary/20 p-4 rounded-lg overflow-x-auto">
                                    &lt;iframe<br />
                                    &nbsp;&nbsp;src="https://docs.google.com/forms/d/e/YOUR_FORM_ID/viewform?embedded=true"<br />
                                    &nbsp;&nbsp;width="100%"<br />
                                    &nbsp;&nbsp;height="800"<br />
                                    &nbsp;&nbsp;frameBorder="0"<br />
                                    &gt;<br />
                                    &nbsp;&nbsp;Loading…<br />
                                    &lt;/iframe&gt;
                                </code>
                            </div>
                        </div>
                    </div>

                    {/* 
                        UNCOMMENT AND USE THIS AFTER YOU HAVE THE GOOGLE FORM URL:
                        
                        <iframe
                            src="YOUR_GOOGLE_FORM_EMBED_URL_HERE"
                            width="100%"
                            height="800"
                            frameBorder="0"
                            marginHeight={0}
                            marginWidth={0}
                            className="w-full"
                        >
                            Loading…
                        </iframe>
                    */}
                </div>

                {/* Additional Contact Info */}
                <div className="mt-12 p-8 bg-white border-4 border-black rounded-3xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <h3 className="text-xl font-black uppercase italic mb-4">Other Ways to Reach Us</h3>
                    <div className="space-y-3 text-black font-medium">
                        <p className="flex items-center gap-3">
                            <span className="text-2xl">📧</span>
                            <span>Email: <a href="mailto:connect@ncetbuddy.in" className="text-primary font-black underline underline-offset-4 decoration-2">connect@ncetbuddy.in</a></span>
                        </p>
                        <p className="flex items-center gap-3">
                            <span className="text-2xl">⏰</span>
                            <span>Response Time: Usually within 24-48 hours</span>
                        </p>
                        <p className="flex items-center gap-3">
                            <span className="text-2xl">🏫</span>
                            <span>For educators: Use the educator portal for institutional inquiries</span>
                        </p>
                    </div>
                </div>

                {/* Back Button */}
                <div className="mt-20 pt-10 border-t-4 border-black text-center">
                    <Link
                        href="/"
                        className="inline-block px-10 py-4 bg-primary border-4 border-black text-black font-black text-lg shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all uppercase tracking-widest rounded-2xl"
                    >
                        Back to Home
                    </Link>
                </div>
            </div>
        </main>
    );
}
