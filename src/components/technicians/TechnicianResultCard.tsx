'use client';

import React from 'react';
import { Star, MapPin, ShieldCheck, Heart } from 'lucide-react';
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
    const t = useTranslations('services_page');
    const router = useRouter();

    const handleBooking = () => {
        router.push(`/${locale}/booking/${tech.id}`);
    };

    return (
        <div className="bg-[#1A2C22] border border-white/5 rounded-[32px] overflow-hidden hover:shadow-2xl hover:shadow-primary/10 transition-all group flex flex-col h-full active:scale-[0.98]">
            {/* Image Container */}
            <div className="relative aspect-[4/3] w-full overflow-hidden">
                <img
                    src={tech.image}
                    alt={tech.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A2C22] via-transparent to-transparent opacity-60"></div>

                {/* Category Badge */}
                <div className="absolute top-4 left-4 rtl:left-auto rtl:right-4">
                    <span className="bg-white/10 backdrop-blur-md border border-white/10 text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                        {tech.title}
                    </span>
                </div>

                {/* Favorite Button */}
                <button className="absolute top-4 right-4 rtl:right-auto rtl:left-4 p-2 rounded-full bg-black/20 backdrop-blur-md border border-white/5 text-white hover:bg-primary hover:text-background-dark transition-all">
                    <Heart className="w-4 h-4" />
                </button>
            </div>

            {/* Content Area */}
            <div className="p-6 flex flex-col flex-1">
                <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <h3 className="text-lg font-extrabold text-white group-hover:text-primary transition-colors cursor-pointer line-clamp-1">
                            {tech.name}
                        </h3>
                        {tech.verified && <ShieldCheck className="w-4 h-4 text-primary fill-primary/10" />}
                    </div>
                    <div className="flex items-center gap-1 bg-white/5 rounded-full px-2 py-0.5">
                        <Star className="w-3.5 h-3.5 fill-primary text-primary" />
                        <span className="text-sm font-black text-white">{tech.rating}</span>
                    </div>
                </div>

                <p className="text-gray-400 text-sm mb-6 line-clamp-2 leading-relaxed">
                    {tech.description || (locale === 'ar' ? "فني خبير يقدم خدمات عالية الجودة مع أكثر من عدة سنوات من الخبرة المهنية." : "Expert technician providing high-quality services with over several years of professional experience.")}
                </p>

                <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">{t('startingAt')}</p>
                        <p className="text-xl font-black text-white">
                            ${tech.hourlyRate}<span className="text-xs text-gray-400 font-medium ml-1">/hr</span>
                        </p>
                    </div>
                    <Button
                        onClick={handleBooking}
                        className="rounded-2xl px-6 py-3 h-auto text-sm font-extrabold bg-white text-background-dark hover:bg-primary transition-all shadow-lg shadow-white/5"
                    >
                        {t('bookingNow')}
                    </Button>
                </div>
            </div>
        </div>
    );
}
