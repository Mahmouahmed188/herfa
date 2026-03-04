'use client';

import React, { useState } from 'react';
import { Search, MapPin, ChevronDown, SlidersHorizontal, X, Star, Zap, Wrench, Paintbrush, Hammer } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import TechnicianResultCard, { TechnicianProps } from '@/components/technicians/TechnicianResultCard';
import FilterSidebar from '@/components/technicians/FilterSidebar';
import Button from '@/components/ui/button';

const MOCK_TECHNICIANS: TechnicianProps[] = [
    {
        id: '1',
        name: 'Alex Johnson',
        title: 'Master Electrician',
        rating: 4.9,
        reviews: 128,
        hourlyRate: 45,
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
        matchPercentage: 98,
        skills: ['Residential', 'Smart Home', 'Wiring'],
        verified: true,
        available: true,
        experience: '12 Years XP',
        location: 'Nasr City, Cairo',
        description: 'Specialized in smart home installations and complex residential wiring. Certified master electrician.'
    },
    {
        id: '4',
        name: 'Emily Wilson',
        title: 'Plumbing Expert',
        rating: 4.7,
        reviews: 84,
        hourlyRate: 40,
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
        matchPercentage: 88,
        skills: ['Pipe Repair', 'Installation', 'Emergency'],
        verified: false,
        available: true,
        experience: '6 Years XP',
        location: 'Zamalek, Cairo',
        description: 'Dependable plumbing services for leak detection and pipe replacement. Available 24/7.'
    },
    {
        id: '5',
        name: 'David Miller',
        title: 'Carpenter',
        rating: 4.9,
        reviews: 156,
        hourlyRate: 50,
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
        matchPercentage: 85,
        skills: ['Custom Furniture', 'Flooring', 'Repair'],
        verified: true,
        available: false,
        experience: '10 Years XP',
        location: 'Heliopolis, Cairo',
        description: 'Master craftsman specializing in custom furniture and flooring installation.'
    },
    {
        id: '3',
        name: 'Michael Chen',
        title: 'HVAC Specialist',
        rating: 5.0,
        reviews: 210,
        hourlyRate: 55,
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
        matchPercentage: 92,
        skills: ['AC Repair', 'Heating', 'Installation'],
        verified: true,
        available: true,
        experience: '15 Years XP',
        location: 'New Cairo, Egypt',
        description: 'Expert in all types of heating and cooling systems for residential buildings.'
    },
    {
        id: '2',
        name: 'Sarah Davis',
        title: 'Interior Designer',
        rating: 4.8,
        reviews: 95,
        hourlyRate: 60,
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
        matchPercentage: 95,
        skills: ['Modern', 'Renovation', '3D Modeling'],
        verified: true,
        available: false,
        experience: '8 Years XP',
        location: 'Maadi, Cairo',
        description: 'Creating modern, functional spaces tailored to your lifestyle and renovations.'
    }
];

const CATEGORY_ICONS = [
    { name: 'Plumbing', icon: Wrench, color: 'text-blue-400' },
    { name: 'Carpentry', icon: Hammer, color: 'text-amber-400' },
    { name: 'Electrical', icon: Zap, color: 'text-yellow-400' },
    { name: 'Painting', icon: Paintbrush, color: 'text-purple-400' },
];

