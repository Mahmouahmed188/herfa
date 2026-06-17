'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { ChevronLeft, Clock, DollarSign, User, ShieldCheck, CheckCircle, XCircle, Loader2, AlertCircle, MessageSquare, Award, Star } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useRouter } from '@/lib/navigation';
import * as api from '@/services/api';
import Button from '@/components/ui/button';
import { useAuthStore } from '@/store/useAuthStore';

interface Tender {
    id: string;
    title: string;
    description: string;
    status: string;
    budget: number;
    address: string;
    deadline: string;
    createdAt: string;
    userId: string;
    service?: {
        name: string;
    };
    offers: Offer[];
}

interface Offer {
    id: string;
    amount: number;
    notes: string;
    status: string;
    createdAt: string;
    providerId: string;
    provider?: {
        firstName: string;
        lastName: string;
        profileImage: string;
    };
}

export default function TenderDetailPage() {
    const { id } = useParams<{ id: string }>();
    const { user, isAuthenticated } = useAuthStore();
    const queryClient = useQueryClient();
    const [offerForm, setOfferForm] = useState({ price: '', message: '', estimatedDays: '' });
    const [showOfferForm, setShowOfferForm] = useState(false);

    const { data: tender, isLoading } = useQuery({
        queryKey: ['tender', id],
        queryFn: () => api.getTenderById(id!),
        enabled: !!id,
        staleTime: 1000 * 60 * 10,
    });

    const acceptOfferMutation = useMutation({
        mutationFn: (offerId: string) => api.acceptOffer(offerId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tender', id] });
        },
    });

    const submitOfferMutation = useMutation({
        mutationFn: (data: { tenderId: string; payload: api.CreateOfferPayload }) =>
            api.submitOffer(data.tenderId, data.payload),
        onSuccess: () => {
            setShowOfferForm(false);
            setOfferForm({ price: '', message: '', estimatedDays: '' });
            queryClient.invalidateQueries({ queryKey: ['tender', id] });
        },
    });

    const handleAcceptOffer = (offerId: string) => {
        acceptOfferMutation.mutate(offerId);
    };

    const handleSubmitOffer = (e: React.FormEvent) => {
        e.preventDefault();
        submitOfferMutation.mutate({
            tenderId: id as string,
            payload: {
                amount: parseFloat(offerForm.price),
                notes: offerForm.message,
            },
        });
    };

    if (isLoading) {
        return (
            <div className="bg-[#0A0F0D] min-h-screen text-white pt-32 pb-24 px-6 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!tender) return null;

    const tenderData = tender as any;

    const isOwner = user?.id === tenderData.userId;
    const isProvider = user?.role === 'technician';
    const offers = Array.isArray(tenderData.offers) ? tenderData.offers as Offer[] : [];
    const hasAlreadyOffered = offers.some((o) => o.providerId === user?.id);

    return (
        <div className="bg-[#0A0F0D] min-h-screen text-white pt-32 pb-24 px-6">
            <div className="container mx-auto max-w-5xl">
                <Link href="/client/dashboard" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-10 transition-colors">
                    <ChevronLeft className="w-5 h-5" />
                    Back to Dashboard
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Left: Tender Info */}
                    <div className="lg:col-span-2 space-y-12">
                        <div>
                            <div className="flex flex-wrap items-center gap-4 mb-6">
                                <span className="text-[10px] font-bold px-3 py-1.5 rounded-full bg-primary/20 border border-primary/30 text-primary uppercase tracking-widest">
                                    {tenderData.service?.name || 'Service Request'}
                                </span>
                                <span className={`text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest border ${
                                    tenderData.status === 'open' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-white/10 border-white/10 text-gray-400'
                                }`}>
                                    Status: {tenderData.status}
                                </span>
                            </div>
                            <h1 className="text-4xl font-black mb-6 leading-tight">{tenderData.title}</h1>
                            <div className="flex flex-wrap gap-8 text-sm text-gray-400">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-primary" />
                                    Posted: {new Date(tenderData.createdAt).toLocaleDateString()}
                                </div>
                                <div className="flex items-center gap-2">
                                    <DollarSign className="w-4 h-4 text-primary" />
                                    Budget: ${tenderData.budget || 'N/A'}
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#1A2C22] border border-white/5 rounded-[40px] p-10">
                            <h2 className="text-xl font-bold mb-6">Project Description</h2>
                            <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                                {tenderData.description}
                            </p>
                        </div>

                        {/* Offers List (Visible to Owner) */}
                        {isOwner && (
                            <div className="space-y-8">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-2xl font-black">Offers Received ({offers.length})</h2>
                                </div>

                                {offers.length > 0 ? (
                                    <div className="space-y-6">
                                        {offers.map((offer) => (
                                            <div key={offer.id} className={`bg-[#1A2C22] border rounded-[40px] p-8 transition-all ${offer.status === 'accepted' ? 'border-primary shadow-lg shadow-primary/10' : 'border-white/5'}`}>
                                                <div className="flex flex-col md:flex-row gap-8 items-start">
                                                    <div className="w-16 h-16 rounded-2xl bg-white/5 overflow-hidden shrink-0">
                                                        <img src={offer.provider?.profileImage || `https://i.pravatar.cc/100?u=${offer.providerId}`} alt="Provider" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <h3 className="font-bold text-lg">{offer.provider?.firstName} {offer.provider?.lastName}</h3>
                                                            <span className="text-2xl font-black text-primary">${offer.amount}</span>
                                                        </div>
                                                        <p className="text-gray-400 text-sm mb-6 leading-relaxed italic">"{offer.notes}"</p>
                                                        <div className="flex items-center gap-6 text-xs text-gray-500 mb-8">
                                                            <div className="flex items-center gap-2">
                                                                <Clock className="w-3 h-3" />
                                                                Delivery: Standard
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <Star className="w-3 h-3 fill-primary text-primary" />
                                                                4.9 Expert
                                                            </div>
                                                        </div>

                                                        {tender.status === 'open' && (
                                    <Button 
                                        onClick={() => handleAcceptOffer(offer.id)}
                                        disabled={acceptOfferMutation.isPending}
                                        className="rounded-2xl px-8 py-3 h-auto font-bold text-sm"
                                    >
                                        {acceptOfferMutation.isPending && acceptOfferMutation.variables === offer.id ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Accept Offer'}
                                    </Button>
                                                        )}

                                                        {offer.status === 'accepted' && (
                                                            <div className="flex items-center gap-2 text-primary font-bold">
                                                                <Award className="w-5 h-5" />
                                                                Winning Offer
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="bg-[#1A2C22] border border-white/5 border-dashed rounded-[40px] py-20 text-center">
                                        <MessageSquare className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                                        <p className="text-gray-500 font-medium">Waiting for offers from professionals...</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-8">
                        {/* Provider Action */}
                        {isProvider && !isOwner && tenderData.status === 'open' && (
                            <div className="bg-primary/10 border border-primary/20 rounded-[40px] p-10">
                                {hasAlreadyOffered ? (
                                    <div className="text-center">
                                        <CheckCircle className="w-12 h-12 text-primary mx-auto mb-4" />
                                        <h3 className="font-bold text-lg mb-2">Offer Submitted</h3>
                                        <p className="text-sm text-gray-400">You have already placed a bid on this tender.</p>
                                    </div>
                                ) : !showOfferForm ? (
                                    <div className="text-center">
                                        <h3 className="font-black text-xl mb-4">Win this project!</h3>
                                        <p className="text-sm text-gray-400 mb-8">Submit your best price and timeline to catch the customer's eye.</p>
                                        <Button onClick={() => setShowOfferForm(true)} className="w-full rounded-2xl py-4 h-auto font-black">
                                            Place a Bid
                                        </Button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmitOffer} className="space-y-6">
                                        <h3 className="font-bold text-lg mb-2">Submit Your Offer</h3>
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Price ($)</label>
                                            <input
                                                type="number"
                                                required
                                                className="w-full bg-[#0E1512] border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-primary text-white"
                                                value={offerForm.price}
                                                onChange={(e) => setOfferForm({ ...offerForm, price: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Days to Complete</label>
                                            <input
                                                type="number"
                                                required
                                                className="w-full bg-[#0E1512] border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-primary text-white"
                                                value={offerForm.estimatedDays}
                                                onChange={(e) => setOfferForm({ ...offerForm, estimatedDays: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Message</label>
                                            <textarea
                                                required
                                                className="w-full bg-[#0E1512] border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-primary text-white resize-none"
                                                rows={4}
                                                value={offerForm.message}
                                                onChange={(e) => setOfferForm({ ...offerForm, message: e.target.value })}
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <Button type="button" variant="outline" onClick={() => setShowOfferForm(false)} className="rounded-xl py-3 border-white/10">Cancel</Button>
                                            <Button type="submit" disabled={submitOfferMutation.isPending} className="rounded-xl py-3">
                                                {submitOfferMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Submit'}
                                            </Button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        )}

                        <div className="bg-[#1A2C22] border border-white/5 rounded-[40px] p-8 space-y-6">
                            <h3 className="font-bold text-lg mb-4">Tender Details</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Service</span>
                                    <span className="font-medium">{tenderData.service?.name}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Deadline</span>
                                    <span className="font-medium">{tenderData.deadline ? new Date(tenderData.deadline).toLocaleDateString() : 'N/A'}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Location</span>
                                    <span className="font-medium text-right max-w-[150px]">{tenderData.address}</span>
                                </div>
                            </div>
                        </div>

                        {/* Summary for accepted offer */}
                        {tenderData.status === 'completed' && (
                            <div className="bg-primary/20 border border-primary/40 rounded-[40px] p-8 text-center">
                                <CheckCircle className="w-10 h-10 text-primary mx-auto mb-4" />
                                <h3 className="font-black text-lg mb-2">Project Assigned!</h3>
                                <p className="text-sm text-gray-400">The customer has accepted an offer. This project is now in progress.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
