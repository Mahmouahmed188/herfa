'use client';

import React, { useState, useEffect } from 'react';
import { Star, MapPin, ShieldCheck, Heart } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from '@/lib/navigation';
import Button from '@/components/ui/button';
import * as api from '@/services/api';

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
    const t = useTranslations('Services');
    const router = useRouter();

    const [isFavorite, setIsFavorite] = useState(false);

    // Sync favorite state from localStorage on mount
    useEffect(() => {
        const favorites = api.getFavoriteIds();
        setIsFavorite(favorites.includes(tech.id));
    }, [tech.id]);

    const handleToggleFavorite = (e: React.MouseEvent) => {
        e.stopPropagation();
        const newState = api.toggleFavoriteLocal(tech.id);
        setIsFavorite(newState);
    };

    const handleBooking = () => {
        router.push(`/booking/${tech.id}` as any);
    };

    const handleViewProfile = () => {
        router.push(`/technicians/${tech.id}` as any);
    };

    return (
        <div
            className="bg-[#1A2C22] border border-white/5 rounded-[32px] overflow-hidden hover:shadow-2xl hover:shadow-primary/10 transition-all group flex flex-col h-full active:scale-[0.98]"
        >
            {/* Image Container */}
            <div className="relative aspect-[4/3] w-full overflow-hidden cursor-pointer" onClick={handleViewProfile}>
                <img
                    src={tech.image}
                    alt={tech.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A2C22] via-transparent to-transparent opacity-60"></div>

                {/* Availability Badge */}
                {tech.available !== undefined && (
                    <div className="absolute top-4 left-4 rtl:left-auto rtl:right-4">
                        <span className={`flex items-center gap-1.5 text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider backdrop-blur-md border ${
                            tech.available
                                ? 'bg-primary/20 border-primary/30 text-primary'
                                : 'bg-white/10 border-white/10 text-gray-400'
                        }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${tech.available ? 'bg-primary animate-pulse' : 'bg-gray-500'}`} />
                            {tech.available ? 'Available' : 'Busy'}
                        </span>
                    </div>
                )}

                {/* Favorite Button */}
                <button
                    onClick={handleToggleFavorite}
                    className={`absolute top-4 right-4 rtl:right-auto rtl:left-4 p-2 rounded-full backdrop-blur-md border transition-all ${
                        isFavorite
                            ? 'bg-red-500/20 border-red-400/30 text-red-400'
                            : 'bg-black/20 border-white/5 text-white hover:bg-red-500/20 hover:border-red-400/30 hover:text-red-400'
                    }`}
                    title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                >
                    <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                </button>
            </div>

            {/* Content Area */}
            <div className="p-6 flex flex-col flex-1">
                <div className="flex items-start justify-between mb-1">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={handleViewProfile}>
                        <h3 className="text-lg font-extrabold text-white group-hover:text-primary transition-colors line-clamp-1">
                            {tech.name}
                        </h3>
                        {tech.verified && <ShieldCheck className="w-4 h-4 text-primary fill-primary/10 shrink-0" />}
                    </div>
                    <div className="flex items-center gap-1 bg-white/5 rounded-full px-2 py-0.5 shrink-0">
                        <Star className="w-3.5 h-3.5 fill-primary text-primary" />
                        <span className="text-sm font-black text-white">{tech.rating}</span>
                    </div>
                </div>

                <p className="text-primary text-xs font-semibold mb-1">{tech.title}</p>

                {tech.location && (
                    <p className="text-gray-500 text-xs flex items-center gap-1 mb-3">
                        <MapPin className="w-3 h-3 shrink-0" />
                        {tech.location}
                    </p>
                )}

                <p className="text-gray-400 text-sm mb-4 line-clamp-2 leading-relaxed">
                    {tech.description || (locale === 'ar' ? 'فني خبير يقدم خدمات عالية الجودة.' : 'Expert technician providing high-quality services.')}
                </p>

                {/* Skills */}
                {tech.skills && tech.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                        {tech.skills.slice(0, 3).map((skill) => (
                            <span key={skill} className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/5 border border-white/5 text-gray-400 uppercase tracking-wider">
                                {skill}
                            </span>
                        ))}
                    </div>
                )}

                <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between gap-3">
                    <div>
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-0.5">{t('startingAt')}</p>
                        <p className="text-xl font-black text-white">
                            ${tech.hourlyRate}<span className="text-xs text-gray-400 font-medium ml-1">/hr</span>
                        </p>
                        {tech.reviews > 0 && (
                            <p className="text-[10px] text-gray-600 mt-0.5">{tech.reviews} reviews</p>
                        )}
                    </div>
                    <Button
                        onClick={handleBooking}
                        className="rounded-2xl px-5 py-3 h-auto text-sm font-extrabold bg-white text-background-dark hover:bg-primary transition-all shadow-lg shadow-white/5 shrink-0"
                    >
                        {t('bookingNow')}
                    </Button>
                </div>
            </div>
        </div>
    );
}
