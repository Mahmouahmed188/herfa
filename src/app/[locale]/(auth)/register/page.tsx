import { RegisterForm } from '@/features/auth/RegisterForm';
import Link from 'next/link';

export default function RegisterPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-muted/20">
            <div className="mb-8">
                <Link href="/" className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded bg-primary flex items-center justify-center">
                        <span className="text-primary-foreground font-bold text-xl">H</span>
                    </div>
                    <span className="text-2xl font-bold tracking-tight">Herfa</span>
                </Link>
            </div>
            <RegisterForm />
        </div>
    );
}
