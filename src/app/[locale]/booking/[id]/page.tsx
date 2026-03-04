'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import { Calendar, Clock, MapPin, User, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function BookingPage() {
    const { id } = useParams();
    const locale = useLocale();
    const isRtl = locale === 'ar';

    return (
        <div className="bg-[#0E1512] min-h-screen text-white p-6">
            <div className="container mx-auto max-w-3xl">
                <Link
                    href={`/${locale}/technicians`}
                    className="flex items-center gap-2 text-primary hover:underline mb-8"
                >
                    <ChevronLeft className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
                    {isRtl ? "العودة إلى الفنيين" : "Back to Technicians"}
                </Link>

                <h1 className="text-3xl font-bold mb-6">
                    {isRtl ? "حجز موعد" : "Book an Appointment"}
                </h1>

                <div className="bg-[#1A2C22] border border-[#2D4A3A] rounded-3xl p-8 shadow-xl">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                            <User className="w-8 h-8 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">{isRtl ? "جاري تحميل بيانات الفني..." : "Loading Technician..."}</h2>
                            <p className="text-gray-400 text-sm">ID: {id}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="space-y-4">
                            <label className="block">
                                <span className="text-gray-400 text-sm">{isRtl ? "اختر التاريخ" : "Select Date"}</span>
                                <div className="mt-1 flex items-center gap-3 bg-[#0E1512] border border-[#2D4A3A] p-4 rounded-xl">
                                    <Calendar className="w-5 h-5 text-primary" />
                                    <input type="date" className="bg-transparent outline-none flex-1" />
                                </div>
                            </label>
                            <label className="block">
                                <span className="text-gray-400 text-sm">{isRtl ? "اختر الوقت" : "Select Time"}</span>
                                <div className="mt-1 flex items-center gap-3 bg-[#0E1512] border border-[#2D4A3A] p-4 rounded-xl">
                                    <Clock className="w-5 h-5 text-primary" />
                                    <input type="time" className="bg-transparent outline-none flex-1" />
                                </div>
                            </label>
                        </div>
                        <div className="space-y-4">
                            <label className="block">
                                <span className="text-gray-400 text-sm">{isRtl ? "الموقع" : "Location"}</span>
                                <div className="mt-1 flex items-center gap-3 bg-[#0E1512] border border-[#2D4A3A] p-4 rounded-xl">
                                    <MapPin className="w-5 h-5 text-primary" />
                                    <input type="text" placeholder={isRtl ? "أدخل عنوانك" : "Enter your address"} className="bg-transparent outline-none flex-1" />
                                </div>
                            </label>
                        </div>
                    </div>

                    <button className="w-full bg-primary hover:bg-primary/90 text-background-dark font-extrabold py-4 rounded-2xl transition-all shadow-lg shadow-primary/20 ring-1 ring-primary/50">
                        {isRtl ? "تأكيد الحجز" : "Confirm Booking"}
                    </button>
                </div>
            </div>
        </div>
    );
}
