'use client';

import React from 'react';
import { 
    LayoutDashboard, List, Briefcase, CheckCircle, 
    MessageCircle, TrendingUp, Wallet, Clock, 
    ArrowRight, Star, AlertCircle
} from 'lucide-react';
import { Link } from "@/lib/navigation";
import { useAuthStore } from '@/store/useAuthStore';
import { useQuery } from '@tanstack/react-query';
import * as api from '@/services/api';

export default function TechnicianDashboard() {
    const { user } = useAuthStore();

    // Fetch stats and recent items
    const { data: requests = [] } = useQuery({
        queryKey: ['openRequests'],
        queryFn: () => api.getOpenTenders(),
    });

    const { data: offers = [] } = useQuery({
        queryKey: ['myOffers'],
        queryFn: () => api.getMyOffersTechnician(),
    });

    const { data: activeJobs = [] } = useQuery({
        queryKey: ['activeJobs'],
        queryFn: () => api.getAssignedJobs({ status: 'IN_PROGRESS' }),
    });

    const stats = [
        { label: 'Pending Offers', value: offers.filter((o: any) => o.status === 'pending').length, icon: Briefcase, color: 'text-amber-500', bg: 'bg-amber-500/10' },
        { label: 'Active Jobs', value: activeJobs.length, icon: CheckCircle, color: 'text-primary', bg: 'bg-primary/10' },
        { label: 'Total Earnings', value: '$0', icon: Wallet, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
        { label: 'Rating', value: '5.0', icon: Star, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-white">Technician Dashboard</h1>
                <p className="text-gray-400 mt-1">Welcome back, {user?.name || 'Pro'}. Here's what's happening today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                    <div key={i} className="p-6 rounded-[24px] bg-surface-dark border border-surface-border">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
                                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                            <span className="text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">+0%</span>
                        </div>
                        <p className="text-2xl font-bold text-white">{stat.value}</p>
                        <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Requests */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-white">New Opportunities</h2>
                        <Link href="/technician/requests" className="text-primary text-sm font-semibold hover:underline flex items-center gap-1">
                            View All <ArrowRight className="w-3 h-3" />
                        </Link>
                    </div>
                    
                    <div className="space-y-3">
                        {requests.slice(0, 3).map((req: any) => (
                            <div key={req.id} className="p-5 rounded-[24px] bg-surface-dark border border-surface-border hover:border-primary/50 transition-all group">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-[10px] font-bold px-2 py-1 rounded-md bg-primary/10 text-primary uppercase tracking-wider">
                                                {req.service?.name || 'General'}
                                            </span>
                                            <span className="text-xs text-gray-500 flex items-center gap-1">
                                                <Clock className="w-3 h-3" /> {new Date(req.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <h3 className="text-white font-bold mb-1 truncate group-hover:text-primary transition-colors">{req.title}</h3>
                                        <p className="text-gray-400 text-sm line-clamp-1">{req.description}</p>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <p className="text-white font-black text-lg">${req.budgetMin || '?'}</p>
                                        <p className="text-[10px] text-gray-500 uppercase tracking-tighter">Starting Budget</p>
                                    </div>
                                </div>
                                <div className="mt-4 flex items-center justify-between border-t border-surface-border pt-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-surface-light border border-surface-border overflow-hidden">
                                            <img src={`https://i.pravatar.cc/100?u=${req.userId}`} alt="Client" />
                                        </div>
                                        <span className="text-xs text-gray-400">{req.user?.firstName || 'Client'}</span>
                                    </div>
                                    <Link href={`/tenders/${req.id}` as any}>
                                        <button className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-all">
                                            Submit Offer
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                        {requests.length === 0 && (
                            <div className="p-12 text-center border-2 border-dashed border-surface-border rounded-[32px]">
                                <AlertCircle className="w-10 h-10 text-gray-600 mx-auto mb-4" />
                                <p className="text-gray-500">No new requests available at the moment.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Active Jobs Summary */}
                <div className="space-y-4">
                    <h2 className="text-xl font-bold text-white">Active Jobs</h2>
                    <div className="space-y-3">
                        {activeJobs.slice(0, 3).map((job: any) => (
                            <div key={job.id} className="p-4 rounded-[20px] bg-surface-dark border border-surface-border">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                        <Briefcase className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-white font-bold text-sm truncate">{job.service?.name || job.title}</p>
                                        <p className="text-xs text-gray-500 truncate">{job.address}</p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full uppercase">In Progress</span>
                                    <Link href={`/technician/jobs` as any} className="text-xs text-primary hover:underline">Details</Link>
                                </div>
                            </div>
                        ))}
                        {activeJobs.length === 0 && (
                            <div className="p-8 text-center border border-surface-border rounded-[20px]">
                                <p className="text-xs text-gray-500">No active jobs.</p>
                            </div>
                        )}
                    </div>

                    {/* Messages Summary */}
                    <div className="mt-8">
                        <h2 className="text-xl font-bold text-white mb-4">Messages</h2>
                        <div className="p-4 rounded-[24px] bg-surface-dark border border-surface-border flex items-center gap-3 cursor-pointer hover:bg-surface-light transition-colors">
                            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
                                <MessageCircle className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-white font-bold text-sm">Support Chat</p>
                                <p className="text-xs text-gray-500 truncate">How can we help you today?</p>
                            </div>
                            <div className="w-2 h-2 rounded-full bg-primary" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
