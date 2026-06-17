'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ChevronLeft, Calendar, DollarSign, MapPin, Image as ImageIcon, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useMutation } from '@tanstack/react-query';
import { Link, useRouter } from '@/lib/navigation';
import * as api from '@/services/api';
import Button from '@/components/ui/button';
import { useAuthStore } from '@/store/useAuthStore';

export default function CreateTenderPage() {
    const searchParams = useSearchParams();
    const serviceId = searchParams.get('serviceId');
    const router = useRouter();
    const { isAuthenticated } = useAuthStore();
    const [isSuccess, setIsSuccess] = useState(false);
    const [tenderId, setTenderId] = useState('');

    const [form, setForm] = useState({
        title: '',
        description: '',
        budget: '',
        deadline: '',
    });

    const createTenderMutation = useMutation({
        mutationFn: (data: api.CreateTenderPayload) => api.createTender(data),
        onSuccess: (result) => {
            setTenderId(result.id);
            setIsSuccess(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createTenderMutation.mutate({
            title: form.title,
            description: form.description,
            budget: form.budget ? parseFloat(form.budget) : 0,
            deadline: form.deadline ? new Date(form.deadline).toISOString() : undefined,
        });
    };

    if (isSuccess) {
        return (
            <div className="bg-[#0A0F0D] min-h-screen text-white pt-32 pb-24 px-6 text-center">
                <div className="container mx-auto max-w-2xl">
                    <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-8 border-2 border-primary/40">
                        <CheckCircle className="w-12 h-12 text-primary" />
                    </div>
                    <h1 className="text-4xl font-black mb-4">Tender Published!</h1>
                    <p className="text-gray-400 text-lg mb-12">
                        Your service request is now live. Providers will be notified and you'll receive offers shortly.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href={`/tenders/${tenderId}` as any}>
                            <Button className="w-full sm:w-auto rounded-2xl px-10 py-4 h-auto font-extrabold shadow-lg shadow-primary/20">
                                View My Tender
                            </Button>
                        </Link>
                        <Link href={"/client/dashboard" as any}>
                            <Button variant="outline" className="w-full sm:w-auto rounded-2xl px-10 py-4 h-auto font-extrabold border-white/10 text-gray-300">
                                Back to Dashboard
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#0A0F0D] min-h-screen text-white pt-32 pb-24 px-6">
            <div className="container mx-auto max-w-3xl">
                <Link href="/services" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-10 transition-colors">
                    <ChevronLeft className="w-5 h-5" />
                    Back to Services
                </Link>

                <div className="mb-12">
                    <h1 className="text-4xl font-black mb-4">Create Service Request</h1>
                    <p className="text-gray-400">Describe what you need and set a budget window. Professionals will bid to win your job.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Basic Info */}
                    <div className="bg-[#1A2C22] border border-white/5 rounded-[40px] p-10 space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-400 mb-3 uppercase tracking-widest">Tender Title</label>
                            <input
                                type="text"
                                required
                                placeholder="e.g., Fix leaking pipe in kitchen"
                                className="w-full bg-[#0E1512] border border-white/10 rounded-2xl py-4 px-6 outline-none focus:border-primary/50 transition-all text-white placeholder-gray-600"
                                value={form.title}
                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-400 mb-3 uppercase tracking-widest">Detailed Description</label>
                            <textarea
                                required
                                rows={6}
                                placeholder="Describe the work in detail. The more info you provide, the better offers you'll get."
                                className="w-full bg-[#0E1512] border border-white/10 rounded-3xl py-4 px-6 outline-none focus:border-primary/50 transition-all text-white placeholder-gray-600 resize-none"
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Budget & Deadline */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-[#1A2C22] border border-white/5 rounded-[40px] p-10">
                            <label className="block text-sm font-bold text-gray-400 mb-6 uppercase tracking-widest flex items-center gap-2">
                                <DollarSign className="w-4 h-4 text-primary" />
                                Budget
                            </label>
                            <div>
                                <input
                                    type="number"
                                    placeholder="Budget amount"
                                    className="w-full bg-[#0E1512] border border-white/10 rounded-2xl py-4 px-6 outline-none focus:border-primary/50 text-white"
                                    value={form.budget}
                                    onChange={(e) => setForm({ ...form, budget: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="bg-[#1A2C22] border border-white/5 rounded-[40px] p-10">
                            <label className="block text-sm font-bold text-gray-400 mb-6 uppercase tracking-widest flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-primary" />
                                Deadline for Offers
                            </label>
                            <input
                                type="date"
                                className="w-full bg-[#0E1512] border border-white/10 rounded-2xl py-4 px-6 outline-none focus:border-primary/50 text-white"
                                value={form.deadline}
                                onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Location */}
                    <div className="bg-[#1A2C22] border border-white/5 rounded-[40px] p-10">
                        <label className="block text-sm font-bold text-gray-400 mb-6 uppercase tracking-widest flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-primary" />
                            Work Location
                        </label>
                            <input
                                type="text"
                                placeholder="Street name, Building, Area"
                                className="w-full bg-[#0E1512] border border-white/10 rounded-2xl py-4 px-6 outline-none focus:border-primary/50 text-white"
                                value={''}
                                readOnly
                            />
                    </div>

                    {createTenderMutation.isError && (
                        <div className="flex items-center gap-3 p-6 rounded-3xl bg-red-500/10 border border-red-500/20 text-red-400">
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            <p className="text-sm font-bold">{createTenderMutation.error?.message || 'Failed to create tender.'}</p>
                        </div>
                    )}

                    <Button 
                        type="submit"
                        disabled={createTenderMutation.isPending}
                        className="w-full rounded-[32px] py-6 h-auto text-lg font-black shadow-2xl shadow-primary/30"
                    >
                        {createTenderMutation.isPending ? (
                            <>
                                <Loader2 className="w-6 h-6 animate-spin mr-3" />
                                Publishing Tender...
                            </>
                        ) : (
                            'Publish Service Request'
                        )}
                    </Button>
                </form>
            </div>
        </div>
    );
}
