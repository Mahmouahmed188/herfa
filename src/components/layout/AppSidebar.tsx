'use client';

import * as React from 'react';
import { Link } from "@/lib/navigation";
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
    LayoutDashboard, List, User, Settings, LogOut, 
    Users, Briefcase, Wallet, MessageCircle, Heart, 
    ChevronRight, CheckCircle, ShieldCheck, ChevronLeft, PanelLeftClose, PanelLeftOpen
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useSidebar } from '@/context/SidebarContext';
import { motion, AnimatePresence } from 'framer-motion';

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
    { name: 'Onboarding', href: '/technician/onboarding-home', icon: ShieldCheck },
    { name: 'Dashboard', href: '/technician/dashboard', icon: LayoutDashboard },
    { name: 'Requests', href: '/technician/requests', icon: List },
    { name: 'My Offers', href: '/technician/offers', icon: Briefcase },
    { name: 'Active Jobs', href: '/technician/jobs', icon: CheckCircle },
    { name: 'Messages', href: '/technician/messages', icon: MessageCircle },
    { name: 'Profile', href: '/technician/profile', icon: User },
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
    const { isCollapsed, toggleSidebar } = useSidebar();

    const items = role === 'client' ? clientItems : role === 'technician' ? technicianItems : adminItems;
    const roleLabel = role === 'client' ? 'Customer Portal' : role === 'technician' ? 'Technician Portal' : 'Admin Panel';
    const userName = user?.name ?? 'User';

    return (
        <motion.div 
            initial={false}
            animate={{ width: isCollapsed ? 80 : 260 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="hidden md:flex flex-col h-screen fixed left-0 top-0 bg-background-dark border-r border-surface-border overflow-hidden z-30"
        >
            {/* Logo Section */}
            <div className="flex items-center justify-between px-5 py-5 border-b border-surface-border overflow-hidden">
                <div className="flex items-center gap-3 overflow-hidden">
                    <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30 shrink-0">
                        <span className="text-white font-bold text-lg">H</span>
                    </div>
                    {!isCollapsed && (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            <p className="text-white font-bold leading-none">Herfa</p>
                            <p className="text-gray-500 text-[10px] mt-0.5 whitespace-nowrap">{roleLabel}</p>
                        </motion.div>
                    )}
                </div>
                
                {/* Toggle Button */}
                <button 
                    onClick={toggleSidebar}
                    className="p-1.5 rounded-lg text-gray-500 hover:bg-surface-dark hover:text-white transition-colors ml-auto"
                >
                    {isCollapsed ? <PanelLeftOpen className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
                </button>
            </div>

            {/* User Section */}
            <div className="px-3 py-4 border-b border-surface-border">
                <div className={cn(
                    "flex items-center gap-3 p-2 rounded-xl bg-surface-dark transition-all duration-300 overflow-hidden",
                    isCollapsed ? "justify-center" : ""
                )}>
                    <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                        <span className="text-primary font-bold text-sm">{userName.charAt(0).toUpperCase()}</span>
                    </div>
                    {!isCollapsed && (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="min-w-0 flex-1"
                        >
                            <p className="text-white font-semibold text-sm truncate">{userName}</p>
                            <p className="text-gray-500 text-xs capitalize">{role}</p>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Navigation Items */}
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
                {items
                    .filter(item => {
                        if (role === 'technician' && user?.status !== 'approved') {
                            return item.href === '/technician/onboarding-home';
                        }
                        if (role === 'technician' && user?.status === 'approved') {
                            return item.href !== '/technician/onboarding-home';
                        }
                        return true;
                    })
                    .map((item) => {
                    const isActive = pathname.endsWith(item.href) || pathname.includes(item.href + '/');
                    return (
                        <Link key={item.href} href={item.href as any}>
                            <div
                                className={cn(
                                    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group overflow-hidden',
                                    isActive
                                        ? 'bg-primary/10 text-primary'
                                        : 'text-gray-400 hover:bg-surface-dark hover:text-white',
                                    isCollapsed ? "justify-center" : ""
                                )}
                            >
                                <item.icon className={cn('w-5 h-5 shrink-0', isActive ? 'text-primary' : 'text-gray-500 group-hover:text-gray-300')} />
                                {!isCollapsed && (
                                    <motion.span 
                                        initial={{ opacity: 0, x: -5 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="flex-1 truncate"
                                    >
                                        {item.name}
                                    </motion.span>
                                )}
                                {!isCollapsed && item.badge && (
                                    <span className="w-5 h-5 rounded-full bg-primary text-white text-[10px] flex items-center justify-center font-bold">
                                        {item.badge}
                                    </span>
                                )}
                                {!isCollapsed && isActive && <ChevronRight className="w-3 h-3 text-primary shrink-0" />}
                            </div>
                        </Link>
                    );
                })}
            </nav>

            {/* Logout Section */}
            <div className="px-3 py-4 border-t border-surface-border">
                <button
                    onClick={() => logout()}
                    className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-all group overflow-hidden",
                        isCollapsed ? "justify-center" : ""
                    )}
                >
                    <LogOut className="w-5 h-5 shrink-0 group-hover:text-red-400 transition-colors" />
                    {!isCollapsed && (
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            Logout
                        </motion.span>
                    )}
                </button>
            </div>
        </motion.div>
    );
}
