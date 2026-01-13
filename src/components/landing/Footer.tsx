import Link from "next/link";

export const Footer = () => {
    return (
        <footer className="bg-black border-t border-white/5 py-12">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-white/20 bg-white/5">
                                <img src="/logo.png" alt="NCET Buddy" className="w-full h-full object-cover" />
                            </div>
                            <h3 className="text-2xl font-black text-primary uppercase tracking-tighter italic">
                                NCET Buddy
                            </h3>
                        </div>
                        <p className="text-gray-400 text-sm max-w-sm">
                            Your one-stop destination for NCET exam preparation.
                            We provide the best resources to help you crack the exam with flying colors.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4 text-white">Quick Links</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><Link href="/login" className="hover:text-primary transition-colors">Login</Link></li>
                            <li><Link href="/signup" className="hover:text-primary transition-colors">Sign Up</Link></li>
                            <li><Link href="/#features" className="hover:text-primary transition-colors">Features</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4 text-white">Legal</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                            <li><Link href="/" className="hover:text-primary transition-colors">Contact Us</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-8 text-center text-sm text-gray-500">
                    &copy; 2026 NCET Buddy. All rights reserved.
                </div>
            </div>
        </footer>
    );
};
