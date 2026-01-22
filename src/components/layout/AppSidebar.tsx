'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, PlusCircle, List, User, Settings, LogOut, Users, Briefcase } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

interface SidebarItem {
    name: string;
    href: string;
    icon: React.ElementType;
}

const clientItems: SidebarItem[] = [
    { name: 'Dashboard', href: '/client/dashboard', icon: LayoutDashboard },
    { name: 'New Job', href: '/client/create-job', icon: PlusCircle },
    { name: 'My Jobs', href: '/client/jobs', icon: List },
    { name: 'Profile', href: '/client/profile', icon: User },
];

const technicianItems: SidebarItem[] = [
    { name: 'Dashboard', href: '/technician/dashboard', icon: LayoutDashboard },
    { name: 'Requests', href: '/technician/requests', icon: List },
    { name: 'Profile', href: '/technician/profile', icon: User },
    { name: 'Earnings', href: '/technician/earnings', icon: User }, // Reuse Icon for now
];

const adminItems: SidebarItem[] = [
    { name: 'Overview', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Jobs', href: '/admin/jobs', icon: Briefcase },
    { name: 'Complaints', href: '/admin/complaints', icon: Settings }, // Using Settings icon for now
];

export function AppSidebar({ role }: { role: 'client' | 'technician' | 'admin' }) {
    const pathname = usePathname();
    const { logout } = useAuthStore();

    const items = role === 'client' ? clientItems : role === 'technician' ? technicianItems : role === 'admin' ? adminItems : [];

    return (
        <div className="hidden border-r bg-muted/40 md:block w-64 h-full fixed left-0 top-0 overflow-y-auto">
            <div className="flex h-16 items-center border-b px-6">
                <Link href="/" className="flex items-center gap-2 font-bold text-lg">
                    <div className="h-8 w-8 rounded bg-primary flex items-center justify-center">
                        <span className="text-primary-foreground font-bold">H</span>
                    </div>
                    <span>Herfa</span>
                </Link>
            </div>
            <div className="flex flex-col gap-2 p-4">
                {items.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link key={item.href} href={item.href}>
                            <Button
                                variant={isActive ? 'secondary' : 'ghost'}
                                className={cn("w-full justify-start", isActive && "bg-secondary")}
                            >
                                <item.icon className="mr-2 h-4 w-4" />
                                {item.name}
                            </Button>
                        </Link>
                    );
                })}
            </div>
            <div className="absolute bottom-4 left-4 right-4">
                <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive" onClick={() => logout()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                </Button>
            </div>
        </div>
    );
}
