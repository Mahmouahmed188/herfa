import React from 'react';
import Link from 'next/link';
import Button from '@/components/ui/button';
import {
    Target,
    Lightbulb,
    Users,
    Hammer,
    ShieldCheck,
    CheckCircle,
    Cpu,
    BadgeCheck,
    MessageSquare,
    Scale
} from 'lucide-react';

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-gray-100">
            {/* 1. Hero Section */}
            <section className="relative py-24 px-6 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
                <div className="container mx-auto max-w-4xl text-center relative z-10">
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight text-slate-900 dark:text-white">
                        About <span className="text-primary">Herfa</span>
                    </h1>
                    <p className="text-xl text-slate-600 dark:text-gray-300 leading-relaxed">
                        Herfa is the definitive platform connecting skilled technicians with clients who value quality.
                        We combine AI-driven diagnostics with a trusted network of professionals to revolutionize
                        how construction and maintenance services are delivered.
                    </p>
                </div>
            </section>

            {/* 2. Mission & Vision */}
            <section className="py-16 px-6 bg-white dark:bg-surface-dark border-y border-gray-200 dark:border-surface-border">
                <div className="container mx-auto max-w-6xl grid md:grid-cols-2 gap-12">
                    {/* Mission */}
                    <div className="flex flex-col items-center text-center p-8 rounded-3xl bg-gray-50 dark:bg-[#151a14] border border-gray-100 dark:border-surface-border">
                        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 text-primary">
                            <Target className="w-8 h-8" />
                        </div>
                        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Our Mission</h2>
                        <p className="text-slate-600 dark:text-gray-400">
                            To empower skilled workers by providing them with dignified, verified opportunities,
                            while ensuring clients receive transparent, high-quality service every time.
                        </p>
                    </div>

                    {/* Vision */}
                    <div className="flex flex-col items-center text-center p-8 rounded-3xl bg-gray-50 dark:bg-[#151a14] border border-gray-100 dark:border-surface-border">
                        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 text-primary">
                            <Lightbulb className="w-8 h-8" />
                        </div>
                        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Our Vision</h2>
                        <p className="text-slate-600 dark:text-gray-400">
                            To become the ecosystem of trust for the construction industry, where technology
                            bridges the gap between complex problems and expert solutions.
                        </p>
                    </div>
                </div>
            </section>

            {/* 3. How Herfa Works */}
            <section className="py-20 px-6">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">How Herfa Works</h2>
                        <p className="text-slate-600 dark:text-gray-400">A seamless ecosystem designed for efficiency and trust.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Client Role */}
                        <div className="group p-8 rounded-3xl bg-white dark:bg-surface-dark border border-gray-200 dark:border-surface-border hover:shadow-xl transition-all hover:-translate-y-1">
                            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-6">
                                <Users className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">The Client</h3>
                            <p className="text-slate-600 dark:text-gray-400 text-sm">
                                Requests services seamlessly. Whether using our AI diagnosis tool or posting a job directly, clients find the right expert in minutes.
                            </p>
                        </div>

                        {/* Technician Role */}
                        <div className="group p-8 rounded-3xl bg-white dark:bg-surface-dark border border-gray-200 dark:border-surface-border hover:shadow-xl transition-all hover:-translate-y-1">
                            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                                <Hammer className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">The Technician</h3>
                            <p className="text-slate-600 dark:text-gray-400 text-sm">
                                Receives verified job opportunities matching their skills. Build a reputation, grow income, and focus on the craft.
                            </p>
                        </div>

                        {/* Admin Role */}
                        <div className="group p-8 rounded-3xl bg-white dark:bg-surface-dark border border-gray-200 dark:border-surface-border hover:shadow-xl transition-all hover:-translate-y-1">
                            <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center mb-6">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">The Admin</h3>
                            <p className="text-slate-600 dark:text-gray-400 text-sm">
                                Ensures the ecosystem remains healthy. Admins verify licenses, handle complex disputes, and maintain quality standards.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. Why Choose Herfa */}
            <section className="py-20 px-6 bg-slate-900 text-white rounded-3xl mx-4 lg:mx-10 relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 p-20 opacity-10">
                    <CheckCircle className="w-64 h-64" />
                </div>

                <div className="container mx-auto max-w-6xl relative z-10">
                    <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Why Choose Herfa?</h2>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="flex flex-col gap-4">
                            <BadgeCheck className="w-10 h-10 text-primary" />
                            <h4 className="font-bold text-lg">Verified Professionals</h4>
                            <p className="text-slate-300 text-sm">Every technician undergoes a strict vetting process including identity and skill verification.</p>
                        </div>
                        <div className="flex flex-col gap-4">
                            <Cpu className="w-10 h-10 text-primary" />
                            <h4 className="font-bold text-lg">AI-Powered Matching</h4>
                            <p className="text-slate-300 text-sm">Our algorithms analyze your problem and match you with the specialist best suited to fix it.</p>
                        </div>
                        <div className="flex flex-col gap-4">
                            <ShieldCheck className="w-10 h-10 text-primary" />
                            <h4 className="font-bold text-lg">Secure Payments</h4>
                            <p className="text-slate-300 text-sm">Funds are held in escrow and only released when you are satisfied with the work.</p>
                        </div>
                        <div className="flex flex-col gap-4">
                            <Target className="w-10 h-10 text-primary" />
                            <h4 className="font-bold text-lg">Transparent Ratings</h4>
                            <p className="text-slate-300 text-sm">See real reviews and ratings from other clients before you hire.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. Trust & Quality */}
            <section className="py-20 px-6">
                <div className="container mx-auto max-w-4xl">
                    <div className="flex flex-col md:flex-row gap-12 items-center">
                        <div className="flex-1 space-y-8">
                            <div>
                                <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">Unwavering Commitment to Quality</h2>
                                <p className="text-slate-600 dark:text-gray-400">
                                    We don't just connect people; we ensure success. Our trust framework is built on three pillars:
                                </p>
                            </div>

                            <ul className="space-y-6">
                                <li className="flex gap-4">
                                    <div className="mt-1 w-6 h-6 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center shrink-0">
                                        <CheckCircle className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 dark:text-white">Quality Assurance</h4>
                                        <p className="text-sm text-slate-600 dark:text-gray-400">Random site inspections and post-job verifications ensure standards.</p>
                                    </div>
                                </li>
                                <li className="flex gap-4">
                                    <div className="mt-1 w-6 h-6 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center shrink-0">
                                        <MessageSquare className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 dark:text-white">24/7 Support</h4>
                                        <p className="text-sm text-slate-600 dark:text-gray-400">Our support team is always available to assist with any inquiries.</p>
                                    </div>
                                </li>
                                <li className="flex gap-4">
                                    <div className="mt-1 w-6 h-6 rounded-full bg-orange-500/20 text-orange-500 flex items-center justify-center shrink-0">
                                        <Scale className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 dark:text-white">Fair Dispute Handling</h4>
                                        <p className="text-sm text-slate-600 dark:text-gray-400">Impartial mediation if things don't go as planned.</p>
                                    </div>
                                </li>
                            </ul>
                        </div>

                        <div className="flex-1 w-full">
                            <div className="relative aspect-square rounded-3xl bg-surface-dark border border-surface-border overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
                                <div className="absolute inset-0 flex items-center justify-center flex-col text-center p-8">
                                    <ShieldCheck className="w-20 h-20 text-primary mb-4" />
                                    <h3 className="text-2xl font-bold text-white">Your Trust is Our Asset</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 6. Call To Action */}
            <section className="py-24 px-6 bg-gradient-to-b from-transparent to-primary/5">
                <div className="container mx-auto max-w-3xl text-center">
                    <h2 className="text-4xl font-extrabold mb-6 text-slate-900 dark:text-white">
                        Ready to Build Better?
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-gray-400 mb-10">
                        Join thousands of users and professionals on the fastest growing construction services platform.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/register?role=client">
                            <Button className="w-full sm:w-auto h-14 px-8 text-lg">
                                Join as a Client
                            </Button>
                        </Link>
                        <Link href="/register?role=technician">
                            <Button variant="outline" className="w-full sm:w-auto h-14 px-8 text-lg bg-transparent border-slate-300 dark:border-surface-border text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-surface-dark">
                                Join as a Technician
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
