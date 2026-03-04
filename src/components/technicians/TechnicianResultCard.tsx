'use client';

import React from 'react';
import { Star, MapPin, ShieldCheck, Clock, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/button';

export interface TechnicianProps {
    id: string;
    name: string;
    title: string;
    rating: number;
    reviews: number;
    hourlyRate: number;
    image: string;
    matchPercentage?: number;
    skills: string[];
    verified?: boolean;
    available?: boolean;
    experience?: string;
    location?: string;
    description?: string;
}

export default function TechnicianResultCard({ tech }: { tech: TechnicianProps }) {
    const locale = useLocale();
    const t = useTranslations('ServicesPage');
    const router = useRouter();

    const handleBooking = () => {
        router.push(`/${locale}/booking/${tech.id}`);
    };

    return (
        <div className="bg-white dark:bg-[#1A2C22] border border-gray-100 dark:border-[#2D4A3A] rounded-2xl p-5 hover:shadow-lg transition-all group">
            <div className="flex flex-col sm:flex-row gap-5">
                {/* Image Section */}
                <div className="relative w-full sm:w-32 h-32 flex-shrink-0">
                    <div className="w-full h-full rounded-xl bg-gray-100 dark:bg-gray-800 relative overflow-hidden">
                        <img
                            src={tech.image}
                            alt={tech.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                    </div>
                    {tech.available && (
                        <div className="absolute -top-2 -right-2 bg-green-500 w-4 h-4 rounded-full border-2 border-white dark:border-[#1A2C22] z-10">
                            <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75"></span>
                        </div>
                    )}
                </div>

                {/* Info Section */}
                <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white hover:text-primary transition-colors cursor-pointer line-clamp-1">
                                    {tech.name}
                                </h3>
                                {tech.verified && <ShieldCheck className="w-5 h-5 text-primary" />}
                                {tech.experience && (
                                    <span className="text-[10px] uppercase tracking-wider font-bold bg-primary/10 text-primary px-2 py-0.5 rounded">
                                        {tech.experience}
                                    </span>
                                )}
                            </div>
                            <p className="text-primary font-medium text-sm mb-2">{tech.title}</p>
                        </div>
                        <div className="text-left sm:text-right">
                            <p className="text-xl font-extrabold text-slate-900 dark:text-white">${tech.hourlyRate}<span className="text-xs text-gray-400 font-normal">/hr</span></p>
                            <div className="flex items-center gap-1 sm:justify-end text-yellow-400 mt-1">
                                <Star className="w-4 h-4 fill-current" />
                                <span className="font-bold text-sm text-slate-700 dark:text-gray-200">{tech.rating}</span>
                                <span className="text-gray-400 text-xs text-nowrap">({tech.reviews} {t('reviews')})</span>
                            </div>
                        </div>
                    </div>

                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-3 line-clamp-2 leading-relaxed">
                        {tech.description || (locale === 'ar' ? "فني خبير يقدم خدمات عالية الجودة مع أكثر من عدة سنوات من الخبرة المهنية في هذا المجال." : "Expert technician providing high-quality services with over several years of professional experience in the field.")}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 mt-4">
                        <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 text-xs">
                            <MapPin className="w-3.5 h-3.5" />
                            <span>{tech.location || (locale === 'ar' ? "القاهرة، مصر" : "Cairo, Egypt")}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 text-xs">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{locale === 'ar' ? "متاح اليوم" : "Available Today"}</span>
                        </div>
                    </div>
                </div>

                {/* Action Section */}
                <div className="flex flex-col justify-end">
                    <Button
                        onClick={handleBooking}
                        className="w-full sm:w-auto px-8 bg-primary hover:bg-primary/90 text-white dark:text-background-dark font-bold rounded-xl h-12"
                    >
                        {t('bookingNow')} <ArrowRight className="w-4 h-4 ml-2 rtl:rotate-180" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
