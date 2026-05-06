'use client';

import * as React from 'react';
import { Link } from "@/lib/navigation";
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LayoutDashboard, List, User, Settings, LogOut, Users, Briefcase, Wallet, MessageCircle, Heart, ChevronRight } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

interface SidebarItem {
    name: string;
    href: string;
    icon: React.ElementType;
    badge?: string;
}

const clientItems: SidebarItem[] = [
    { name: 'Overview', href: '/client/dashboard', icon: LayoutDashboard },
    { name: 'My Orders', href: '/client/jobs', icon: List },
    { name: 'Wallet', href: '/client/wallet', icon: Wallet },
    { name: 'Saved', href: '/client/saved', icon: Heart },
    { name: 'Messages', href: '/support', icon: MessageCircle, badge: '2' },
    { name: 'Profile', href: '/client/profile', icon: User },
];

const technicianItems: SidebarItem[] = [
    { name: 'Dashboard', href: '/technician/dashboard', icon: LayoutDashboard },
    { name: 'Requests', href: '/technician/requests', icon: List },
    { name: 'Earnings', href: '/technician/earnings', icon: Wallet },
    { name: 'Profile', href: '/technician/profile', icon: User },
    { name: 'Messages', href: '/support', icon: MessageCircle },
];

const adminItems: SidebarItem[] = [
    { name: 'Overview', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Jobs', href: '/admin/jobs', icon: Briefcase },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export function AppSidebar({ role }: { role: 'client' | 'technician' | 'admin' }) {
    const pathname = usePathname();
    const { logout, user } = useAuthStore();

    const items = role === 'client' ? clientItems : role === 'technician' ? technicianItems : adminItems;
    const roleLabel = role === 'client' ? 'Customer Portal' : role === 'technician' ? 'Technician Portal' : 'Admin Panel';
    const userName = user?.name ?? 'User';

    return (
        <div className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 bg-background-dark border-r border-surface-border overflow-y-auto z-30">
            {/* Logo */}
            <div className="flex items-center gap-3 px-6 py-5 border-b border-surface-border">
                <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30 shrink-0">
                    <span className="text-white font-bold text-lg">H</span>
                </div>
                <div>
                    <p className="text-white font-bold leading-none">Herfa</p>
                    <p className="text-gray-500 text-xs mt-0.5">{roleLabel}</p>
                </div>
            </div>

            {/* User */}
            <div className="px-4 py-4 border-b border-surface-border">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-dark">
                    <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                        <span className="text-primary font-bold text-sm">{userName.charAt(0).toUpperCase()}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-white font-semibold text-sm truncate">{userName}</p>
                        <p className="text-gray-500 text-xs capitalize">{role}</p>
                    </div>
                </div>
            </div>

            {/* Nav items */}
            <nav className="flex-1 px-3 py-4 space-y-1">
                {items.map((item) => {
                    const isActive = pathname.endsWith(item.href) || pathname.includes(item.href + '/');
                    return (
                        <Link key={item.href} href={item.href as any}>
                            <div
                                className={cn(
                                    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group',
                                    isActive
                                        ? 'bg-primary/10 text-primary'
                                        : 'text-gray-400 hover:bg-surface-dark hover:text-white'
                                )}
                            >
                                <item.icon className={cn('w-4 h-4 shrink-0', isActive ? 'text-primary' : 'text-gray-500 group-hover:text-gray-300')} />
                                <span className="flex-1">{item.name}</span>
                                {item.badge && (
                                    <span className="w-5 h-5 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold">
                                        {item.badge}
                                    </span>
                                )}
                                {isActive && <ChevronRight className="w-3 h-3 text-primary shrink-0" />}
                            </div>
                        </Link>
                    );
                })}
            </nav>

            {/* Logout */}
            <div className="px-3 py-4 border-t border-surface-border">
                <button
                    onClick={() => logout()}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-all group"
                >
                    <LogOut className="w-4 h-4 group-hover:text-red-400 transition-colors" />
                    Logout
                </button>
            </div>
        </div>
    );
}
