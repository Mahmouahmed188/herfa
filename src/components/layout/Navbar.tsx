'use client';

import * as React from 'react';
import { Menu, Bell, User as UserIcon, X, Check, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LanguageSwitcher from '@/components/common/LanguageSwitcher';
import { Link } from '@/lib/navigation';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '@/services/api';
import { cn } from '@/lib/utils';

export function Navbar() {
    const t = useTranslations('Navbar');
    const pathname = usePathname();
    const queryClient = useQueryClient();
    
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
    const [showNotifications, setShowNotifications] = React.useState(false);
    const [mounted, setMounted] = React.useState(false);
    const { isAuthenticated, user, logout } = useAuthStore();

    const notificationsRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        setMounted(true);
        
        const handleClickOutside = (event: MouseEvent) => {
            if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
                setShowNotifications(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Notifications Queries
    const { data: notifications } = useQuery({
        queryKey: ['notifications'],
        queryFn: () => api.getNotifications(),
        enabled: isAuthenticated,
    });

    const { data: unreadCount } = useQuery({
        queryKey: ['unreadNotificationsCount'],
        queryFn: () => api.getUnreadNotificationsCount(),
        enabled: isAuthenticated,
        refetchInterval: 30000, // Poll every 30s
    });

    const markReadMutation = useMutation({
        mutationFn: (ids: string[]) => api.markNotificationsAsRead(ids),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
            queryClient.invalidateQueries({ queryKey: ['unreadNotificationsCount'] });
        }
    });

    const getDashboardPath = () => {
        if (user?.role === 'admin') return '/admin/dashboard' as const;
        if (user?.role === 'technician') return '/technician/dashboard' as const;
        return '/client/dashboard' as const;
    };

    const navLinks = [
        { href: '/services', label: t('services'), hideForTechnician: true },
        { href: '/ai-diagnosis', label: t('aiDiagnosis'), hideForTechnician: true },
        { href: '/technicians', label: t('technicians'), hideForTechnician: true },
        { href: '/about', label: t('about'), hideForTechnician: false },
    ];

    const isActive = (href: string) => {
        if (href === '/') return pathname === '/' || pathname === '/en' || pathname === '/ar';
        return pathname.includes(href);
    };

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-surface-border bg-background-dark/80 backdrop-blur-md">
            <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                
                {/* 4. LOGO UPDATE (Icon Only) */}
                <Link href="/" className="flex items-center group">
                    <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-surface-dark group-hover:bg-primary/20 transition-all duration-300 shadow-lg group-hover:shadow-primary/10">
                        <span className="material-symbols-outlined text-3xl text-primary group-hover:scale-110 transition-transform">construction</span>
                    </div>
                </Link>

                {/* 1. ACTIVE NAVIGATION STATE (Desktop) */}
                <div className="hidden md:flex items-center gap-1 bg-surface-dark/50 p-1 rounded-2xl border border-surface-border">
                    {navLinks
                        .filter(link => !link.hideForTechnician || user?.role !== 'technician')
                        .map(link => (
                            <Link 
                                key={link.href} 
                                href={link.href as any}
                                className={cn(
                                    "relative px-5 py-2.5 text-sm font-semibold transition-all duration-300 rounded-xl overflow-hidden group",
                                    isActive(link.href) 
                                        ? "text-primary" 
                                        : "text-gray-400 hover:text-white"
                                )}
                            >
                                {isActive(link.href) && (
                                    <motion.div 
                                        layoutId="activeNav"
                                        className="absolute inset-0 bg-primary/10 z-0"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                                <span className="relative z-10">{link.label}</span>
                            </Link>
                        ))
                    }
                </div>

                {/* Actions */}
                <div className="hidden md:flex items-center gap-3">
                    <LanguageSwitcher />
                    
                    {mounted && isAuthenticated && (
                        <div className="flex items-center gap-3">
                            {/* 2. NOTIFICATION BELL */}
                            <div className="relative" ref={notificationsRef}>
                                <button
                                    onClick={() => setShowNotifications(!showNotifications)}
                                    className={cn(
                                        "relative p-2.5 rounded-xl bg-surface-dark border border-surface-border text-gray-400 hover:text-white hover:border-primary/50 transition-all duration-300",
                                        showNotifications && "text-primary border-primary/50 bg-primary/5"
                                    )}
                                >
                                    <Bell className="w-5 h-5" />
                                    {unreadCount?.count > 0 && (
                                        <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full ring-2 ring-background-dark" />
                                    )}
                                </button>

                                <AnimatePresence>
                                    {showNotifications && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            className="absolute right-0 mt-3 w-80 bg-background-dark border border-surface-border rounded-[24px] shadow-2xl overflow-hidden z-50"
                                        >
                                            <div className="p-4 border-b border-surface-border flex items-center justify-between">
                                                <h3 className="text-white font-bold">Notifications</h3>
                                                {unreadCount?.count > 0 && (
                                                    <button 
                                                        onClick={() => markReadMutation.mutate(notifications?.map((n: any) => n.id))}
                                                        className="text-[10px] uppercase font-bold text-primary hover:underline"
                                                    >
                                                        Mark all as read
                                                    </button>
                                                )}
                                            </div>
                                            <div className="max-h-[400px] overflow-y-auto">
                                                {notifications && notifications.length > 0 ? (
                                                    notifications.map((n: any) => (
                                                        <div key={n.id} className="p-4 border-b border-surface-border/50 hover:bg-surface-dark transition-colors cursor-pointer group">
                                                            <div className="flex gap-3">
                                                                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                                                    <AlertCircle className="w-4 h-4 text-primary" />
                                                                </div>
                                                                <div>
                                                                    <p className="text-xs text-white font-medium mb-1">{n.title}</p>
                                                                    <p className="text-[11px] text-gray-500 line-clamp-2">{n.message}</p>
                                                                    <p className="text-[9px] text-gray-600 mt-2">{new Date(n.createdAt).toLocaleDateString()}</p>
                                                                </div>
                                                                {!n.read && <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0" />}
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="p-12 text-center">
                                                        <div className="w-12 h-12 rounded-full bg-surface-dark flex items-center justify-center mx-auto mb-4 text-gray-600">
                                                            <Bell className="w-6 h-6" />
                                                        </div>
                                                        <p className="text-gray-500 text-sm font-medium">No notifications yet</p>
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* 3. DASHBOARD / PROFILE ICON REDESIGN */}
                            <div className="relative group/tooltip">
                                <Link href={getDashboardPath()}>
                                    <button className="p-2.5 rounded-xl bg-surface-dark border border-surface-border text-gray-400 hover:text-white hover:border-primary/50 transition-all duration-300 flex items-center justify-center">
                                        <UserIcon className="w-5 h-5" />
                                    </button>
                                </Link>
                                {/* Tooltip */}
                                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1.5 bg-white text-black text-[10px] font-bold rounded-lg opacity-0 group-hover/tooltip:opacity-100 pointer-events-none transition-all duration-300 whitespace-nowrap shadow-xl">
                                    {user?.role === 'technician' ? 'Technician Portal' : 'User Dashboard'}
                                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-b-white" />
                                </div>
                            </div>

                            <Button 
                                variant="ghost" 
                                size="sm"
                                className="text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl" 
                                onClick={logout}
                            >
                                Sign Out
                            </Button>
                        </div>
                    )}

                    {mounted && !isAuthenticated && (
                        <Link href="/login">
                            <Button className="rounded-xl px-8 font-bold bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20">
                                {t('login')}
                            </Button>
                        </Link>
                    )}
                </div>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden p-2 text-white bg-surface-dark rounded-xl"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden border-t border-surface-border bg-background-dark overflow-hidden"
                    >
                        <div className="p-6 space-y-4">
                            <div className="flex flex-col gap-2">
                                {navLinks
                                    .filter(link => !link.hideForTechnician || user?.role !== 'technician')
                                    .map(link => (
                                        <Link 
                                            key={link.href} 
                                            href={link.href as any}
                                            onClick={() => setMobileMenuOpen(false)}
                                            className={cn(
                                                "p-4 rounded-xl text-lg font-bold transition-all",
                                                isActive(link.href) 
                                                    ? "bg-primary/10 text-primary" 
                                                    : "text-gray-400 hover:text-white hover:bg-surface-dark"
                                            )}
                                        >
                                            {link.label}
                                        </Link>
                                    ))
                                }
                            </div>
                            
                            <div className="pt-4 border-t border-surface-border flex flex-col gap-3">
                                {mounted && (
                                    isAuthenticated ? (
                                        <>
                                            <Link href={getDashboardPath()} onClick={() => setMobileMenuOpen(false)}>
                                                <Button className="w-full h-14 rounded-xl font-bold text-lg">
                                                    Dashboard
                                                </Button>
                                            </Link>
                                            <Button
                                                variant="ghost"
                                                className="w-full h-14 justify-center text-lg font-bold text-red-400 hover:bg-red-400/10 rounded-xl"
                                                onClick={() => {
                                                    logout();
                                                    setMobileMenuOpen(false);
                                                }}
                                            >
                                                Sign Out
                                            </Button>
                                        </>
                                    ) : (
                                        <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                                            <Button className="w-full h-14 rounded-xl font-bold text-lg">
                                                {t('login')}
                                            </Button>
                                        </Link>
                                    )
                                )}
                                <div className="flex justify-center p-2">
                                    <LanguageSwitcher />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
