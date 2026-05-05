import { LoginForm } from '@/features/auth/LoginForm';
import { Link } from "@/lib/navigation";
export default function LoginPage() {
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
                        Connect with <span className="text-primary">expert</span> technicians
                    </h2>
                    <p className="text-gray-400 text-lg leading-relaxed">
                        Trusted by thousands of homeowners and engineers. Get your job done right, the first time.
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-6 mt-10">
                        {[
                            { value: '15k+', label: 'Technicians' },
                            { value: '98%', label: 'Satisfaction' },
                            { value: '2.5M', label: 'Jobs Done' },
                        ].map((stat) => (
                            <div key={stat.label} className="text-center p-4 rounded-2xl bg-white/5 border border-white/10">
                                <p className="text-primary text-2xl font-bold">{stat.value}</p>
                                <p className="text-gray-400 text-xs mt-1">{stat.label}</p>
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
                <LoginForm />
            </div>
        </div>
    );
}
