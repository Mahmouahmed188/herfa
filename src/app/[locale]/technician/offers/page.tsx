'use client';

import React from 'react';
import { 
    Clock, DollarSign, Briefcase, 
    CheckCircle, XCircle, AlertCircle, 
    Loader2, ArrowUpRight, MessageSquare
} from 'lucide-react';
import { Link } from "@/lib/navigation";
import { useQuery } from '@tanstack/react-query';
import * as api from '@/services/api';

export default function TechnicianOffersPage() {
    const { data: offers = [], isLoading } = useQuery({
        queryKey: ['myOffersTechnician'],
        queryFn: () => api.getMyOffersTechnician(),
    });

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-white">My Submitted Offers</h1>
                <p className="text-gray-400 mt-1">Track the status of your bids and manage your negotiations.</p>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-24 gap-4">
                    <Loader2 className="w-10 h-10 text-primary animate-spin" />
                    <p className="text-gray-500">Loading your bids...</p>
                </div>
            ) : offers.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                    {offers.map((offer: any) => (
                        <div key={offer.id} className="bg-surface-dark border border-surface-border rounded-[24px] p-6 hover:bg-surface-light/50 transition-all group">
                            <div className="flex flex-col md:flex-row gap-6 items-center">
                                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-primary shrink-0 border border-white/5">
                                    <Briefcase className="w-8 h-8" />
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className="text-lg font-bold text-white truncate">{offer.tender?.title || 'Project Bid'}</h3>
                                        <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${
                                            offer.status === 'accepted' ? 'bg-emerald-500/10 text-emerald-500' :
                                            offer.status === 'rejected' ? 'bg-red-500/10 text-red-500' :
                                            'bg-amber-500/10 text-amber-500'
                                        }`}>
                                            {offer.status}
                                        </span>
                                    </div>
                                    <p className="text-gray-400 text-sm line-clamp-1 italic mb-3">"{offer.message}"</p>
                                    <div className="flex flex-wrap gap-6 text-xs text-gray-500">
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-3.5 h-3.5" />
                                            {offer.estimatedDays} days delivery
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <DollarSign className="w-3.5 h-3.5" />
                                            Bid Price: <span className="text-white font-bold">${offer.price}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <AlertCircle className="w-3.5 h-3.5" />
                                            Submitted: {new Date(offer.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 shrink-0">
                                    <Link href={`/tenders/${offer.tenderId}` as any}>
                                        <button className="p-3 rounded-xl bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all border border-white/5">
                                            <ArrowUpRight className="w-5 h-5" />
                                        </button>
                                    </Link>
                                    <button className="p-3 rounded-xl bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all border border-white/5">
                                        <MessageSquare className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-surface-dark border border-surface-border border-dashed rounded-[40px] py-32 text-center">
                    <AlertCircle className="w-16 h-16 text-gray-700 mx-auto mb-6" />
                    <h3 className="text-2xl font-bold text-white mb-2">No Offers Yet</h3>
                    <p className="text-gray-500 max-w-sm mx-auto">You haven't submitted any bids yet. Head over to the Requests page to find your first job!</p>
                    <Link href="/technician/requests">
                        <button className="mt-8 bg-primary hover:bg-primary/90 text-white font-bold px-8 py-3 rounded-2xl transition-all">
                            Browse Requests
                        </button>
                    </Link>
                </div>
            )}
        </div>
    );
}