export default function ServicesAndCategoriesPage() {
    const locale = useLocale();
    const t = useTranslations('Services');
    const [searchTerm, setSearchTerm] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const isRtl = locale === 'ar';

    const renderTitle = (title: string) => {
        const parts = title.split('<highlight>');
        if (parts.length > 1) {
            const secondPart = parts[1].split('</highlight>');
            return (
                <>
                    {parts[0]}
                    <span className="text-primary">{secondPart[0]}</span>
                    {secondPart[1]}
                </>
            );
        }
        return title;
    };

    return (
        <div className="bg-[#0A0F0D] min-h-screen text-white font-sans selection:bg-primary/30">
            {/* HERO SECTION - Header with More Spacing */}
            <div className="relative pt-32 pb-24 px-6 overflow-hidden border-b border-white/5">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-full bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.12)_0%,transparent_70%)] pointer-events-none"></div>

                <div className="container mx-auto max-w-4xl text-center relative z-10">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
                        {renderTitle(t('title'))}
                    </h1>
                    <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
                        {t('subtitle')}
                    </p>

                    {/* PIXEL PERFECT SEARCH BAR */}
                    <div className="flex flex-col md:flex-row items-center bg-[#1A2C22] rounded-2xl md:rounded-full border border-white/10 p-2 shadow-2xl max-w-3xl mx-auto backdrop-blur-md group focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                        <div className="flex-1 flex items-center px-5 py-3 w-full">
                            <Search className="w-5 h-5 text-primary mr-3 rtl:ml-3" />
                            <input
                                type="text"
                                placeholder={t('searchPlaceholder')}
                                className="bg-transparent w-full outline-none text-white placeholder-gray-500 text-base"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="hidden md:block w-px h-8 bg-white/10 mx-2"></div>
                        <div className="flex-[0.5] flex items-center px-5 py-3 w-full border-t md:border-t-0 border-white/10">
                            <MapPin className="w-5 h-5 text-primary mr-3 rtl:ml-3" />
                            <input
                                type="text"
                                placeholder={t('zipCodePlaceholder')}
                                className="bg-transparent w-full outline-none text-white placeholder-gray-500 text-base"
                                value={zipCode}
                                onChange={(e) => setZipCode(e.target.value)}
                            />
                        </div>
                        <Button className="w-full md:w-auto rounded-xl md:rounded-full px-10 py-4 h-auto text-base font-extrabold shadow-lg shadow-primary/20 hover:scale-105 transition-transform active:scale-95">
                            {t('search')}
                        </Button>
                    </div>
                </div>
            </div>

            {/* MAIN CONTENT AREA - Increased Spacing from Hero */}
            <div className="container mx-auto max-w-7xl px-6 pt-24 pb-32">
                <div className={`flex flex-col lg:flex-row gap-16 ${isRtl ? 'lg:flex-row-reverse' : ''}`}>

                    {/* SIDEBAR */}
                    <aside className="hidden lg:block w-72 flex-shrink-0">
                        <FilterSidebar />
                    </aside>

                    {/* CONTENT */}
                    <main className="flex-1">
                        {/* Page Controls - Showing & Sort */}
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
                            <div className="flex items-center gap-6">
                                <h2 className="text-xl font-bold text-white/90">
                                    {t('resultsFound', { count: 24 })}
                                </h2>

                                {/* Quick Category Icons */}
                                <div className="hidden md:flex items-center gap-3">
                                    {CATEGORY_ICONS.map((cat) => (
                                        <button key={cat.name} className="p-3 rounded-full bg-[#1A2C22] border border-white/5 hover:border-primary/50 transition-all hover:bg-primary/10 group">
                                            <cat.icon className={`w-5 h-5 ${cat.color} group-hover:scale-110 transition-transform`} />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center gap-4 w-full md:w-auto">
                                <div className="flex items-center gap-2 bg-[#1A2C22] border border-white/10 px-4 py-2.5 rounded-xl text-sm transition-all focus-within:border-primary/50 cursor-pointer hover:bg-white/5">
                                    <span className="text-gray-400">{t('sortBy')}:</span>
                                    <span className="font-bold text-white">{t('recommended')}</span>
                                    <ChevronDown className="w-4 h-4 text-gray-400" />
                                </div>
                                <button
                                    onClick={() => setIsFilterOpen(true)}
                                    className="lg:hidden flex items-center gap-2 bg-primary px-4 py-2.5 rounded-xl text-sm font-bold text-background-dark shadow-lg shadow-primary/20"
                                >
                                    <SlidersHorizontal className="w-4 h-4" />
                                    {t('filters')}
                                </button>
                            </div>
                        </div>

                        {/* TECHNICIAN GRID - Better Spacing */}
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                            {MOCK_TECHNICIANS.map((tech) => (
                                <TechnicianResultCard key={tech.id} tech={tech} />
                            ))}
                        </div>

                        {/* Pagination */}
                        <div className="mt-16 flex justify-center">
                            <div className="flex items-center gap-2 bg-[#1A2C22] p-1.5 rounded-full border border-white/5">
                                {[1, 2, 3, 4].map(n => (
                                    <button key={n} className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${n === 1 ? 'bg-primary text-background-dark shadow-inner shadow-black/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                                        {n}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </main>
                </div>
            </div>

            {/* MOBILE FILTER DRAWER */}
            {isFilterOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsFilterOpen(false)}></div>
                    <div className={`absolute bottom-0 left-0 right-0 max-h-[90vh] overflow-y-auto bg-[#0E1512] border-t border-white/10 rounded-t-[40px] p-8 shadow-2xl transition-transform transform ${isFilterOpen ? 'translate-y-0' : 'translate-y-full'}`}>
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-2xl font-bold">{t('filters')}</h3>
                            <button onClick={() => setIsFilterOpen(false)} className="p-2 rounded-full bg-[#1A2C22] hover:bg-white/10 transition-colors">
                                <X className="w-6 h-6 text-gray-400" />
                            </button>
                        </div>
                        <FilterSidebar className="!border-none !p-0 !bg-transparent" />
                        <div className="mt-10 grid grid-cols-2 gap-4">
                            <Button variant="outline" className="rounded-xl py-4 h-auto font-bold border-white/10" onClick={() => setIsFilterOpen(false)}>
                                {isRtl ? "إلغاء" : "Cancel"}
                            </Button>
                            <Button className="rounded-xl py-4 h-auto font-bold" onClick={() => setIsFilterOpen(false)}>
                                {isRtl ? "تطبيق" : "Apply"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
