'use client';

import {
    Wallet, TrendingUp, ClipboardList, CheckCircle2,
    Clock, Bell, Star, Gift, ArrowRight, Plus, MapPin
} from 'lucide-react';
import Link from 'next/link';

const activeOrders = [
    {
        id: 'ORD-2490',
        title: 'Kitchen Sink Repair',
        technician: 'Ahmed H.',
        status: 'arriving',
        statusLabel: 'Arriving Today, 2:00 PM',
        icon: '🔧',
        color: 'text-amber-500 bg-amber-500/10',
    },
    {
        id: 'ORD-2489',
        title: 'Living Room Wiring',
        technician: 'Sarah J.',
        status: 'scheduled',
        statusLabel: 'Scheduled: Oct 24, 10:00 AM',
        icon: '⚡',
        color: 'text-blue-500 bg-blue-500/10',
    },
    {
        id: 'ORD-2488',
        title: 'AC Maintenance',
        technician: 'Mike C.',
        status: 'in-progress',
        statusLabel: 'In Progress',
        icon: '❄️',
        color: 'text-primary bg-primary/10',
    },
];

const savedTechnicians = [
    { name: 'John Doe', specialty: 'Carpenter', rating: 4.9, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBZjQonIH3a-D03DzTjyLxRVdj8h_mOC9uQuZ_2eyw9lYHZH3ybvCl_w06OmfPT-vhAJd_BZAqrukCuqjRPjvB4CwSovBgVXdqGcErZu7uxBdYr1EMtVDAceg1LmDLC5BdRo6mird4hE7agG2pne_LwHcyuZ1zgTWbUFb9Wr5mtEOLCBqQr9xrQSVQSeKNVBdxObo8iSMXWbT2CpfJC_3J8VcPU_B7GPFEK__fDr-_2t0DFQSnrE99d7CLM3gaitRN1R72bi2mNZq8' },
    { name: 'Sarah Smith', specialty: 'Painter', rating: 4.8, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBZeBPhLaYOv_WKAvfRtlSbfjHHJKanQzYK24hrMHGowUuyIkEv6SdbnFrxBPo-KBR9ly7BOgvy6StG1WDXu8EOJejkL5dOCJdcH3t-UHLNFgFO43qlSiVXqIRplZzc3Vv1H1gn_SX0LRWDC8kftQYFHPVFTjnNNObxC3Dw6RJAh2wwq0SR3UbNV_R84_RH3zY1uLXYz1_hOsMVt3xVxkN5Hf8sPzWTbwVgIKlxlFuwABlXhZzjRdABlsZbUbC2NJFkjrEVZFXhM2I' },
    { name: 'Mike Ross', specialty: 'Plumber', rating: 5.0, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBaJEh8Rhzxn2ZCIl2YhkZ9_m0rmT2pn5uMBScqdjuF6S0V8xEj7kxZlTL-dqQguEnH2X_FRgsnF3bjYYad1Yef2i3X_S2sj4Ge9Vb3M2AJb2QwC0RMP3874wMsBlv-7zyNWLcoh1a6FAlvTqdZ3JgeF-mYWHQrtU9eLFcCxMs6EVMQhFknW7JwkWr_Bj8R_nLgQ_04Ct7LMmKuu4tjmFmUU2-nfDxkHEVd4gM7Mh1o0K4fTvTFPrwbjpd7E8xZTZu2wPeDffovWFc' },
];

const notifications = [
    { title: 'Order #2490 Completed', body: 'Please rate your technician Ahmed.', time: '2 mins ago', type: 'success' },
    { title: 'New Message', body: '"I\'m arriving in 5 mins..."', time: '15 mins ago', type: 'message' },
    { title: 'Promo Alert', body: 'Get 20% off on your next cleaning.', time: '1 hour ago', type: 'promo' },
];

export default function ClientDashboard() {
    return (
        <div className="space-y-6 max-w-5xl">
            {/* Page header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
                    <p className="text-slate-500 dark:text-gray-400 text-sm mt-1">Welcome back, Alex 👋</p>
                </div>
                <Link
                    href="/client/create-job"
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/20"
                >
                    <Plus className="w-4 h-4" />
                    New Job
                </Link>
            </div>

            {/* Stats cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Balance card */}
                <div className="relative overflow-hidden p-6 rounded-2xl bg-gradient-to-br from-primary to-emerald-600 text-white shadow-lg shadow-primary/20 col-span-1">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-x-10 -translate-y-10" />
                    <div className="flex items-start justify-between mb-4">
                        <p className="text-white/70 text-sm font-medium">Total Balance</p>
                        <Wallet className="w-5 h-5 text-white/60" />
                    </div>
                    <p className="text-3xl font-bold mb-1">$1,240.50</p>
                    <div className="flex items-center gap-1 text-white/80 text-xs">
                        <TrendingUp className="w-3 h-3" />
                        <span>+12% this month</span>
                    </div>
                </div>

                {/* Active Orders */}
                <div className="p-6 rounded-2xl border border-slate-200 dark:border-surface-border bg-white dark:bg-surface-dark">
                    <div className="flex items-start justify-between mb-4">
                        <p className="text-slate-500 dark:text-gray-400 text-sm font-medium">Active Orders</p>
                        <Clock className="w-5 h-5 text-amber-500" />
                    </div>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white mb-1">3</p>
                    <p className="text-xs text-slate-400 dark:text-gray-500">Currently in progress</p>
                </div>

                {/* Completed */}
                <div className="p-6 rounded-2xl border border-slate-200 dark:border-surface-border bg-white dark:bg-surface-dark">
                    <div className="flex items-start justify-between mb-4">
                        <p className="text-slate-500 dark:text-gray-400 text-sm font-medium">Completed Jobs</p>
                        <CheckCircle2 className="w-5 h-5 text-primary" />
                    </div>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white mb-1">12</p>
                    <p className="text-xs text-slate-400 dark:text-gray-500">Lifetime total</p>
                </div>
            </div>

            {/* Main content grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Active orders list */}
                <div className="lg:col-span-2 rounded-2xl border border-slate-200 dark:border-surface-border bg-white dark:bg-surface-dark p-6">
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="font-bold text-slate-900 dark:text-white">Current Active Orders</h2>
                        <Link href="/client/jobs" className="text-primary text-sm font-semibold hover:underline flex items-center gap-1">
                            View All <ArrowRight className="w-3 h-3" />
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {activeOrders.map((order) => (
                            <div key={order.id} className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-background-dark hover:bg-slate-100 dark:hover:bg-surface-dark/60 transition-colors cursor-pointer">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 ${order.color.split(' ')[1]}`}>
                                    {order.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-slate-900 dark:text-white text-sm truncate">{order.title}</p>
                                    <p className="text-xs text-slate-400 dark:text-gray-500 mt-0.5 flex items-center gap-1">
                                        <MapPin className="w-3 h-3 shrink-0" />
                                        {order.statusLabel}
                                    </p>
                                </div>
                                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${order.color}`}>
                                    {order.status === 'arriving' ? 'Arriving' : order.status === 'scheduled' ? 'Scheduled' : 'Active'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right column */}
                <div className="space-y-6">
                    {/* Saved Technicians */}
                    <div className="rounded-2xl border border-slate-200 dark:border-surface-border bg-white dark:bg-surface-dark p-6">
                        <h2 className="font-bold text-slate-900 dark:text-white mb-4">Saved Craftsmen</h2>
                        <div className="space-y-3">
                            {savedTechnicians.map((tech) => (
                                <div key={tech.name} className="flex items-center gap-3">
                                    <div
                                        className="w-9 h-9 rounded-full bg-cover bg-center shrink-0 border-2 border-primary/20"
                                        style={{ backgroundImage: `url("${tech.image}")` }}
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-sm text-slate-900 dark:text-white truncate">{tech.name}</p>
                                        <p className="text-xs text-slate-400 dark:text-gray-500">{tech.specialty}</p>
                                    </div>
                                    <div className="flex items-center gap-0.5">
                                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                        <span className="text-xs font-bold text-slate-700 dark:text-gray-300">{tech.rating}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Notifications */}
                    <div className="rounded-2xl border border-slate-200 dark:border-surface-border bg-white dark:bg-surface-dark p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Bell className="w-4 h-4 text-slate-500" />
                            <h2 className="font-bold text-slate-900 dark:text-white">Notifications</h2>
                        </div>
                        <div className="space-y-4">
                            {notifications.map((n, i) => (
                                <div key={i} className="flex items-start gap-3">
                                    <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${n.type === 'success' ? 'bg-primary' : n.type === 'message' ? 'bg-blue-500' : 'bg-amber-400'}`} />
                                    <div>
                                        <p className="text-sm font-semibold text-slate-800 dark:text-gray-200">{n.title}</p>
                                        <p className="text-xs text-slate-400 dark:text-gray-500 mt-0.5">{n.body}</p>
                                        <p className="text-xs text-slate-300 dark:text-gray-600 mt-1">{n.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Referral banner */}
            <div className="relative overflow-hidden rounded-2xl bg-background-dark dark:bg-surface-dark border border-surface-border p-6 flex items-center justify-between gap-4">
                <div className="absolute right-0 top-0 w-64 h-full opacity-5">
                    <div className="w-full h-full bg-primary rounded-full blur-3xl" />
                </div>
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <Gift className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <p className="font-bold text-white">Refer a friend & get $50</p>
                        <p className="text-gray-400 text-sm">Share your unique code and earn rewards for every signup.</p>
                    </div>
                </div>
                <button className="shrink-0 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors">
                    Share Code
                </button>
            </div>
        </div>
    );
}
