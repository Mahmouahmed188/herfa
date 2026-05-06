'use client';

import React, { useState } from 'react';
import { 
    Search, Filter, Clock, MapPin, 
    Briefcase, ArrowRight, Star,
    AlertCircle, Loader2
} from 'lucide-react';
import { Link } from "@/lib/navigation";
import { useQuery } from '@tanstack/react-query';
import * as api from '@/services/api';

export default function TechnicianRequestsPage() {
    const [searchTerm, setSearchTerm] = useState('');

    const { data: requests = [], isLoading } = useQuery({
        queryKey: ['openRequests'],
        queryFn: () => api.getOpenTenders(),
    });

    const filteredRequests = requests.filter((req: any) => 
        req.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.service?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Available Requests</h1>
                    <p className="text-gray-400 mt-1">Browse and bid on new job opportunities matching your skills.</p>
                </div>
                
                <div className="relative max-w-sm w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input 
                        type="text" 
                        placeholder="Search requests..."
                        className="w-full bg-surface-dark border border-surface-border rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all text-white"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-24 gap-4">
                    <Loader2 className="w-10 h-10 text-primary animate-spin" />
                    <p className="text-gray-500">Finding new opportunities...</p>
                </div>
            ) : filteredRequests.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredRequests.map((req: any) => (
                        <div key={req.id} className="bg-surface-dark border border-surface-border rounded-[32px] p-8 hover:border-primary/50 transition-all flex flex-col h-full group">
                            <div className="flex items-start justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                        <Briefcase className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-black text-primary uppercase tracking-widest bg-primary/10 px-2 py-0.5 rounded">
                                            {req.service?.name || 'General'}
                                        </span>
                                        <h3 className="text-xl font-bold text-white mt-1 group-hover:text-primary transition-colors truncate max-w-[200px]">
                                            {req.title}
                                        </h3>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-2xl font-black text-white">${req.budgetMin}</span>
                                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">Est. Budget</p>
                                </div>
                            </div>

                            <p className="text-gray-400 text-sm mb-8 line-clamp-3 leading-relaxed flex-1 italic">
                                "{req.description}"
                            </p>

                            <div className="space-y-4 pt-6 border-t border-surface-border">
                                <div className="flex flex-wrap gap-6 text-xs text-gray-500">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-3.5 h-3.5 text-primary" />
                                        {req.address || 'Location pending'}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-3.5 h-3.5 text-primary" />
                                        Deadline: {req.deadline ? new Date(req.deadline).toLocaleDateString() : 'Flexible'}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-surface-light border border-surface-border overflow-hidden">
                                            <img src={`https://i.pravatar.cc/100?u=${req.userId}`} alt="Client" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-xs text-white font-bold truncate">{req.user?.firstName || 'Client'}</p>
                                            <div className="flex items-center gap-1">
                                                <Star className="w-2.5 h-2.5 text-yellow-500 fill-current" />
                                                <span className="text-[10px] text-gray-500 font-bold">4.8 Verified</span>
                                            </div>
                                        </div>
                                    </div>
                                    <Link href={`/tenders/${req.id}` as any}>
                                        <button className="bg-primary hover:bg-primary/90 text-white font-bold text-xs px-6 py-3 rounded-2xl transition-all shadow-lg shadow-primary/20">
                                            Place a Bid
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-surface-dark border border-surface-border border-dashed rounded-[40px] py-32 text-center">
                    <AlertCircle className="w-16 h-16 text-gray-700 mx-auto mb-6" />
                    <h3 className="text-2xl font-bold text-white mb-2">No Requests Found</h3>
                    <p className="text-gray-500 max-w-sm mx-auto">We couldn't find any requests matching your current filters or search term.</p>
                </div>
            )}
        </div>
    );
}
