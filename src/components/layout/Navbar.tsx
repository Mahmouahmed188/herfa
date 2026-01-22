'use client';

import * as React from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LanguageSwitcher from '@/components/common/LanguageSwitcher';
import { Link } from '@/lib/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { useTranslations } from 'next-intl';

export function Navbar() {
    const t = useTranslations('Navbar');
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
    const [mounted, setMounted] = React.useState(false);
    const { isAuthenticated, user, logout } = useAuthStore();

    React.useEffect(() => {
        setMounted(true);
    }, []);

    const getDashboardPath = () => {
        if (user?.role === 'admin') return '/admin/dashboard' as const;
        if (user?.role === 'technician') return '/technician/dashboard' as const;
        return '/client/dashboard' as const;
    };

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-surfaceBorder bg-backgroundDark/80 backdrop-blur-md">
            <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="flex items-center justify-center p-2 rounded-lg bg-surfaceDark group-hover:bg-primary/20 transition-colors">
                        <span className="material-symbols-outlined text-3xl text-primary">construction</span>
                    </div>
                    <span className="text-xl font-bold tracking-tight text-white">Herfa</span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    <Link href="/services" className="text-sm font-medium text-gray-300 hover:text-primary transition-colors">
                        {t('services')}
                    </Link>
                    <Link href="/ai-diagnosis" className="text-sm font-medium text-gray-300 hover:text-primary transition-colors">
                        {t('aiDiagnosis')}
                    </Link>
                    <Link href="/technicians" className="text-sm font-medium text-gray-300 hover:text-primary transition-colors">
                        {t('technicians')}
                    </Link>
                    <Link href="/about" className="text-sm font-medium text-gray-300 hover:text-primary transition-colors">
                        {t('about')}
                    </Link>
                </div>

                {/* Actions */}
                <div className="hidden md:flex items-center gap-4">
                    <LanguageSwitcher />
                    {mounted && (
                        isAuthenticated ? (
                            <div className="flex items-center gap-4">
                                <Link href={getDashboardPath()}>
                                    <Button variant="secondary">Dashboard</Button>
                                </Link>
                                <Button variant="ghost" className="text-gray-300" onClick={logout}>
                                    Logout
                                </Button>
                            </div>
                        ) : (
                            <Link href="/login">
                                <Button variant="primary">
                                    {t('login')}
                                </Button>
                            </Link>
                        )
                    )}
                </div>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden p-2 text-white"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    <Menu className="w-6 h-6" />
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t border-surfaceBorder bg-backgroundDark p-6 space-y-4 absolute w-full shadow-2xl">
                    <div className="flex flex-col gap-4">
                        <Link href="/services" className="text-lg font-medium text-gray-300">{t('services')}</Link>
                        <Link href="/ai-diagnosis" className="text-lg font-medium text-gray-300">{t('aiDiagnosis')}</Link>
                        <Link href="/technicians" className="text-lg font-medium text-gray-300">{t('technicians')}</Link>
                        <Link href="/about" className="text-lg font-medium text-gray-300">{t('about')}</Link>
                        {mounted && (
                            isAuthenticated ? (
                                <>
                                    <Link href={getDashboardPath()} className="text-lg font-medium text-gray-300">
                                        Dashboard
                                    </Link>
                                    <Button
                                        variant="ghost"
                                        className="w-full justify-start text-lg font-medium text-gray-300 px-0"
                                        onClick={logout}
                                    >
                                        Logout
                                    </Button>
                                </>
                            ) : (
                                <Link href="/login" className="w-full">
                                    <Button className="w-full justify-center">{t('login')}</Button>
                                </Link>
                            )
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
