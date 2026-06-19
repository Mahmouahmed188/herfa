'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  ShieldCheck,
  Upload,
  FileText,
  Camera,
  CheckCircle2,
  AlertCircle,
  Clock,
  Image as ImageIcon,
  Briefcase,
  Loader2,
  ArrowRight,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { useAuthStore } from '@/features/auth/stores/useAuthStore';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import * as api from '@/services/api';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function TechnicianOnboardingPage() {
  const { user, updateUser } = useAuthStore();
  const queryClient = useQueryClient();

  const [selectedFrontIdFile, setSelectedFrontIdFile] = useState<File | null>(null);
  const [selectedBackIdFile, setSelectedBackIdFile] = useState<File | null>(null);
  const [selectedPersonalPhotoFile, setSelectedPersonalPhotoFile] = useState<File | null>(null);

  const [frontIdPreview, setFrontIdPreview] = useState<string | null>(null);
  const [backIdPreview, setBackIdPreview] = useState<string | null>(null);
  const [personalPhotoPreview, setPersonalPhotoPreview] = useState<string | null>(null);

  const [portfolioFiles, setPortfolioFiles] = useState<File[]>([]);
  const [portfolioPreviews, setPortfolioPreviews] = useState<string[]>([]);

  const [certificateFiles, setCertificateFiles] = useState<File[]>([]);

  const [isUploading, setIsUploading] = useState(false);

  const frontIdRef = useRef<HTMLInputElement>(null);
  const backIdRef = useRef<HTMLInputElement>(null);
  const personalPhotoRef = useRef<HTMLInputElement>(null);
  const portfolioRef = useRef<HTMLInputElement>(null);
  const certificateRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (frontIdPreview) URL.revokeObjectURL(frontIdPreview);
      if (backIdPreview) URL.revokeObjectURL(backIdPreview);
      if (personalPhotoPreview) URL.revokeObjectURL(personalPhotoPreview);
      portfolioPreviews.forEach((p) => URL.revokeObjectURL(p));
    };
  }, [frontIdPreview, backIdPreview, personalPhotoPreview, portfolioPreviews]);

  // Fetch verification status
  const { data: verification, isLoading } = useQuery({
    queryKey: ['verificationStatus'],
    queryFn: () => api.getVerificationStatus(),
  });

  const handleSelectFrontId = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (frontIdPreview) URL.revokeObjectURL(frontIdPreview);
    setSelectedFrontIdFile(file);
    setFrontIdPreview(URL.createObjectURL(file));
    e.target.value = '';
  };

  const handleSelectBackId = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (backIdPreview) URL.revokeObjectURL(backIdPreview);
    setSelectedBackIdFile(file);
    setBackIdPreview(URL.createObjectURL(file));
    e.target.value = '';
  };

  const handleSelectPersonalPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (personalPhotoPreview) URL.revokeObjectURL(personalPhotoPreview);
    setSelectedPersonalPhotoFile(file);
    setPersonalPhotoPreview(URL.createObjectURL(file));
    e.target.value = '';
  };

  const removeFrontId = () => {
    if (frontIdPreview) URL.revokeObjectURL(frontIdPreview);
    setSelectedFrontIdFile(null);
    setFrontIdPreview(null);
    if (frontIdRef.current) frontIdRef.current.value = '';
  };

  const removeBackId = () => {
    if (backIdPreview) URL.revokeObjectURL(backIdPreview);
    setSelectedBackIdFile(null);
    setBackIdPreview(null);
    if (backIdRef.current) backIdRef.current.value = '';
  };

  const removePersonalPhoto = () => {
    if (personalPhotoPreview) URL.revokeObjectURL(personalPhotoPreview);
    setSelectedPersonalPhotoFile(null);
    setPersonalPhotoPreview(null);
    if (personalPhotoRef.current) personalPhotoRef.current.value = '';
  };

  const handleSelectPortfolio = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const newPreviews = files.map((f) => URL.createObjectURL(f));
    setPortfolioFiles((prev) => [...prev, ...files]);
    setPortfolioPreviews((prev) => [...prev, ...newPreviews]);
    e.target.value = '';
  };

  const removePortfolioImage = (index: number) => {
    URL.revokeObjectURL(portfolioPreviews[index]);
    setPortfolioFiles((prev) => prev.filter((_, i) => i !== index));
    setPortfolioPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const MAX_CERT_SIZE = 10 * 1024 * 1024;
  const ALLOWED_CERT_TYPES = [
    'application/pdf',
    'image/jpeg',
    'image/png',
  ];

  const handleSelectCertificates = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const valid: File[] = [];
    for (const file of files) {
      if (!ALLOWED_CERT_TYPES.includes(file.type)) {
        toast.error(`"${file.name}" has an unsupported format. Use PDF, JPG, or PNG.`);
        continue;
      }
      if (file.size > MAX_CERT_SIZE) {
        toast.error(`"${file.name}" exceeds the 10MB limit.`);
        continue;
      }
      valid.push(file);
    }

    if (valid.length) {
      setCertificateFiles((prev) => [...prev, ...valid]);
    }

    e.target.value = '';
  };

  const removeCertificate = (index: number) => {
    setCertificateFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFrontIdFile || !selectedBackIdFile) {
      toast.error('Please upload both sides of your National ID');
      return;
    }

    setIsUploading(true);
    try {
      const [uploadedFront, uploadedBack] = await Promise.all([
        api.uploadFile(selectedFrontIdFile),
        api.uploadFile(selectedBackIdFile),
      ]);

      let uploadedPersonal: { url: string } | null = null;
      if (selectedPersonalPhotoFile) {
        uploadedPersonal = await api.uploadFile(selectedPersonalPhotoFile);
      }

      const uploadedPortfolio = portfolioFiles.length
        ? await Promise.all(portfolioFiles.map((f) => api.uploadFile(f)))
        : [];

      const uploadedCertificates = certificateFiles.length
        ? await Promise.all(certificateFiles.map((f) => api.uploadFile(f)))
        : [];

      const payload: Record<string, string | string[]> = {
        frontIdImage: uploadedFront.url,
        backIdImage: uploadedBack.url,
        personalPhoto: uploadedPersonal?.url || '',
        documents: uploadedCertificates.map((item) => item.url),
        portfolio: uploadedPortfolio.map((item) => item.url),
      };

      await api.submitVerification(payload);

      queryClient.invalidateQueries({ queryKey: ['verificationStatus'] });
      updateUser({ status: 'PENDING' });
      toast.success('Application submitted for review');
    } catch (err: any) {
      toast.error(err.message || 'Submission failed');
    } finally {
      setIsUploading(false);
    }
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
      {/* Redirect to new unified verification */}
      <div className="mb-6 p-4 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-between">
        <p className="text-sm text-primary font-medium">New verification experience available</p>
        <Link
          href="/provider/verification"
          className="text-sm font-semibold text-primary hover:underline"
        >
          Go to Verification →
        </Link>
      </div>

      {/* Status Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
          <ShieldCheck className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-3">Technician Verification</h1>
        <p className="text-gray-400 max-w-lg mx-auto">
          To maintain the quality and safety of our marketplace, all technicians must undergo a
          verification process.
        </p>
      </div>

      {/* Status Banner */}
      <div
        className={cn(
          'mb-12 p-6 rounded-[32px] border flex items-center gap-6',
          currentStatus === 'pending'
            ? 'bg-amber-500/10 border-amber-500/20'
            : currentStatus === 'approved'
              ? 'bg-emerald-500/10 border-emerald-500/20'
              : currentStatus === 'rejected'
                ? 'bg-red-500/10 border-red-500/20'
                : 'bg-surface-dark border-surface-border'
        )}
      >
        <div
          className={cn(
            'w-12 h-12 rounded-2xl flex items-center justify-center shrink-0',
            currentStatus === 'pending'
              ? 'bg-amber-500 text-white'
              : currentStatus === 'approved'
                ? 'bg-emerald-500 text-white'
                : currentStatus === 'rejected'
                  ? 'bg-red-500 text-white'
                  : 'bg-primary text-white'
          )}
        >
          {currentStatus === 'pending' ? (
            <Clock className="w-6 h-6" />
          ) : currentStatus === 'approved' ? (
            <CheckCircle2 className="w-6 h-6" />
          ) : currentStatus === 'rejected' ? (
            <AlertCircle className="w-6 h-6" />
          ) : (
            <FileText className="w-6 h-6" />
          )}
        </div>
        <div className="flex-1">
          <h3 className="text-white font-bold text-lg capitalize">Status: {currentStatus}</h3>
          <p className="text-gray-400 text-sm mt-0.5">
            {currentStatus === 'pending'
              ? 'Your application is under review. We will respond shortly.'
              : currentStatus === 'approved'
                ? 'Your account is verified! You can now access all features.'
                : currentStatus === 'rejected'
                  ? `Verification rejected. ${verification?.adminNote || 'Please review your documents.'}`
                  : 'Please complete the form below to start the verification process.'}
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
                <h2 className="text-white font-bold text-xl">National ID*</h2>
              </div>
              <p className="text-gray-500 text-sm italic">
                Upload clear photos of both the front and back of your National ID.
              </p>

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="file"
                  ref={frontIdRef}
                  className="hidden"
                  onChange={handleSelectFrontId}
                  accept="image/*"
                />
                <div
                  onClick={() => !isUploading && frontIdRef.current?.click()}
                  className={cn(
                    'aspect-[3/2] rounded-2xl border-2 border-dashed border-surface-border hover:border-primary/50 transition-all flex flex-col items-center justify-center cursor-pointer group bg-surface-light/30 relative overflow-hidden',
                    frontIdPreview && 'border-solid border-primary/30'
                  )}
                >
                  {frontIdPreview ? (
                    <>
                      <img
                        src={frontIdPreview}
                        alt="Front ID"
                        className="w-full h-full object-cover"
                      />
                      {!isUploading && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFrontId();
                          }}
                          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 flex items-center justify-center hover:bg-black/80 transition-colors"
                        >
                          <X className="w-4 h-4 text-white" />
                        </button>
                      )}
                    </>
                  ) : (
                    <>
                      <Upload className="w-6 h-6 text-gray-600 group-hover:text-primary mb-2" />
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                        Front Side
                      </span>
                    </>
                  )}
                </div>

                <input
                  type="file"
                  ref={backIdRef}
                  className="hidden"
                  onChange={handleSelectBackId}
                  accept="image/*"
                />
                <div
                  onClick={() => !isUploading && backIdRef.current?.click()}
                  className={cn(
                    'aspect-[3/2] rounded-2xl border-2 border-dashed border-surface-border hover:border-primary/50 transition-all flex flex-col items-center justify-center cursor-pointer group bg-surface-light/30 relative overflow-hidden',
                    backIdPreview && 'border-solid border-primary/30'
                  )}
                >
                  {backIdPreview ? (
                    <>
                      <img
                        src={backIdPreview}
                        alt="Back ID"
                        className="w-full h-full object-cover"
                      />
                      {!isUploading && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeBackId();
                          }}
                          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 flex items-center justify-center hover:bg-black/80 transition-colors"
                        >
                          <X className="w-4 h-4 text-white" />
                        </button>
                      )}
                    </>
                  ) : (
                    <>
                      <Upload className="w-6 h-6 text-gray-600 group-hover:text-primary mb-2" />
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                        Back Side
                      </span>
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
                <h2 className="text-white font-bold text-xl">Personal Photo*</h2>
              </div>
              <p className="text-gray-500 text-sm italic">
                A professional photo for your profile (headshot only).
              </p>

              <input
                type="file"
                ref={personalPhotoRef}
                className="hidden"
                onChange={handleSelectPersonalPhoto}
                accept="image/*"
              />
              <div
                onClick={() => !isUploading && personalPhotoRef.current?.click()}
                className={cn(
                  'w-full h-40 rounded-2xl border-2 border-dashed border-surface-border hover:border-primary/50 transition-all flex flex-col items-center justify-center cursor-pointer group bg-surface-light/30 relative overflow-hidden',
                  personalPhotoPreview && 'border-solid border-primary/30'
                )}
              >
                {personalPhotoPreview ? (
                  <>
                    <img
                      src={personalPhotoPreview}
                      alt="Personal"
                      className="w-full h-full object-cover"
                    />
                    {!isUploading && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removePersonalPhoto();
                        }}
                        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 flex items-center justify-center hover:bg-black/80 transition-colors"
                      >
                        <X className="w-4 h-4 text-white" />
                      </button>
                    )}
                  </>
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-gray-600 group-hover:text-primary mb-2" />
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                      Upload Portrait
                    </span>
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
              <p className="text-gray-500 text-sm italic">
                Upload any trade certificates or professional licenses.
              </p>

              <input
                type="file"
                ref={certificateRef}
                className="hidden"
                onChange={handleSelectCertificates}
                accept=".pdf,.jpg,.jpeg,.png"
                multiple
              />

              {certificateFiles.length > 0 ? (
                <div className="space-y-2">
                  {certificateFiles.map((file, index) => (
                    <div
                      key={`${file.name}-${file.size}`}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl bg-surface-light/30 border border-surface-border"
                    >
                      <FileText className="w-5 h-5 text-primary shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{file.name}</p>
                        <p className="text-xs text-gray-500">
                          {file.type.toUpperCase().replace('IMAGE/', '')} · {formatFileSize(file.size)}
                        </p>
                      </div>
                      {!isUploading && (
                        <button
                          type="button"
                          onClick={() => removeCertificate(index)}
                          className="w-7 h-7 rounded-full bg-black/60 flex items-center justify-center hover:bg-black/80 transition-colors shrink-0"
                        >
                          <X className="w-4 h-4 text-white" />
                        </button>
                      )}
                    </div>
                  ))}
                  {!isUploading && (
                    <div
                      onClick={() => certificateRef.current?.click()}
                      className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-surface-border hover:border-primary/50 transition-all cursor-pointer group text-gray-400 hover:text-primary"
                    >
                      <Upload className="w-4 h-4" />
                      <span className="text-sm font-medium">Add another document</span>
                    </div>
                  )}
                </div>
              ) : (
                <div
                  onClick={() => !isUploading && certificateRef.current?.click()}
                  className="w-full h-32 rounded-2xl border-2 border-dashed border-surface-border hover:border-primary/50 transition-all flex flex-col items-center justify-center gap-2 text-gray-400 cursor-pointer group bg-surface-light/30"
                >
                  <Upload className="w-6 h-6 group-hover:text-primary" />
                  <span className="text-sm font-medium group-hover:text-primary">
                    Add document (.pdf, .jpg, .png)
                  </span>
                </div>
              )}
            </div>

            {/* Portfolio */}
            <div className="bg-surface-dark border border-surface-border rounded-[32px] p-8 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h2 className="text-white font-bold text-xl">Work Portfolio</h2>
              </div>
              <p className="text-gray-500 text-sm italic">
                Optional: Show off your best work to get hired faster.
              </p>

              <input
                type="file"
                ref={portfolioRef}
                className="hidden"
                onChange={handleSelectPortfolio}
                accept="image/*"
                multiple
              />

              {portfolioPreviews.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                  {portfolioPreviews.map((preview, index) => (
                    <div
                      key={preview}
                      className="relative w-20 h-20 rounded-xl overflow-hidden border border-surface-border group"
                    >
                      <img
                        src={preview}
                        alt={`Portfolio ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {!isUploading && (
                        <button
                          type="button"
                          onClick={() => removePortfolioImage(index)}
                          className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 flex items-center justify-center hover:bg-black/80 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <X className="w-3 h-3 text-white" />
                        </button>
                      )}
                    </div>
                  ))}
                  {!isUploading && (
                    <div
                      onClick={() => portfolioRef.current?.click()}
                      className="w-20 h-20 rounded-xl border-2 border-dashed border-surface-border flex items-center justify-center text-gray-600 hover:text-primary hover:border-primary transition-all cursor-pointer"
                    >
                      <Upload className="w-5 h-5" />
                    </div>
                  )}
                </div>
              ) : (
                <div
                  onClick={() => !isUploading && portfolioRef.current?.click()}
                  className="w-full h-20 rounded-2xl border-2 border-dashed border-surface-border hover:border-primary/50 transition-all flex items-center justify-center gap-3 text-gray-400 cursor-pointer group bg-surface-light/30"
                >
                  <Upload className="w-5 h-5 group-hover:text-primary" />
                  <span className="text-sm font-medium group-hover:text-primary">
                    Add portfolio images
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-8">
            <Button
              type="submit"
              size="lg"
              className="rounded-[20px] px-12 py-7 text-lg font-black bg-primary hover:bg-primary/90 text-white shadow-2xl shadow-primary/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Uploading & Submitting...
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
            onClick={() => (window.location.href = '/technician/dashboard')}
            className="rounded-2xl px-12 py-6 bg-emerald-500 hover:bg-emerald-600 text-white font-bold"
          >
            Go to Dashboard
          </Button>
        </div>
      )}
    </div>
  );
}
