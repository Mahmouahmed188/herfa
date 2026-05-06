'use client';

import React from 'react';
import { 
    Clock, MapPin, Briefcase, 
    CheckCircle, AlertCircle, Loader2,
    ArrowRight, MessageCircle, Phone,
    Calendar
} from 'lucide-react';
import { Link } from "@/lib/navigation";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '@/services/api';

export default function TechnicianJobsPage() {
    const queryClient = useQueryClient();

    const { data: jobs = [], isLoading } = useQuery({
        queryKey: ['technicianJobs'],
        queryFn: () => api.getAssignedJobs(),
    });

    const updateStatusMutation = useMutation({
        mutationFn: ({ jobId, status }: { jobId: string, status: string }) => 
            api.updateJobStatus(jobId, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['technicianJobs'] });
        }
    });

    const handleStatusChange = (jobId: string, currentStatus: string) => {
        let nextStatus = '';
        if (currentStatus === 'ACCEPTED') nextStatus = 'IN_PROGRESS';
        else if (currentStatus === 'IN_PROGRESS') nextStatus = 'COMPLETED';
        
        if (nextStatus) {
            updateStatusMutation.mutate({ jobId, status: nextStatus });
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-white">Active Jobs</h1>
                <p className="text-gray-400 mt-1">Manage your ongoing projects and update their progress.</p>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-24 gap-4">
                    <Loader2 className="w-10 h-10 text-primary animate-spin" />
                    <p className="text-gray-500">Loading your schedule...</p>
                </div>
            ) : jobs.length > 0 ? (
                <div className="space-y-6">
                    {jobs.map((job: any) => (
                        <div key={job.id} className="bg-surface-dark border border-surface-border rounded-[32px] overflow-hidden group">
                            <div className="p-8 flex flex-col lg:flex-row gap-8">
                                {/* Left: Job Info */}
                                <div className="flex-1 space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shrink-0 shadow-lg shadow-primary/5">
                                            <Briefcase className="w-7 h-7" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <h3 className="text-xl font-bold text-white">{job.service?.name || job.title}</h3>
                                                <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                                                    job.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-500' :
                                                    job.status === 'CANCELLED' ? 'bg-red-500/10 text-red-500' :
                                                    'bg-blue-500/10 text-blue-500 animate-pulse'
                                                }`}>
                                                    {job.status}
                                                </span>
                                            </div>
                                            <p className="text-gray-400 text-sm flex items-center gap-2">
                                                <MapPin className="w-4 h-4 text-primary" /> {job.address}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-4">
                                        <div className="space-y-1">
                                            <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Scheduled</p>
                                            <div className="flex items-center gap-2 text-sm text-white font-medium">
                                                <Calendar className="w-4 h-4 text-primary" />
                                                {job.scheduledDate ? new Date(job.scheduledDate).toLocaleDateString() : 'ASAP'}
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Client</p>
                                            <div className="flex items-center gap-2 text-sm text-white font-medium">
                                                <div className="w-5 h-5 rounded-full bg-white/5 overflow-hidden">
                                                    <img src={`https://i.pravatar.cc/100?u=${job.customerId}`} alt="Client" />
                                                </div>
                                                {job.customer?.user?.firstName || 'Client'}
                                            </div>
                                        </div>
                                        <div className="space-y-1 col-span-2 sm:col-span-1">
                                            <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Price</p>
                                            <p className="text-lg font-black text-white">${job.quotedPrice || 'TBD'}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Right: Actions */}
                                <div className="lg:w-72 flex flex-col gap-3 justify-center border-t lg:border-t-0 lg:border-l border-surface-border pt-8 lg:pt-0 lg:pl-8">
                                    {job.status !== 'COMPLETED' && job.status !== 'CANCELLED' && (
                                        <button 
                                            onClick={() => handleStatusChange(job.id, job.status)}
                                            disabled={updateStatusMutation.isPending}
                                            className="w-full py-4 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black text-sm transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                                        >
                                            {updateStatusMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                                                job.status === 'ACCEPTED' ? 'Start Working' : 'Mark as Completed'
                                            )}
                                        </button>
                                    )}
                                    
                                    <div className="grid grid-cols-2 gap-3">
                                        <button className="flex-1 py-3 rounded-xl bg-white/5 border border-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center gap-2 text-xs font-bold">
                                            <MessageCircle className="w-4 h-4" /> Chat
                                        </button>
                                        <button className="flex-1 py-3 rounded-xl bg-white/5 border border-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center gap-2 text-xs font-bold">
                                            <Phone className="w-4 h-4" /> Call
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-surface-dark border border-surface-border border-dashed rounded-[40px] py-32 text-center">
                    <Calendar className="w-16 h-16 text-gray-700 mx-auto mb-6" />
                    <h3 className="text-2xl font-bold text-white mb-2">Your Schedule is Free</h3>
                    <p className="text-gray-500 max-w-sm mx-auto">You don't have any active jobs at the moment. Accepted bids will appear here as ongoing projects.</p>
                </div>
            )}
        </div>
    );
}
