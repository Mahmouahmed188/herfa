'use client';

import React from 'react';
import { 
    MapPin, Briefcase, 
    Loader2, MessageCircle, Phone,
    Calendar, Radio
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { bookingApi } from '@/features/bookings/services/api';
import { AcceptJobButton } from '@/features/bookings/components/AcceptJobButton';
import { RejectJobButton } from '@/features/bookings/components/RejectJobButton';
import { StatusUpdateSelect } from '@/features/bookings/components/StatusUpdateSelect';
import { CompleteJobButton } from '@/features/bookings/components/CompleteJobButton';

export default function TechnicianJobsPage() {
    const { data: jobsRes, isLoading } = useQuery({
        queryKey: ['technicianJobs'],
        queryFn: async () => {
            const response = await bookingApi.getAssignedJobs();
            return (response?.data ?? []) as any[];
        },
    });

    const jobs = jobsRes || [];

    return (
        <div className="space-y-8">
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
                    {jobs.map((job: any) => {
                        const assignmentId = job.assignmentId || job.assignment?.id;
                        const isPending = job.status === 'PENDING' || job.assignment?.status === 'PENDING';
                        const isActive = ['ACCEPTED', 'ON_THE_WAY', 'IN_PROGRESS'].includes(job.status);
                        const isCompleted = job.status === 'COMPLETED';
                        const isCancelled = job.status === 'CANCELLED';

                        return (
                            <div key={job.id} className="bg-surface-dark border border-surface-border rounded-[32px] overflow-hidden group">
                                <div className="p-8 flex flex-col lg:flex-row gap-8">
                                    <div className="flex-1 space-y-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shrink-0 shadow-lg shadow-primary/5">
                                                <Briefcase className="w-7 h-7" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-3 mb-1">
                                                    <h3 className="text-xl font-bold text-white">{job.service?.name || job.title}</h3>
                                                    <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                                                        isCompleted ? 'bg-emerald-500/10 text-emerald-500' :
                                                        isCancelled ? 'bg-red-500/10 text-red-500' :
                                                        isPending ? 'bg-amber-500/10 text-amber-500' :
                                                        'bg-blue-500/10 text-blue-500 animate-pulse'
                                                    }`}>
                                                        {job.status}
                                                    </span>
                                                    {(job.status === 'ON_THE_WAY' || job.status === 'IN_PROGRESS') && (
                                                        <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-green-500/10 text-green-500 flex items-center gap-1">
                                                            <Radio className="w-3 h-3" /> Live
                                                        </span>
                                                    )}
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

                                    <div className="lg:w-72 flex flex-col gap-3 justify-center border-t lg:border-t-0 lg:border-l border-surface-border pt-8 lg:pt-0 lg:pl-8">
                                        {isPending && assignmentId && (
                                            <div className="flex gap-2">
                                                <AcceptJobButton assignmentId={assignmentId} />
                                                <RejectJobButton assignmentId={assignmentId} />
                                            </div>
                                        )}

                                        {isActive && !isCompleted && !isCancelled && (
                                            <>
                                                {job.status === 'IN_PROGRESS' ? (
                                                    <CompleteJobButton jobId={job.id} />
                                                ) : (
                                                    <StatusUpdateSelect jobId={job.id} currentStatus={job.status} />
                                                )}
                                            </>
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
                        );
                    })}
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