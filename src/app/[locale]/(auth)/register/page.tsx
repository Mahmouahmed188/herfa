import { RegisterForm } from '@/features/auth/RegisterForm';
import Link from 'next/link';

export default function RegisterPage() {
    return (
        <div className="min-h-screen flex bg-background-light dark:bg-background-dark">
            {/* Left panel - branding */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-background-dark overflow-hidden flex-col justify-between p-12">
                {/* Gradient orbs */}
                <div className="absolute top-0 left-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

                {/* Logo */}
                <div className="relative z-10">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
                            <span className="text-white font-bold text-xl">H</span>
                        </div>
                        <span className="text-white text-2xl font-bold">Herfa</span>
                    </Link>
                </div>

                {/* Center content */}
                <div className="relative z-10">
                    <h2 className="text-white text-4xl font-bold leading-tight mb-4">
                        Join the <span className="text-primary">Herfa</span> community today
                    </h2>
                    <p className="text-gray-400 text-lg leading-relaxed">
                        Whether you need a skilled hand or want to offer your expertise, Herfa connects you with the right people.
                    </p>

                    <div className="space-y-4 mt-10">
                        {[
                            { icon: '✓', text: 'Verified & insured technicians' },
                            { icon: '✓', text: 'AI-powered problem diagnosis' },
                            { icon: '✓', text: 'Secure payment & escrow' },
                            { icon: '✓', text: '24/7 customer support' },
                        ].map((item) => (
                            <div key={item.text} className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-bold shrink-0">
                                    {item.icon}
                                </div>
                                <span className="text-gray-300 text-sm">{item.text}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="relative z-10">
                    <p className="text-gray-600 text-sm">© 2024 Herfa Inc. All rights reserved.</p>
                </div>
            </div>

            {/* Right panel - form */}
            <div className="flex-1 flex flex-col items-center justify-center p-8">
                {/* Mobile logo */}
                <div className="lg:hidden mb-8">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
                            <span className="text-white font-bold text-xl">H</span>
                        </div>
                        <span className="text-2xl font-bold tracking-tight">Herfa</span>
                    </Link>
                </div>
                <RegisterForm />
            </div>
        </div>
    );
}
