"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function PrivacyPolicy() {
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
                    <h1 className="text-6xl font-black text-black uppercase tracking-tighter italic mb-4">Privacy Policy</h1>
                    <div className="h-4 w-40 bg-primary border-2 border-black"></div>
                    <p className="mt-8 text-black font-bold opacity-60 uppercase tracking-widest text-xs">Last Updated: JANUARY 2026</p>
                </div>

                <div className="space-y-8 text-black leading-relaxed">
                    <section>
                        <h2 className="text-2xl font-black uppercase italic mb-6 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-primary border-2 border-black flex items-center justify-center text-sm">01</span>
                            Introduction
                        </h2>
                        <p className="text-sm font-medium mb-4">
                            This Privacy Policy describes how <span className="font-black">ExamBuddy</span> and its affiliates (collectively "ExamBuddy, we, our, us") collect, use, share, protect or otherwise process your information/ personal data through our website <span className="font-black">www.ncetbuddy.in</span> (hereinafter referred to as Platform). Please note that you may be able to browse certain sections of the Platform without registering with us.
                        </p>
                        <p className="text-sm font-medium">
                            We do not offer any product/service under this Platform outside India and your personal data will primarily be stored and processed in India. By visiting this Platform, providing your information or availing any product/service offered on the Platform, you expressly agree to be bound by the terms and conditions of this Privacy Policy, the Terms of Use and the applicable service/product terms and conditions, and agree to be governed by the laws of India including but not limited to the laws applicable to data protection and privacy. If you do not agree please do not use or access our Platform.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black uppercase italic mb-6 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-primary border-2 border-black flex items-center justify-center text-sm">02</span>
                            Collection
                        </h2>
                        <p className="text-sm font-medium mb-4">
                            We collect your personal data when you use our Platform, services or otherwise interact with us during the course of our relationship and related information provided from time to time. Some of the information that we may collect includes but is not limited to personal data / information provided to us during sign-up/registering or using our Platform such as name, date of birth, address, telephone/mobile number, email ID and/or any such information shared as proof of identity or address.
                        </p>
                        <p className="text-sm font-medium mb-4">
                            Some of the sensitive personal data may be collected with your consent, such as your bank account or credit or debit card or other payment instrument information or biometric information such as your facial features or physiological information (in order to enable use of certain features when opted for, available on the Platform) etc all of the above being in accordance with applicable law(s).
                        </p>
                        <p className="text-sm font-medium mb-4">
                            You always have the option to not provide information, by choosing not to use a particular service or feature on the Platform.
                        </p>
                        <p className="text-sm font-medium mb-4">
                            We may track your behaviour, preferences, and other information that you choose to provide on our Platform. This information is compiled and analysed on an aggregated basis.
                        </p>
                        <p className="text-sm font-medium mb-4">
                            We will also collect your information related to your transactions on Platform and such third-party business partner platforms. When such a third-party business partner collects your personal data directly from you, you will be governed by their privacy policies. We shall not be responsible for the third-party business partner's privacy practices or the content of their privacy policies, and we request you to read their privacy policies prior to disclosing any information.
                        </p>
                        <div className="p-6 bg-primary/10 border-4 border-black rounded-2xl">
                            <p className="text-xs font-black uppercase">
                                If you receive an email, a call from a person/association claiming to be ExamBuddy seeking any personal data like debit/credit card PIN, net-banking or mobile banking password, we request you to never provide such information. If you have already revealed such information, report it immediately to an appropriate law enforcement agency.
                            </p>
                        </div>
                    </section>

                    <section className="p-8 bg-black text-white border-4 border-black rounded-3xl shadow-[12px_12px_0px_0px_rgba(255,208,47,1)]">
                        <h2 className="text-2xl font-black uppercase italic mb-6 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-primary text-black border-2 border-black flex items-center justify-center text-sm">03</span>
                            Usage
                        </h2>
                        <p className="text-sm text-gray-300 mb-4">
                            We use personal data to provide the services you request. To the extent we use your personal data to market to you, we will provide you the ability to opt-out of such uses.
                        </p>
                        <p className="text-sm text-gray-300 mb-4">
                            We use your personal data to assist sellers and business partners in handling and fulfilling orders; enhancing customer experience; to resolve disputes; troubleshoot problems; inform you about online and offline offers, products, services, and updates; customise your experience; detect and protect us against error, fraud and other criminal activity; enforce our terms and conditions; conduct marketing research, analysis and surveys; and as otherwise described to you at the time of collection of information.
                        </p>
                        <p className="text-sm text-gray-300">
                            You understand that your access to these products/services may be affected in the event permission is not provided to us.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black uppercase italic mb-6 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-primary border-2 border-black flex items-center justify-center text-sm">04</span>
                            Sharing
                        </h2>
                        <p className="text-sm font-medium mb-4">
                            We may share your personal data internally within our group entities, our other corporate entities, and affiliates to provide you access to the services and products offered by them. These entities and affiliates may market to you as a result of such sharing unless you explicitly opt-out.
                        </p>
                        <p className="text-sm font-medium mb-4">
                            We may disclose personal data to third parties such as sellers, business partners, third party service providers including logistics partners, prepaid payment instrument issuers, third-party reward programs and other payment opted by you.
                        </p>
                        <p className="text-sm font-medium mb-4">
                            These disclosure may be required for us to provide you access to our services and products offered to you, to comply with our legal obligations, to enforce our user agreement, to facilitate our marketing and advertising activities, to prevent, detect, mitigate, and investigate fraudulent or illegal activities related to our services.
                        </p>
                        <p className="text-sm font-medium mb-4">
                            We may disclose personal and sensitive personal data to government agencies or other authorised law enforcement agencies if required to do so by law or in the good faith belief that such disclosure is reasonably necessary to respond to subpoenas, court orders, or other legal process.
                        </p>
                        <p className="text-sm font-medium">
                            We may disclose personal data to law enforcement offices, third party rights owners, or others in the good faith belief that such disclosure is reasonably necessary to enforce our Terms of Use or Privacy Policy; respond to claims that an advertisement, posting or other content violates the rights of a third party; or protect the rights, property or personal safety of our users or the general public.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black uppercase italic mb-6 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-primary border-2 border-black flex items-center justify-center text-sm">05</span>
                            Security Precautions
                        </h2>
                        <p className="text-sm font-medium mb-4">
                            To protect your personal data from unauthorised access or disclosure, loss or misuse we adopt reasonable security practices and procedures. Once your information is in our possession or whenever you access your account information, we adhere to our security guidelines to protect it against unauthorised access and offer the use of a secure server.
                        </p>
                        <p className="text-sm font-medium mb-4">
                            However, the transmission of information is not completely secure for reasons beyond our control. By using the Platform, the users accept the security implications of data transmission over the internet and the World Wide Web which cannot always be guaranteed as completely secure, and therefore, there would always remain certain inherent risks regarding use of the Platform.
                        </p>
                        <p className="text-sm font-medium">
                            Users are responsible for ensuring the protection of login and password records for their account.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black uppercase italic mb-6 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-primary border-2 border-black flex items-center justify-center text-sm">06</span>
                            Data Deletion and Retention
                        </h2>
                        <p className="text-sm font-medium mb-4">
                            You have an option to delete your account by visiting your profile and settings on our Platform, this action would result in you losing all information related to your account. You may also write to us at the contact information provided below to assist you with these requests.
                        </p>
                        <p className="text-sm font-medium mb-4">
                            We may in event of any pending grievance, claims, pending shipments or any other services we may refuse or delay deletion of the account.
                        </p>
                        <p className="text-sm font-medium mb-4">
                            Once the account is deleted, you will lose access to the account.
                        </p>
                        <p className="text-sm font-medium mb-4">
                            We retain your personal data information for a period no longer than is required for the purpose for which it was collected or as required under any applicable law.
                        </p>
                        <p className="text-sm font-medium">
                            However, we may retain data related to you if we believe it may be necessary to prevent fraud or future abuse or for other legitimate purposes. We may continue to retain your data in anonymised form for analytical and research purposes.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black uppercase italic mb-6 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-primary border-2 border-black flex items-center justify-center text-sm">07</span>
                            Your Rights
                        </h2>
                        <p className="text-sm font-medium">
                            You may access, rectify, and update your personal data directly through the functionalities provided on the Platform.
                        </p>
                    </section>

                    <section className="p-8 bg-primary/10 border-4 border-black rounded-3xl">
                        <h2 className="text-2xl font-black uppercase italic mb-6 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-black text-primary border-2 border-black flex items-center justify-center text-sm">08</span>
                            Consent
                        </h2>
                        <p className="text-sm font-medium mb-4">
                            By visiting our Platform or by providing your information, you consent to the collection, use, storage, disclosure and otherwise processing of your information on the Platform in accordance with this Privacy Policy.
                        </p>
                        <p className="text-sm font-medium mb-4">
                            If you disclose to us any personal data relating to other people, you represent that you have the authority to do so and permit us to use the information in accordance with this Privacy Policy.
                        </p>
                        <p className="text-sm font-medium mb-4">
                            You, while providing your personal data over the Platform or any partner platforms or establishments, consent to us (including our other corporate entities, affiliates, lending partners, technology partners, marketing channels, business partners and other third parties) to contact you through SMS, instant messaging apps, call and/or e-mail for the purposes specified in this Privacy Policy.
                        </p>
                        <p className="text-sm font-medium mb-4">
                            You have an option to withdraw your consent that you have already provided by writing to the Grievance Officer at the contact information provided below. Please mention <span className="font-black">"Withdrawal of consent for processing personal data"</span> in your subject line of your communication.
                        </p>
                        <p className="text-sm font-medium mb-4">
                            We may verify such requests before acting on our request. However, please note that your withdrawal of consent will not be retrospective and will be in accordance with the Terms of Use, this Privacy Policy, and applicable laws.
                        </p>
                        <p className="text-sm font-medium">
                            In the event you withdraw consent given to us under this Privacy Policy, we reserve the right to restrict or deny the provision of our services for which we consider such information to be necessary.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black uppercase italic mb-6 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-primary border-2 border-black flex items-center justify-center text-sm">09</span>
                            Changes to this Privacy Policy
                        </h2>
                        <p className="text-sm font-medium">
                            Please check our Privacy Policy periodically for changes. We may update this Privacy Policy to reflect changes to our information practices. We may alert / notify you about the significant changes to the Privacy Policy, in the manner as may be required under applicable laws.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black uppercase italic mb-6 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-primary border-2 border-black flex items-center justify-center text-sm">10</span>
                            Contact Us
                        </h2>
                        <p className="text-sm font-medium">
                            If you have any questions about this Privacy Policy or our privacy practices, please contact us at:
                            <span className="text-primary font-black ml-2 underline underline-offset-4 decoration-2">connect@ncetbuddy.in</span>
                        </p>
                    </section>
                </div>

                <div className="mt-20 pt-10 border-t-4 border-black text-center">
                    <Link href="/">
                        <Button className="bg-primary border-4 border-black text-black font-black py-4 px-10 h-auto text-lg shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
                            I ACCEPT
                        </Button>
                    </Link>
                </div>
            </div>
        </main>
    );
}
