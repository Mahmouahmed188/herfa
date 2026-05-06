'use client';

import React, { useState, useRef } from 'react';
import { 
    ShieldCheck, Upload, FileText, 
    Camera, CheckCircle2, AlertCircle, 
    Clock, Image as ImageIcon, Briefcase,
    Loader2, ArrowRight, X
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '@/services/api';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface VerificationData {
    frontIdImage: string;
    backIdImage: string;
    personalPhoto: string;
    documents: string[];
    portfolio: string[];
}

export default function TechnicianOnboardingPage() {
    const { user, updateUser } = useAuthStore();
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState<VerificationData>({
        frontIdImage: '',
        backIdImage: '',
        personalPhoto: '',
        documents: [],
        portfolio: []
    });

    const [uploading, setUploading] = useState<Record<string, boolean>>({});

    const frontIdRef = useRef<HTMLInputElement>(null);
    const backIdRef = useRef<HTMLInputElement>(null);
    const personalPhotoRef = useRef<HTMLInputElement>(null);

    // Fetch verification status
    const { data: verification, isLoading } = useQuery({
        queryKey: ['verificationStatus'],
        queryFn: () => api.getVerificationStatus(),
    });

    const submitMutation = useMutation({
        mutationFn: (data: VerificationData) => api.submitVerification(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['verificationStatus'] });
            updateUser({ status: 'pending' });
            toast.success('Application submitted for review');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Submission failed');
        }
    });

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: keyof VerificationData) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(prev => ({ ...prev, [field]: true }));
        try {
            const result = await api.uploadFile(file);
            setFormData(prev => ({ ...prev, [field]: result.url }));
            toast.success('File uploaded successfully');
        } catch (err: any) {
            toast.error(err.message || 'Upload failed');
        } finally {
            setUploading(prev => ({ ...prev, [field]: false }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.frontIdImage || !formData.backIdImage) {
            toast.error('Please upload both sides of your National ID');
            return;
        }

        submitMutation.mutate(formData);
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
                <p className="mt-4 text-gray-500 font-medium">Loading your profile...</p>
            </div>
        );
    }

    const currentStatus = verification?.status || 'unverified';

    return (
        <div className="max-w-4xl mx-auto px-6 py-12">
            {/* Status Header */}
            <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
                    <ShieldCheck className="w-10 h-10 text-primary" />
                </div>
                <h1 className="text-3xl font-bold text-white mb-3">Technician Verification</h1>
                <p className="text-gray-400 max-w-lg mx-auto">
                    To maintain the quality and safety of our marketplace, all technicians must undergo a verification process.
                </p>
            </div>

            {/* Status Banner */}
            <div className={cn(
                "mb-12 p-6 rounded-[32px] border flex items-center gap-6",
                currentStatus === 'pending' ? "bg-amber-500/10 border-amber-500/20" :
                currentStatus === 'approved' ? "bg-emerald-500/10 border-emerald-500/20" :
                currentStatus === 'rejected' ? "bg-red-500/10 border-red-500/20" :
                "bg-surface-dark border-surface-border"
            )}>
                <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0",
                    currentStatus === 'pending' ? "bg-amber-500 text-white" :
                    currentStatus === 'approved' ? "bg-emerald-500 text-white" :
                    currentStatus === 'rejected' ? "bg-red-500 text-white" :
                    "bg-primary text-white"
                )}>
                    {currentStatus === 'pending' ? <Clock className="w-6 h-6" /> :
                     currentStatus === 'approved' ? <CheckCircle2 className="w-6 h-6" /> :
                     currentStatus === 'rejected' ? <AlertCircle className="w-6 h-6" /> :
                     <FileText className="w-6 h-6" />}
                </div>
                <div className="flex-1">
                    <h3 className="text-white font-bold text-lg capitalize">
                        Status: {currentStatus}
                    </h3>
                    <p className="text-gray-400 text-sm mt-0.5">
                        {currentStatus === 'pending' ? "Your application is under review. We will respond shortly." :
                         currentStatus === 'approved' ? "Your account is verified! You can now access all features." :
                         currentStatus === 'rejected' ? `Verification rejected. ${verification?.adminNote || "Please review your documents."}` :
                         "Please complete the form below to start the verification process."}
                    </p>
                </div>
            </div>

            {/* Verification Form */}
            {(currentStatus === 'unverified' || currentStatus === 'rejected') && (
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* National ID Section */}
                        <div className="bg-surface-dark border border-surface-border rounded-[32px] p-8 space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                    <ImageIcon className="w-5 h-5" />
                                </div>
                                <h2 className="text-white font-bold text-xl">National ID</h2>
                            </div>
                            <p className="text-gray-500 text-sm italic">Upload clear photos of both the front and back of your National ID.</p>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <input type="file" ref={frontIdRef} className="hidden" onChange={(e) => handleFileUpload(e, 'frontIdImage')} accept="image/*" />
                                <div 
                                    onClick={() => !uploading.frontIdImage && frontIdRef.current?.click()}
                                    className={cn(
                                        "aspect-[3/2] rounded-2xl border-2 border-dashed border-surface-border hover:border-primary/50 transition-all flex flex-col items-center justify-center cursor-pointer group bg-surface-light/30 relative overflow-hidden",
                                        formData.frontIdImage && "border-solid border-primary/30"
                                    )}
                                >
                                    {uploading.frontIdImage ? (
                                        <Loader2 className="w-6 h-6 text-primary animate-spin" />
                                    ) : formData.frontIdImage ? (
                                        <img src={formData.frontIdImage} alt="Front ID" className="w-full h-full object-cover" />
                                    ) : (
                                        <>
                                            <Upload className="w-6 h-6 text-gray-600 group-hover:text-primary mb-2" />
                                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Front Side</span>
                                        </>
                                    )}
                                </div>

                                <input type="file" ref={backIdRef} className="hidden" onChange={(e) => handleFileUpload(e, 'backIdImage')} accept="image/*" />
                                <div 
                                    onClick={() => !uploading.backIdImage && backIdRef.current?.click()}
                                    className={cn(
                                        "aspect-[3/2] rounded-2xl border-2 border-dashed border-surface-border hover:border-primary/50 transition-all flex flex-col items-center justify-center cursor-pointer group bg-surface-light/30 relative overflow-hidden",
                                        formData.backIdImage && "border-solid border-primary/30"
                                    )}
                                >
                                    {uploading.backIdImage ? (
                                        <Loader2 className="w-6 h-6 text-primary animate-spin" />
                                    ) : formData.backIdImage ? (
                                        <img src={formData.backIdImage} alt="Back ID" className="w-full h-full object-cover" />
                                    ) : (
                                        <>
                                            <Upload className="w-6 h-6 text-gray-600 group-hover:text-primary mb-2" />
                                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Back Side</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Personal Photo Section */}
                        <div className="bg-surface-dark border border-surface-border rounded-[32px] p-8 space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                    <Camera className="w-5 h-5" />
                                </div>
                                <h2 className="text-white font-bold text-xl">Personal Photo</h2>
                            </div>
                            <p className="text-gray-500 text-sm italic">A professional photo for your profile (headshot only).</p>
                            
                            <input type="file" ref={personalPhotoRef} className="hidden" onChange={(e) => handleFileUpload(e, 'personalPhoto')} accept="image/*" />
                            <div 
                                onClick={() => !uploading.personalPhoto && personalPhotoRef.current?.click()}
                                className={cn(
                                    "w-full h-40 rounded-2xl border-2 border-dashed border-surface-border hover:border-primary/50 transition-all flex flex-col items-center justify-center cursor-pointer group bg-surface-light/30 relative overflow-hidden",
                                    formData.personalPhoto && "border-solid border-primary/30"
                                )}
                            >
                                {uploading.personalPhoto ? (
                                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                                ) : formData.personalPhoto ? (
                                    <img src={formData.personalPhoto} alt="Personal" className="w-full h-full object-cover" />
                                ) : (
                                    <>
                                        <Upload className="w-8 h-8 text-gray-600 group-hover:text-primary mb-2" />
                                        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Upload Portrait</span>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Professional Skills / Docs */}
                        <div className="bg-surface-dark border border-surface-border rounded-[32px] p-8 space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                    <Briefcase className="w-5 h-5" />
                                </div>
                                <h2 className="text-white font-bold text-xl">Skills & Certificates</h2>
                            </div>
                            <p className="text-gray-500 text-sm italic">Upload any trade certificates or professional licenses.</p>
                            
                            <div className="w-full h-32 rounded-2xl bg-surface-light/30 border border-surface-border flex items-center justify-center gap-3 text-gray-400">
                                <FileText className="w-6 h-6" />
                                <span className="text-sm font-medium">Add document (.pdf, .jpg)</span>
                            </div>
                        </div>

                        {/* Portfolio */}
                        <div className="bg-surface-dark border border-surface-border rounded-[32px] p-8 space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                    <CheckCircle2 className="w-5 h-5" />
                                </div>
                                <h2 className="text-white font-bold text-xl">Work Portfolio</h2>
                            </div>
                            <p className="text-gray-500 text-sm italic">Optional: Show off your best work to get hired faster.</p>
                            
                            <div className="flex gap-2">
                                <div className="w-12 h-12 rounded-xl border border-surface-border flex items-center justify-center text-gray-600 hover:text-primary hover:border-primary transition-all cursor-pointer">
                                    <ImageIcon className="w-6 h-6" />
                                </div>
                                <div className="w-12 h-12 rounded-xl border border-surface-border flex items-center justify-center text-gray-600 hover:text-primary hover:border-primary transition-all cursor-pointer">
                                    <ImageIcon className="w-6 h-6" />
                                </div>
                                <div className="w-12 h-12 rounded-xl border-2 border-dashed border-surface-border flex items-center justify-center text-gray-600 hover:text-primary hover:border-primary transition-all cursor-pointer">
                                    <Upload className="w-4 h-4" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-center pt-8">
                        <Button 
                            type="submit" 
                            size="lg" 
                            className="rounded-[20px] px-12 py-7 text-lg font-black bg-primary hover:bg-primary/90 text-white shadow-2xl shadow-primary/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
                            disabled={submitMutation.isPending}
                        >
                            {submitMutation.isPending ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    Submitting Request...
                                </>
                            ) : (
                                <>
                                    Submit for Approval
                                    <ArrowRight className="ml-3 w-6 h-6" />
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            )}

            {/* Approved State Redirect Button */}
            {currentStatus === 'approved' && (
                <div className="flex justify-center">
                    <Button 
                        onClick={() => window.location.href = '/technician/dashboard'}
                        className="rounded-2xl px-12 py-6 bg-emerald-500 hover:bg-emerald-600 text-white font-bold"
                    >
                        Go to Dashboard
                    </Button>
                </div>
            )}
        </div>
    );
}
