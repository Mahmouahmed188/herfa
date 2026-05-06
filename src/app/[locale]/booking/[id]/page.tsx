'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import { Calendar, Clock, MapPin, User, ChevronLeft, Star, ShieldCheck, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { Link, useRouter } from '@/lib/navigation';
import * as api from '@/services/api';
import { useAuthStore } from '@/store/useAuthStore';

interface TechnicianInfo {
    id: string;
    name: string;
    title: string;
    rating: number;
    reviews: number;
    hourlyRate: number;
    image: string;
    verified?: boolean;
    available?: boolean;
    location?: string;
}

type BookingStep = 'details' | 'confirm' | 'success';

export default function BookingPage() {
    const { id } = useParams<{ id: string }>();
    const locale = useLocale();
    const isRtl = locale === 'ar';
    const router = useRouter();
    const { user, isAuthenticated } = useAuthStore();

    const [technician, setTechnician] = useState<TechnicianInfo | null>(null);
    const [loadingTech, setLoadingTech] = useState(true);
    const [step, setStep] = useState<BookingStep>('details');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [bookingId, setBookingId] = useState<string | null>(null);

    const [form, setForm] = useState({
        date: '',
        time: '',
        address: '',
        description: '',
        notes: '',
    });
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    // Load technician info
    useEffect(() => {
        async function loadTechnician() {
            if (!id) return;
            setLoadingTech(true);
            try {
                const data = await api.getProviderById(id as string);
                if (data) {
                    setTechnician({
                        id: data.id || data.userId,
                        name: data.user?.firstName
                            ? `${data.user.firstName} ${data.user.lastName || ''}`.trim()
                            : data.businessName || 'Technician',
                        title: data.services?.[0]?.service?.name || data.businessName || 'Professional',
                        rating: parseFloat(data.rating) || 4.5,
                        reviews: data.totalJobsCompleted || 0,
                        hourlyRate: data.services?.[0]?.price || 50,
                        image: data.profileImage || data.user?.profileImage ||
                            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
                        verified: data.verificationStatus === 'verified',
                        available: data.isAvailable,
                        location: data.address,
                    });
                }
            } catch {
                // Fallback to mock if API fails
                setTechnician({
                    id: id as string,
                    name: 'Professional Technician',
                    title: 'Home Services Expert',
                    rating: 4.8,
                    reviews: 120,
                    hourlyRate: 45,
                    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
                    verified: true,
                    available: true,
                });
            } finally {
                setLoadingTech(false);
            }
        }
        loadTechnician();
    }, [id]);

    const validate = () => {
        const errors: Record<string, string> = {};
        if (!form.date) errors.date = 'Please select a date';
        if (!form.time) errors.time = 'Please select a time';
        if (!form.address.trim()) errors.address = 'Please enter your address';
        if (!form.description.trim()) errors.description = 'Please describe what you need';

        // Check date is in the future
        if (form.date) {
            const selected = new Date(form.date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (selected < today) errors.date = 'Please select a future date';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleNext = () => {
        if (!isAuthenticated) {
            router.push('/login' as any);
            return;
        }
        if (validate()) {
            setStep('confirm');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleConfirm = async () => {
        setIsSubmitting(true);
        setError('');
        try {
            const result = await api.createBooking({
                serviceId: technician?.id || id as string,  // Use first available service ID
                title: `${technician?.title || 'Service'} Appointment`,
                description: form.description,
                address: form.address,
                scheduledDate: form.date,
                scheduledTime: form.time,
                notes: form.notes,
            });
            setBookingId(result?.id || 'HERFA-' + Date.now().toString(36).toUpperCase());
            setStep('success');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (err: any) {
            setError(err.message || 'Failed to create booking. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const minDate = new Date().toISOString().split('T')[0];

    return (
        <div className="bg-[#0E1512] min-h-screen text-white">
            {/* Header */}
            <div className="border-b border-white/5 px-6 py-5">
                <div className="container mx-auto max-w-4xl flex items-center gap-4">
                    <Link
                        href={'/technicians' as any}
                        className="flex items-center gap-2 text-gray-400 hover:text-primary transition-colors text-sm"
                    >
                        <ChevronLeft className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
                        {isRtl ? 'العودة إلى الفنيين' : 'Back to Technicians'}
                    </Link>
                </div>
            </div>

            <div className="container mx-auto max-w-4xl px-6 py-10">

                {/* Step Indicator */}
                {step !== 'success' && (
                    <div className="flex items-center gap-3 mb-10">
                        {['Details', 'Confirm'].map((label, i) => {
                            const stepIndex = i === 0 ? 'details' : 'confirm';
                            const isActive = step === stepIndex;
                            const isDone = (i === 0 && step === 'confirm');
                            return (
                                <React.Fragment key={label}>
                                    <div className={`flex items-center gap-2 text-sm font-bold transition-colors ${isActive ? 'text-primary' : isDone ? 'text-primary/60' : 'text-gray-600'}`}>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black border-2 transition-all ${isActive ? 'border-primary bg-primary/20 text-primary' : isDone ? 'border-primary/40 bg-primary/10 text-primary/60' : 'border-white/10 text-gray-600'}`}>
                                            {isDone ? <CheckCircle className="w-4 h-4" /> : i + 1}
                                        </div>
                                        {label}
                                    </div>
                                    {i < 1 && <div className="flex-1 h-px bg-white/10 max-w-[60px]" />}
                                </React.Fragment>
                            );
                        })}
                    </div>
                )}

                {/* SUCCESS STATE */}
                {step === 'success' && (
                    <div className="text-center py-16 space-y-6">
                        <div className="w-24 h-24 rounded-full bg-primary/20 border-2 border-primary/40 flex items-center justify-center mx-auto">
                            <CheckCircle className="w-12 h-12 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-extrabold text-white mb-2">Booking Confirmed!</h1>
                            <p className="text-gray-400">Your appointment has been successfully booked.</p>
                        </div>
                        {bookingId && (
                            <div className="inline-block bg-[#1A2C22] border border-primary/20 rounded-2xl px-6 py-4">
                                <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Booking Reference</p>
                                <p className="text-xl font-black text-primary">{bookingId}</p>
                            </div>
                        )}
                        <div className="bg-[#1A2C22] border border-white/5 rounded-2xl p-6 max-w-sm mx-auto text-left space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Technician</span>
                                <span className="font-semibold text-white">{technician?.name}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Date</span>
                                <span className="font-semibold text-white">{form.date}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Time</span>
                                <span className="font-semibold text-white">{form.time}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Address</span>
                                <span className="font-semibold text-white text-right max-w-[160px]">{form.address}</span>
                            </div>
                        </div>
                        <div className="flex gap-4 justify-center pt-4">
                            <Link
                                href={'/client/jobs' as any}
                                className="px-6 py-3 rounded-xl bg-primary text-background-dark font-bold text-sm hover:bg-primary/90 transition-colors"
                            >
                                View My Jobs
                            </Link>
                            <Link
                                href={'/technicians' as any}
                                className="px-6 py-3 rounded-xl border border-white/10 text-gray-300 font-bold text-sm hover:bg-white/5 transition-colors"
                            >
                                Browse More
                            </Link>
                        </div>
                    </div>
                )}

                {/* TECHNICIAN CARD + FORM (shown in both steps) */}
                {step !== 'success' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left: Form / Confirmation */}
                        <div className="lg:col-span-2 space-y-6">
                            {step === 'details' && (
                                <>
                                    <h1 className="text-2xl font-extrabold text-white">
                                        {isRtl ? 'حجز موعد' : 'Book an Appointment'}
                                    </h1>

                                    <div className="bg-[#1A2C22] border border-white/5 rounded-3xl p-6 space-y-6">
                                        {/* Date & Time */}
                                        <div>
                                            <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">
                                                Schedule
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm text-gray-400 mb-2">
                                                        <Calendar className="w-4 h-4 inline mr-1 mb-0.5" />
                                                        {isRtl ? 'اختر التاريخ' : 'Select Date'} *
                                                    </label>
                                                    <input
                                                        type="date"
                                                        min={minDate}
                                                        value={form.date}
                                                        onChange={(e) => setForm({ ...form, date: e.target.value })}
                                                        className={`w-full bg-[#0E1512] border rounded-xl px-4 py-3 text-white outline-none focus:border-primary transition-colors ${formErrors.date ? 'border-red-500/50' : 'border-white/10'}`}
                                                    />
                                                    {formErrors.date && (
                                                        <p className="text-red-400 text-xs mt-1">{formErrors.date}</p>
                                                    )}
                                                </div>
                                                <div>
                                                    <label className="block text-sm text-gray-400 mb-2">
                                                        <Clock className="w-4 h-4 inline mr-1 mb-0.5" />
                                                        {isRtl ? 'اختر الوقت' : 'Select Time'} *
                                                    </label>
                                                    <input
                                                        type="time"
                                                        value={form.time}
                                                        onChange={(e) => setForm({ ...form, time: e.target.value })}
                                                        className={`w-full bg-[#0E1512] border rounded-xl px-4 py-3 text-white outline-none focus:border-primary transition-colors ${formErrors.time ? 'border-red-500/50' : 'border-white/10'}`}
                                                    />
                                                    {formErrors.time && (
                                                        <p className="text-red-400 text-xs mt-1">{formErrors.time}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Address */}
                                        <div>
                                            <label className="block text-sm text-gray-400 mb-2">
                                                <MapPin className="w-4 h-4 inline mr-1 mb-0.5" />
                                                {isRtl ? 'الموقع' : 'Service Address'} *
                                            </label>
                                            <input
                                                type="text"
                                                placeholder={isRtl ? 'أدخل عنوانك الكامل' : 'Enter your full address'}
                                                value={form.address}
                                                onChange={(e) => setForm({ ...form, address: e.target.value })}
                                                className={`w-full bg-[#0E1512] border rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none focus:border-primary transition-colors ${formErrors.address ? 'border-red-500/50' : 'border-white/10'}`}
                                            />
                                            {formErrors.address && (
                                                <p className="text-red-400 text-xs mt-1">{formErrors.address}</p>
                                            )}
                                        </div>

                                        {/* Description */}
                                        <div>
                                            <label className="block text-sm text-gray-400 mb-2">
                                                {isRtl ? 'وصف المشكلة' : 'Describe what you need'} *
                                            </label>
                                            <textarea
                                                rows={4}
                                                placeholder={isRtl ? 'اوصف المشكلة أو الخدمة التي تحتاجها...' : 'Describe the issue or service you need in detail...'}
                                                value={form.description}
                                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                                className={`w-full bg-[#0E1512] border rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none focus:border-primary transition-colors resize-none ${formErrors.description ? 'border-red-500/50' : 'border-white/10'}`}
                                            />
                                            {formErrors.description && (
                                                <p className="text-red-400 text-xs mt-1">{formErrors.description}</p>
                                            )}
                                        </div>

                                        {/* Notes */}
                                        <div>
                                            <label className="block text-sm text-gray-400 mb-2">
                                                {isRtl ? 'ملاحظات إضافية' : 'Additional Notes'} (optional)
                                            </label>
                                            <input
                                                type="text"
                                                placeholder={isRtl ? 'أي معلومات إضافية...' : 'Any special instructions or notes...'}
                                                value={form.notes}
                                                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                                                className="w-full bg-[#0E1512] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none focus:border-primary transition-colors"
                                            />
                                        </div>
                                    </div>

                                    {!isAuthenticated && (
                                        <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                                            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                                            <p className="text-sm text-amber-300">
                                                You need to be logged in to complete a booking.{' '}
                                                <Link href={'/login' as any} className="font-bold underline">
                                                    Login here
                                                </Link>
                                            </p>
                                        </div>
                                    )}

                                    <button
                                        onClick={handleNext}
                                        className="w-full bg-primary hover:bg-primary/90 text-background-dark font-extrabold py-4 rounded-2xl transition-all shadow-lg shadow-primary/20 ring-1 ring-primary/50 text-sm"
                                    >
                                        {isRtl ? 'التالي: تأكيد الحجز' : 'Next: Review & Confirm'}
                                    </button>
                                </>
                            )}

                            {step === 'confirm' && (
                                <>
                                    <h1 className="text-2xl font-extrabold text-white">Review Your Booking</h1>

                                    <div className="bg-[#1A2C22] border border-white/5 rounded-3xl p-6 space-y-4">
                                        <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">Booking Summary</h3>

                                        {[
                                            { label: 'Date', value: form.date },
                                            { label: 'Time', value: form.time },
                                            { label: 'Address', value: form.address },
                                            { label: 'Description', value: form.description },
                                            ...(form.notes ? [{ label: 'Notes', value: form.notes }] : []),
                                        ].map(({ label, value }) => (
                                            <div key={label} className="flex gap-4 py-3 border-b border-white/5 last:border-0">
                                                <span className="text-gray-500 text-sm w-28 shrink-0">{label}</span>
                                                <span className="text-white text-sm font-medium">{value}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Estimated cost */}
                                    <div className="bg-[#1A2C22] border border-primary/20 rounded-3xl p-6">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="text-gray-400 text-sm">Estimated Cost</p>
                                                <p className="text-xs text-gray-600 mt-0.5">Final price agreed with technician</p>
                                            </div>
                                            <p className="text-2xl font-black text-primary">
                                                ${technician?.hourlyRate || 45}<span className="text-sm text-gray-400 font-medium">/hr</span>
                                            </p>
                                        </div>
                                    </div>

                                    {error && (
                                        <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                                            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                                            <p className="text-sm text-red-300">{error}</p>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            onClick={() => setStep('details')}
                                            disabled={isSubmitting}
                                            className="py-4 rounded-2xl border border-white/10 text-gray-300 font-bold text-sm hover:bg-white/5 transition-colors disabled:opacity-50"
                                        >
                                            {isRtl ? 'العودة' : 'Go Back'}
                                        </button>
                                        <button
                                            onClick={handleConfirm}
                                            disabled={isSubmitting}
                                            className="py-4 rounded-2xl bg-primary hover:bg-primary/90 text-background-dark font-extrabold text-sm transition-all shadow-lg shadow-primary/20 disabled:opacity-70 flex items-center justify-center gap-2"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    Confirming...
                                                </>
                                            ) : (
                                                isRtl ? 'تأكيد الحجز' : 'Confirm Booking'
                                            )}
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Right: Technician Card */}
                        <div className="space-y-4">
                            <div className="bg-[#1A2C22] border border-white/5 rounded-3xl overflow-hidden sticky top-24">
                                {loadingTech ? (
                                    <div className="p-6 space-y-4 animate-pulse">
                                        <div className="w-20 h-20 rounded-full bg-white/10 mx-auto" />
                                        <div className="h-5 bg-white/10 rounded-lg w-3/4 mx-auto" />
                                        <div className="h-4 bg-white/10 rounded-lg w-1/2 mx-auto" />
                                    </div>
                                ) : technician ? (
                                    <>
                                        <div className="aspect-[4/3] relative overflow-hidden">
                                            <img src={technician.image} alt={technician.name} className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-[#1A2C22] via-transparent to-transparent" />
                                            {technician.available !== undefined && (
                                                <div className="absolute top-3 left-3">
                                                    <span className={`flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full ${technician.available ? 'bg-primary/20 text-primary' : 'bg-white/10 text-gray-400'}`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full ${technician.available ? 'bg-primary animate-pulse' : 'bg-gray-500'}`} />
                                                        {technician.available ? 'Available' : 'Busy'}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-6">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-extrabold text-white text-lg">{technician.name}</h3>
                                                {technician.verified && <ShieldCheck className="w-4 h-4 text-primary" />}
                                            </div>
                                            <p className="text-primary text-sm font-medium mb-3">{technician.title}</p>

                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="flex items-center gap-1">
                                                    <Star className="w-3.5 h-3.5 fill-primary text-primary" />
                                                    <span className="text-sm font-bold text-white">{technician.rating}</span>
                                                </div>
                                                <span className="text-gray-600 text-xs">({technician.reviews} jobs)</span>
                                            </div>

                                            {technician.location && (
                                                <p className="text-gray-500 text-xs flex items-center gap-1 mb-4">
                                                    <MapPin className="w-3 h-3 shrink-0" />
                                                    {technician.location}
                                                </p>
                                            )}

                                            <div className="border-t border-white/5 pt-4">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-gray-500 text-xs uppercase tracking-widest">Hourly Rate</span>
                                                    <span className="text-xl font-black text-white">
                                                        ${technician.hourlyRate}<span className="text-xs text-gray-500 font-medium">/hr</span>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="p-6 text-center">
                                        <User className="w-12 h-12 text-gray-600 mx-auto mb-2" />
                                        <p className="text-gray-500 text-sm">Technician info unavailable</p>
                                    </div>
                                )}
                            </div>

                            {/* Trust indicators */}
                            <div className="bg-[#1A2C22] border border-white/5 rounded-2xl p-5 space-y-3">
                                {[
                                    { icon: ShieldCheck, label: 'Verified & Insured' },
                                    { icon: CheckCircle, label: 'Free Cancellation (24h)' },
                                    { icon: Star, label: 'Satisfaction Guaranteed' },
                                ].map(({ icon: Icon, label }) => (
                                    <div key={label} className="flex items-center gap-3 text-sm text-gray-400">
                                        <Icon className="w-4 h-4 text-primary shrink-0" />
                                        {label}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
